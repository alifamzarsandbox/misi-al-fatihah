/**
 * KONFIGURASI FIREBASE & MODUL LEADERBOARD GLOBAL
 * 
 * Game "Misi Al-Fatihah" menggunakan Firebase Firestore untuk leaderboard global Top 10.
 * Sekiranya Firebase belum dikonfigurasikan atau berada dalam mod luar talian (offline),
 * game akan secara automatik beralih ke "Mod Demo Tempatan" (localStorage) dengan lancar.
 * 
 * PANDUAN UNTUK PENTADBIR / GURU:
 * 1. Buka https://console.firebase.google.com/
 * 2. Cipta projek baru (contoh: "misi-al-fatihah").
 * 3. Daftar web app dan salin konfigurasi ke dalam objek `firebaseConfig` di bawah.
 * 4. Aktifkan Cloud Firestore & Anonymous Authentication (jika perlu).
 * 5. Tetapkan Firestore Security Rules seperti yang diterangkan dalam README.md.
 */

const firebaseConfig = {
  apiKey: "PASTE_YOUR_FIREBASE_API_KEY_HERE",
  authDomain: "PASTE_YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "PASTE_YOUR_PROJECT_ID",
  storageBucket: "PASTE_YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "PASTE_YOUR_SENDER_ID",
  appId: "PASTE_YOUR_APP_ID"
};

// Kunci simpanan untuk Mod Demo Tempatan (localStorage)
const LOCAL_STORAGE_LEADERBOARD_KEY = "misi_alfatihah_leaderboard_demo";
const SUBMITTED_SESSIONS_KEY = "misi_alfatihah_submitted_sessions";

/**
 * Semak sama ada konfigurasi Firebase telah dilengkapkan dengan kunci yang sah
 */
function isFirebaseConfigured() {
  return (
    firebaseConfig &&
    firebaseConfig.apiKey &&
    !firebaseConfig.apiKey.includes("PASTE_YOUR") &&
    firebaseConfig.projectId &&
    !firebaseConfig.projectId.includes("PASTE_YOUR")
  );
}

// Objek rujukan Firebase
let db = null;
let auth = null;
let isFirebaseInitialized = false;

/**
 * Inisialisasi Firebase jika konfigurasi sah dan library Firebase sedia ada
 */
async function initFirebaseServices() {
  if (!isFirebaseConfigured()) {
    console.info("ℹ️ Firebase belum dikonfigurasi. Menggunakan Mod Demo Tempatan.");
    return false;
  }

  try {
    if (typeof firebase !== "undefined" && !firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
      db = firebase.firestore();
      auth = firebase.auth();

      // Log masuk tanpa nama (Anonymous Auth) untuk keselamatan asas
      try {
        await auth.signInAnonymously();
      } catch (authError) {
        console.warn("Autentikasi tanpa nama Firebase gagal atau tidak diaktifkan:", authError);
      }

      isFirebaseInitialized = true;
      console.info("✅ Firebase Firestore berjaya dihubungkan untuk Leaderboard Global.");
      return true;
    }
  } catch (err) {
    console.warn("⚠️ Ralat memulakan Firebase Firestore:", err);
    isFirebaseInitialized = false;
  }
  return false;
}

/**
 * Simpan markah ke Firestore atau fallback ke LocalStorage
 * @param {Object} scoreData { name, score, timeSeconds, sessionId, dateStr }
 * @returns {Promise<{success: boolean, isGlobal: boolean, message: string}>}
 */
