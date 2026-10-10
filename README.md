# 🌟 Misi Al-Fatihah: Game Kuiz Pendidikan Islam Tahun 1

Permainan kuiz interaktif bertajuk **“Misi Al-Fatihah”** yang direka khas untuk murid **Tahun 1 (7 tahun)** bagi mata pelajaran **Pendidikan Islam di Malaysia**. 

Game ini membolehkan murid mengenali ayat, memadankan maksud, menyusun ayat, serta menguji hafazan Surah Al-Fatihah dalam suasana santai, ceria, dan menyeronokkan tanpa rasa tertekan.

---

## 🎯 Ciri-Ciri Utama Permainan

- **35 Bank Soalan Berkualiti**: Meliputi kesemua 7 ayat Surah Al-Fatihah dengan teks Arab Uthmani yang sahih serta terjemahan bahasa Melayu yang disemak.
- **6 Mekanik Soalan Pelbagai**:
  1. *Pilih ayat yang betul* (Berdasarkan turutan nombor ayat).
  2. *Padankan ayat dengan maksud* (Arab ke Bahasa Melayu).
  3. *Lengkapkan ayat* (Sambungan kalimah ayat).
  4. *Susunan ayat* (Ayat sebelum / selepas).
  5. *Kenali maksud* (Maksud Bahasa Melayu ke teks Arab).
  6. *Betul atau salah* (Kefahaman pantas).
- **3 Pilihan Misi Pembelajaran**:
  - 📖 **Kenali Ayat** (Hafazan & urutan ayat).
  - 💡 **Fahami Maksud** (Kefahaman erti ayat).
  - ⭐ **Misi Campuran** (Gabungan seimbang ayat & maksud).
- **Reka Bentuk Mesra Kanak-Kanak**: Mengadaptasi gaya antaramuka berkualiti tinggi (inspirasi Khan Academy Kids) dengan palet warna ceria, maskot buku pembelajaran comel, tipografi bulat (*Fredoka*) dan tulisan Arab (*Noto Naskh Arabic*) yang bersaiz besar dan tidak terpotong.
- **Sintesis Audio Asli (Web Audio API)**: Tona bunyi klik, chime jawapan betul, dan lagu kemenangan tanpa bergantung pada fail MP3 pihak ketiga. Boleh dihidupkan atau dimatikan pada bila-bila masa.
- **Leaderboard Global Top 10 (Firebase Firestore)**: Bersama mod sandaran **Mod Demo Tempatan (localStorage)** automatik jika Firebase belum dikonfigurasikan atau di luar talian.
- **Aksesibel & Responsif**: Berfungsi lancar pada telefon pintar (Android & iPhone potret), tablet, laptop, dan komputer meja, serta menyokong kawalan papan kekunci (1, 2, 3, 4, Enter, Space).

---

## 📁 Struktur Fail Projek

```text
HAFAZAN SURAH AL-FATIHAH/
├── index.html           # Struktur semantik antaramuka game (6 skrin & modal bantuan)
├── style.css            # Gaya visual responsif, palet warna, animasi & aksesibiliti
├── script.js            # Logik permainan, pengesahan input, enjin audio & pemarkahan
├── questions.js         # Bank 35 soalan hafazan & kefahaman Surah Al-Fatihah
├── firebase-config.js   # Konfigurasi Firebase Firestore & sandaran mod demo tempatan
└── README.md            # Panduan lengkap pemasangan, Firebase & penerbitan
```

---

## 🚀 Panduan Penerbitan ke GitHub Pages (Hosting Statik Percuma)

Game ini dibina dengan **Vanilla HTML5, CSS3, dan JavaScript**, menjadikannya 100% serasi untuk dihoskan secara percuma di GitHub Pages:

