/**
 * KONFIGURASI LEADERBOARD: GOOGLE SHEETS & GOOGLE APPS SCRIPT
 * 
 * Game "Misi Al-Fatihah" menggunakan Google Sheets sebagai pangkalan data leaderboard.
 * Guru boleh melihat markah semua murid secara langsung seperti membuka fail Excel!
 * 
 * Sekiranya URL Google Apps Script belum dimasukkan, game akan secara automatik
 * menggunakan "Mod Demo Tempatan" (localStorage) tanpa sebarang ralat teknikal.
 * 
 * CARA DAPATKAN URL WEB APP:
 * 1. Cipta Google Sheet baru di Google Drive anda.
 * 2. Klik menu: Extensions -> Apps Script.
 * 3. Tampal kod Apps Script yang disediakan dalam README.md.
 * 4. Klik butang: Deploy -> New deployment -> Web app.
 *    - Execute as: Me (akaun anda)
 *    - Who has access: Anyone (Sesiapa sahaja)
 * 5. Salin "Web app URL" dan gantikan pada pemboleh ubah di bawah:
 */

const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyO7Tr_WKnRtfX-r465Cq5Ue5XgWes-riGk92EhdJVtq4ZHTTpTvmK574EJSECPodT7/exec";

// Kunci storan tempatan (Mod Demo)
const LOCAL_STORAGE_LEADERBOARD_KEY = "misi_alfatihah_leaderboard_demo";
const LOCAL_STORAGE_RECENT_KEY = "misi_alfatihah_recent_demo";
const SUBMITTED_SESSIONS_KEY = "misi_alfatihah_submitted_sessions";

/**
 * Semak sama ada URL Google Apps Script telah dimasukkan dengan sah
 */
function isLeaderboardConfigured() {
  return (
    typeof GOOGLE_SHEETS_SCRIPT_URL === "string" &&
    GOOGLE_SHEETS_SCRIPT_URL.trim() !== "" &&
    !GOOGLE_SHEETS_SCRIPT_URL.includes("PASTE_YOUR") &&
    GOOGLE_SHEETS_SCRIPT_URL.startsWith("https://script.google.com/")
  );
}

/**
 * Simpan markah ke Google Sheets (atau fallback ke LocalStorage)
 * @param {Object} scoreData { name, score, timeSeconds, sessionId }
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
    return { success: true, isGlobal: isLeaderboardConfigured(), message: "Markah sesi ini telah disimpan." };
  }

  const cleanName = (name || "Murid").substring(0, 15).trim();
  const cleanScore = Number(score) || 0;
  const cleanTime = Number(timeSeconds) || 0;
  const cleanSessionId = sessionId || String(Date.now());
  const isoTimestamp = new Date().toISOString();
  const dateStr = new Date().toLocaleDateString("ms-MY", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });

  // Rekod tempatan
  const localRecord = {
    name: cleanName,
    score: cleanScore,
    timeSeconds: cleanTime,
    sessionId: cleanSessionId,
    timestamp: isoTimestamp,
    displayDate: dateStr
  };

  // 1. Simpan ke Google Sheets jika URL telah dikonfigurasi
  if (isLeaderboardConfigured()) {
    try {
      const targetUrl = new URL(GOOGLE_SHEETS_SCRIPT_URL);
      targetUrl.searchParams.append("action", "save");
      targetUrl.searchParams.append("name", cleanName);
      targetUrl.searchParams.append("score", String(cleanScore));
      targetUrl.searchParams.append("time", String(cleanTime));
      targetUrl.searchParams.append("sessionId", cleanSessionId);
      targetUrl.searchParams.append("timestamp", isoTimestamp);
      targetUrl.searchParams.append("date", dateStr);

      // Hantar permintaan ke Google Apps Script (GET request selamat merentas CORS)
      const response = await fetch(targetUrl.toString(), {
        method: "GET",
        mode: "cors",
        redirect: "follow"
      });

      if (response.ok) {
        submittedSessions.push(cleanSessionId);
        sessionStorage.setItem(SUBMITTED_SESSIONS_KEY, JSON.stringify(submittedSessions));

        // Simpan juga salinan tempatan untuk kepantasan
        saveToLocalDemo(localRecord);

        return { success: true, isGlobal: true, message: "Markah berjaya direkod ke Google Sheets!" };
      }
    } catch (err) {
      console.warn("Gagal menghubungi Google Sheets API. Menggunakan simpanan tempatan:", err);
    }
  }

  // 2. Fallback: Simpan ke localStorage (Mod Demo)
  try {
    saveToLocalDemo(localRecord);
    submittedSessions.push(cleanSessionId);
    sessionStorage.setItem(SUBMITTED_SESSIONS_KEY, JSON.stringify(submittedSessions));

    return { success: true, isGlobal: false, message: "Disimpan dalam Mod Demo Tempatan." };
  } catch (storageErr) {
    console.error("Gagal menyimpan rekod demo:", storageErr);
    return { success: false, isGlobal: false, message: "Ralat storan pelayar." };
  }
}

/**
 * Dapatkan data Top 10 dan Rekod Terkini dari Google Sheets atau LocalStorage
 * @returns {Promise<{records: Array, recent: Array, isGlobal: boolean}>}
 */