async function saveScoreRecord(scoreData) {
  const { name, score, timeSeconds, sessionId } = scoreData;

  // Elakkan penghantaran berganda dari sesi yang sama
  let submittedSessions = [];
  try {
    submittedSessions = JSON.parse(sessionStorage.getItem(SUBMITTED_SESSIONS_KEY) || "[]");
  } catch (e) {
    submittedSessions = [];
  }

  if (submittedSessions.includes(sessionId)) {
    return { success: true, isGlobal: isFirebaseInitialized, message: "Markah sesi ini telah disimpan." };
  }

  // Rekod yang bersih dan disanitasi
  const cleanRecord = {
    name: (name || "Murid").substring(0, 15).trim(),
    score: Number(score) || 0,
    timeSeconds: Number(timeSeconds) || 0,
    sessionId: sessionId || String(Date.now()),
    createdAt: new Date().toISOString(),
    displayDate: new Date().toLocaleDateString("ms-MY", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    })
  };

  // Jika Firebase aktif dan bersedia
  if (isFirebaseInitialized && db) {
    try {
      await db.collection("leaderboard").add({
        ...cleanRecord,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
      });

      submittedSessions.push(sessionId);
      sessionStorage.setItem(SUBMITTED_SESSIONS_KEY, JSON.stringify(submittedSessions));

      return { success: true, isGlobal: true, message: "Markah berjaya disimpan ke Leaderboard Global!" };
    } catch (err) {
      console.warn("Gagal menyimpan ke Firestore. Beralih ke simpanan demo tempatan:", err);
    }
  }

  // Fallback: Simpan ke localStorage (Mod Demo)
  try {
    const localData = getLocalLeaderboardData();
    localData.push(cleanRecord);

    // Susun mengikut markah (tinggi ke rendah), kemudian masa (terpantas ke lambat)
    localData.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.timeSeconds - b.timeSeconds;
    });

    // Simpan maksimum 20 rekod tempatan
    const trimmed = localData.slice(0, 20);
    localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(trimmed));

    submittedSessions.push(sessionId);
    sessionStorage.setItem(SUBMITTED_SESSIONS_KEY, JSON.stringify(submittedSessions));

    return { success: true, isGlobal: false, message: "Disimpan dalam Mod Demo Tempatan." };
  } catch (storageErr) {
    console.error("Gagal menyimpan rekod demo tempatan:", storageErr);
    return { success: false, isGlobal: false, message: "Tidak dapat menyimpan markah." };
  }
}

/**
 * Dapatkan data Top 10 dari Firestore atau LocalStorage
 * @returns {Promise<{records: Array, isGlobal: boolean}>}
 */
async function fetchTop10Leaderboard() {
  if (isFirebaseInitialized && db) {
    try {
      const snapshot = await db.collection("leaderboard")
        .orderBy("score", "desc")
        .orderBy("timeSeconds", "asc")
        .limit(10)
        .get();

      const globalRecords = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        globalRecords.push({
          id: doc.id,
          name: data.name || "Murid",
          score: data.score || 0,
          timeSeconds: data.timeSeconds || 0,
          displayDate: data.displayDate || "Baru sahaja"
        });
      });

      return { records: globalRecords, isGlobal: true };
    } catch (err) {
      console.warn("Gagal mendapatkan rekod Firestore. Menggunakan rekod demo tempatan:", err);
    }
  }

  // Ambil dari rekod demo tempatan
  const localList = getLocalLeaderboardData();
  const top10 = localList.slice(0, 10);
  return { records: top10, isGlobal: false };
}

/**
 * Ambil rekod demo tempatan dari localStorage
 */
function getLocalLeaderboardData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);
    if (!raw) {
      // Sediakan beberapa rekod sampel demo mesra murid jika belum ada rekod
      const defaultDemo = [
        { name: "Ali", score: 100, timeSeconds: 45, displayDate: "Hari ini" },
        { name: "Aisyah", score: 100, timeSeconds: 52, displayDate: "Hari ini" },
        { name: "Adam", score: 90, timeSeconds: 40, displayDate: "Hari ini" },
        { name: "Fatimah", score: 90, timeSeconds: 48, displayDate: "Hari ini" },
        { name: "Umar", score: 80, timeSeconds: 55, displayDate: "Hari ini" }
      ];
      localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(defaultDemo));
      return defaultDemo;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Buka akses global untuk skrip utama
window.MisiAlFatihahFirebase = {
  isFirebaseConfigured,
  initFirebaseServices,
  saveScoreRecord,
  fetchTop10Leaderboard
};