### Langkah 1: Cipta Repository di GitHub
1. Log masuk ke akaun GitHub anda di [https://github.com](https://github.com).
2. Tekan butang **New** untuk mencipta repository baru.
3. Namakan repository anda, contohnya: `misi-al-fatihah`.
4. Tetapkan visibility kepada **Public**.
5. Tekan **Create repository**.

### Langkah 2: Muat Naik Fail Projek
1. Buka folder projek di komputer anda.
2. Muat naik kesemua 6 fail (`index.html`, `style.css`, `script.js`, `questions.js`, `firebase-config.js`, `README.md`) ke dalam branch utama (`main`).
3. Anda boleh menggunakan arahan Git atau butang *“Upload files”* pada laman GitHub:
   ```bash
   git init
   git add .
   git commit -m "Misi Al-Fatihah v1.0"
   git branch -M main
   git remote add origin https://github.com/<username-anda>/misi-al-fatihah.git
   git push -u origin main
   ```

### Langkah 3: Aktifkan GitHub Pages
1. Pada repository anda di GitHub, buka tab **Settings**.
2. Di menu sebelah kiri, pilih **Pages**.
3. Di bawah bahagian **Build and deployment** -> **Branch**:
   - Pilih branch: `main`
   - Pilih folder: `/ (root)`
4. Tekan **Save**.
5. Dalam masa 1–2 minit, laman web anda akan aktif di pautan:
   `https://<username-anda>.github.io/misi-al-fatihah/`

---

## 🔥 Konfigurasi Firebase Firestore (Untuk Leaderboard Global)

Secara lalai, game ini boleh terus dimainkan dalam **Mod Demo Tempatan** tanpa Firebase. Namun, jika anda ingin mengaktifkan **Leaderboard Global Top 10** merentas peranti murid:

### Langkah 1: Cipta Projek Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/) dan log masuk dengan Google.
2. Tekan **Add project** (Tambah projek).
3. Berikan nama projek (contoh: `misi-al-fatihah-sekolah`).
4. Matikan Google Analytics (pilihan) dan tekan **Create project**.

### Langkah 2: Aktifkan Cloud Firestore
1. Pada menu sebelah kiri console Firebase, klik **Build** -> **Firestore Database**.
2. Tekan **Create database**.
3. Pilih lokasi pelayan terdekat (contoh: `asia-southeast1` untuk Malaysia / Singapura).
4. Pilih **Start in production mode**.

### Langkah 3: Aktifkan Anonymous Authentication
1. Pada menu kiri, klik **Build** -> **Authentication**.
2. Tekan **Get Started**.
3. Pada tab **Sign-in method**, pilih **Anonymous** dan tukar status ke **Enable**.
4. Tekan **Save**.

### Langkah 4: Masukkan Konfigurasi ke dalam `firebase-config.js`
1. Di Firebase Console, klik ikon gear (Project Settings) di sebelah kiri atas.
2. Di bahagian **Your apps**, klik ikon Web (`</>`).
3. Masukkan nama aplikasi (contoh: `Misi Al-Fatihah Web`) dan tekan **Register app**.
4. Salin objek `firebaseConfig` yang dipaparkan dan tampal ke dalam fail `firebase-config.js`:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD-CONTOH-KUNCI-API-ANDA",
  authDomain: "misi-al-fatihah.firebaseapp.com",
  projectId: "misi-al-fatihah",
  storageBucket: "misi-al-fatihah.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};
```

### Langkah 5: Tetapkan Peraturan Keselamatan Firestore (Security Rules)
Bagi mengelakkan manipulasi markah atau penyalahgunaan pangkalan data, buka tab **Rules** di Cloud Firestore dan gunakan peraturan selamat ini:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      // Benarkan sesiapa membaca Top 10
      allow read: if true;
      
      // Benarkan simpan rekod hanya jika data mematuhi format sah
      allow create: if request.resource.data.score is number
                    && request.resource.data.score >= 0 
                    && request.resource.data.score <= 100
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 15
                    && request.resource.data.timeSeconds is number
                    && request.resource.data.sessionId is string;
      
      // Halang sebarang kemas kini atau pemadaman daripada pelayar murid
      allow update, delete: if false;
    }
  }
}
```
Tekan **Publish** untuk mengaktifkan peraturan tersebut.

---

## 📱 Menguji Leaderboard Pada Pelbagai Peranti

1. Buka pautan GitHub Pages pada telefon pintar (Peranti A).
2. Masukkan nama (contoh: `Aiman`), selesaikan 10 soalan kuiz.
3. Buka pautan yang sama pada komputer atau tablet (Peranti B).
4. Tekan butang **JUARA LEADERBOARD** pada Peranti B.
5. Rekod markah `Aiman` dari Peranti A akan terpapar serta-merta pada papan pendahulu Peranti B!

---

## 🛠️ Penyelesaian Masalah Lazim (Troubleshooting)

1. **Bagaimana jika sekolah tiada sambungan internet yang stabil?**
   - Game tetap berfungsi sepenuhnya! Jika Firebase tidak dapat diakses, sistem secara automatik menyimpan rekod dalam `localStorage` (Mod Demo Tempatan) tanpa memaparkan mesej ralat yang mengganggu tumpuan murid.
2. **Tulisan Arab tidak kelihatan sempurna atau terpotong?**
   - Fail `style.css` telah dioptimumkan dengan nilai `line-height: 2.1` dan font `Noto Naskh Arabic` bersama atribut `dir="rtl"`. Pastikan pelayar web menyokong sambungan internet untuk memuat turun font Google Noto Naskh.
3. **Tiada bunyi keluar semasa bermain?**
   - Pastikan butang bunyi 🔊 di bahagian kanan atas berada dalam keadaan aktif.
   - Kebanyakan pelayar moden (seperti Safari & Chrome) memerlukan sekurang-kurangnya satu interaksi klik daripada pengguna sebelum membenarkan audio dimainkan.
4. **Nama murid tidak boleh dimasukkan?**
   - Nama dihadkan kepada huruf, nombor dan ruang dengan panjang maksimum 15 aksara bagi menjaga privasi kanak-kanak dan kesesuaian paparan.

---

## 📜 Hak Cipta & Integriti Teks

- Teks ayat-ayat Al-Quran dan terjemahan Surah Al-Fatihah yang digunakan disemak rapi mengikut mushaf standard dan terjemahan yang diperakui di Malaysia.
- Tiada sebarang ilustrasi yang menggambarkan Allah, para nabi atau kandungan Al-Quran secara tidak wajar digunakan.
- Selamat, bebas iklan dan mesra privasi kanak-kanak.