async function fetchTop10Leaderboard() {
  if (isLeaderboardConfigured()) {
    try {
      const targetUrl = new URL(GOOGLE_SHEETS_SCRIPT_URL);
      targetUrl.searchParams.append("action", "get");
      targetUrl.searchParams.append("_t", String(Date.now()));

      // Kawalan timeout 6 saat agar tidak tersangkut jika sambungan perlahan
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const response = await fetch(targetUrl.toString(), {
        method: "GET",
        mode: "cors",
        redirect: "follow",
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const result = await response.json();
        const records = (result && Array.isArray(result.records)) ? result.records.slice(0, 10) : [];
        // Jika Google Apps Script sudah menyokong result.recent, gunakan itu.
        // Jika belum (versi lama), fallback ke rekod terkini tempatan.
        let recent = [];
        if (result && Array.isArray(result.recent)) {
          recent = result.recent.slice(0, 20);
        } else {
          recent = getLocalRecentData().slice(0, 20);
        }

        return { records, recent, isGlobal: true };
      }
    } catch (err) {
      console.warn("Gagal memuat turun dari Google Sheets. Menggunakan rekod tempatan:", err);
    }
  }

  // Fallback: Ambil rekod demo tempatan
  const localList = getLocalLeaderboardData();
  const localRecent = getLocalRecentData();
  return {
    records: localList.slice(0, 10),
    recent: localRecent.slice(0, 20),
    isGlobal: false
  };
}

/**
 * Simpan satu rekod ke senarai demo tempatan (Leaderboard & Rekod Terkini)
 */
function saveToLocalDemo(record) {
  // 1. Simpan ke Top 10 (disusun mengikut markah terbaik)
  const localData = getLocalLeaderboardData();
  localData.push(record);
  localData.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeSeconds - b.timeSeconds;
  });
  localStorage.setItem(LOCAL_STORAGE_LEADERBOARD_KEY, JSON.stringify(localData.slice(0, 20)));

  // 2. Simpan ke Rekod Penyertaan Terkini (paling baharu di hadapan, maksimum 20)
  const recentData = getLocalRecentData();
  recentData.unshift({
    name: record.name,
    score: record.score,
    timeSeconds: record.timeSeconds,
    timestamp: record.timestamp || new Date().toISOString(),
    displayDate: record.displayDate || "Baru sahaja"
  });
  localStorage.setItem(LOCAL_STORAGE_RECENT_KEY, JSON.stringify(recentData.slice(0, 20)));
}

/**
 * Ambil rekod demo tempatan (Top 10) dari localStorage
 */
function getLocalLeaderboardData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_LEADERBOARD_KEY);
    if (!raw) {
      const defaultDemo = [
        { name: "Ustaz Alif", score: 100, timeSeconds: 10, displayDate: "Hari ini" },
        { name: "aina", score: 100, timeSeconds: 70, displayDate: "Hari ini" },
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

/**
 * Ambil rekod penyertaan terkini demo tempatan dari localStorage
 */
function getLocalRecentData() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RECENT_KEY);
    if (!raw) {
      const now = Date.now();
      const defaultRecent = [
        { name: "Ustaz Alif", score: 100, timeSeconds: 10, timestamp: new Date(now - 2 * 60000).toISOString(), displayDate: "2 min lalu" },
        { name: "aina", score: 100, timeSeconds: 70, timestamp: new Date(now - 15 * 60000).toISOString(), displayDate: "15 min lalu" },
        { name: "Ali", score: 100, timeSeconds: 45, timestamp: new Date(now - 35 * 60000).toISOString(), displayDate: "35 min lalu" },
        { name: "Aisyah", score: 100, timeSeconds: 52, timestamp: new Date(now - 60 * 60000).toISOString(), displayDate: "1 jam lalu" },
        { name: "Adam", score: 90, timeSeconds: 40, timestamp: new Date(now - 120 * 60000).toISOString(), displayDate: "2 jam lalu" }
      ];
      localStorage.setItem(LOCAL_STORAGE_RECENT_KEY, JSON.stringify(defaultRecent));
      return defaultRecent;
    }
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

// Buka akses global untuk skrip utama permainan
window.MisiAlFatihahLeaderboard = {
  isConfigured: isLeaderboardConfigured,
  saveScoreRecord,
  fetchTop10Leaderboard
};
