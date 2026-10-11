# 🌟 Misi Al-Fatihah: Game Kuiz Pendidikan Islam Tahun 1

Permainan kuiz interaktif bertajuk **“Misi Al-Fatihah”** yang direka khas untuk murid **Tahun 1 (7 tahun)** bagi mata pelajaran **Pendidikan Islam di Malaysia**. 

Game ini membolehkan murid mengenali ayat, memadankan maksud, menyusun ayat, serta menguji hafazan Surah Al-Fatihah dalam suasana santai, ceria, dan menyeronokkan tanpa rasa tertekan.

Pangkalan data markah (*Leaderboard*) kini menggunakan **Google Sheets & Google Apps Script**, memudahkan para guru menyemak markah murid secara langsung seperti membuka fail Excel!

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
- **Sintesis Audio Asli (Web Audio API)**: Tona bunyi klik, chime jawapan betul, dan lagu kemenangan tanpa bergantung pada fail MP3 pihak ketiga.
- **Leaderboard Google Sheets & Mod Demo**: Markah disimpan terus ke helaian Google Sheets guru, bersama mod sandaran **Mod Demo Tempatan (localStorage)** automatik jika di luar talian (*offline*).
- **Aksesibel & Responsif**: Berfungsi lancar pada telefon pintar (Android & iPhone potret), tablet, laptop, dan komputer meja, serta menyokong kawalan papan kekunci (1, 2, 3, 4, Enter, Space).

---

## 📁 Struktur Fail Projek

```text
HAFAZAN SURAH AL-FATIHAH/
├── index.html              # Struktur semantik antaramuka game (6 skrin & modal bantuan)
├── style.css               # Gaya visual responsif, palet warna, animasi & aksesibiliti
├── script.js               # Logik permainan, pengesahan input, enjin audio & pemarkahan
├── questions.js            # Bank 35 soalan hafazan & kefahaman Surah Al-Fatihah
├── leaderboard-config.js   # Konfigurasi Google Sheets API & sandaran mod demo tempatan
└── README.md               # Panduan lengkap pemasangan, Google Sheets & penerbitan
```

---

## 📊 Cara Sambungkan Leaderboard ke Google Sheets (Mudah & Percuma!)

Dengan menggunakan Google Sheets, cikgu boleh melihat nama murid, markah, dan tarikh bermain terus di Google Drive cikgu tanpa perlu mendaftar Firebase.

### Langkah 1: Cipta Google Sheet Baru
1. Buka [Google Sheets](https://sheets.new) di pelayar web anda.
2. Namakan fail tersebut: **Leaderboard Misi Al-Fatihah**.
3. Pada baris pertama (Row 1), buat tajuk lajur seperti berikut:
   - **A1**: `Nama Murid`
   - **B1**: `Markah`
   - **C1**: `Masa (Saat)`
   - **D1**: `Tarikh`
   - **E1**: `Session ID`

### Langkah 2: Buka Apps Script
1. Di menu atas Google Sheet, klik **Extensions** $\rightarrow$ **Apps Script**.
2. Padam semua kod asal dalam editor tersebut.
3. Salin dan tampal kod Google Apps Script terkini di bawah:

```javascript
function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var params = e.parameter;
  
  // 1. SIMPAN MARKAH (ACTION = SAVE)
  if (params.action === "save") {
    var name = (params.name || "Murid").substring(0, 15);
    var score = Number(params.score) || 0;
    var timeSeconds = Number(params.time) || 0;
    var sessionId = params.sessionId || "";
    var timestamp = params.timestamp || new Date().toISOString();
    var displayDate = params.date || Utilities.formatDate(new Date(), "Asia/Kuala_Lumpur", "dd MMM yyyy, hh:mm a");
    
    // Semak jika sesi sudah disimpan (elak rekod berulang)
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][4] && data[i][4].toString() === sessionId) {
        return ContentService.createTextOutput(JSON.stringify({ status: "exists" }))
          .setMimeType(ContentService.MimeType.JSON);
      }
    }
    
    // Tambah rekod murid ke baris baru (Kolum: Nama, Markah, Masa, Timestamp/Tarikh, Session ID)
    sheet.appendRow([name, score, timeSeconds, timestamp, sessionId]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  // 2. DAPATKAN DATA (ACTION = GET)
  var data = sheet.getDataRange().getValues();
  var allRecords = [];
  
  for (var i = 1; i < data.length; i++) {
    allRecords.push({
      name: data[i][0],
      score: Number(data[i][1]) || 0,
      timeSeconds: Number(data[i][2]) || 0,
      timestamp: data[i][3] || "",
      displayDate: data[i][3] || ""
    });
  }
  
  // A. TOP 10 TERBAIK (Susun: Markah tertinggi dahulu, kemudian masa terpantas)
  var top10 = allRecords.slice();
  top10.sort(function(a, b) {
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    return a.timeSeconds - b.timeSeconds;
  });
  top10 = top10.slice(0, 10);
  
  // B. 20 REKOD PENYERTAAN TERKINI (Terbaharu di atas)
  var recent20 = allRecords.slice().reverse().slice(0, 20);
  
  return ContentService.createTextOutput(JSON.stringify({
    records: top10,
    recent: recent20
  })).setMimeType(ContentService.MimeType.JSON);
}
```

### Langkah 3: Terbitkan / Kemas Kini Sebagai Web App
1. Di bahagian kanan atas editor Apps Script:
   - **Jika kali pertama**: Klik butang biru **Deploy** $\rightarrow$ **New deployment** $\rightarrow$ pilih jenis **Web app**.
   - **Jika sudah pernah deploy**: Klik butang **Deploy** $\rightarrow$ **Manage deployments** $\rightarrow$ klik ikon pensel ✏️ (Edit) $\rightarrow$ pada pilihan **Version**, pilih **New version** $\rightarrow$ klik **Deploy**.
2. Pastikan tetapan adalah:
   - **Execute as**: `Me (<email-anda>)`
   - **Who has access**: `Anyone` *(PENTING: Pilih "Anyone" supaya murid boleh hantar markah tanpa perlu log masuk akaun Google)*
3. Salin **Web app URL** yang tertera (bermula dengan `https://script.google.com/macros/s/.../exec`).

### Langkah 4: Masukkan URL ke dalam `leaderboard-config.js`
1. Buka fail [`leaderboard-config.js`](file:///c:/Users/AlifAmzar/Desktop/HUAWEI/ANTIGRAVITY/HAFAZAN%20SURAH%20AL-FATIHAH/leaderboard-config.js).
2. Gantikan teks contoh dengan URL Web App anda:
   ```javascript
   const GOOGLE_SHEETS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbx.../exec";
   ```
3. Simpan fail dan muat naik perubahan ke GitHub repository anda!

---

## 🚀 Panduan Penerbitan ke GitHub Pages

1. Muat naik fail berikut ke repository GitHub anda (`misi-al-fatihah`):
   - `index.html`
   - `style.css`
   - `script.js`
   - `questions.js`
   - `leaderboard-config.js`
   - `README.md`
2. Pada repository GitHub anda, klik **Settings** $\rightarrow$ **Pages**.
3. Di bawah **Build and deployment** $\rightarrow$ **Branch**, pilih **`main`** dan folder **`/ (root)`**.
4. Klik **Save**. Dalam masa 1–2 minit, game anda sedia dimainkan di:
   `https://<username-anda>.github.io/misi-al-fatihah/`

---

## 🛠️ Penyelesaian Masalah Lazim (Troubleshooting)

1. **Kenapa status Leaderboard masih "Mod Demo Tempatan"?**
   - Ini bermakna pemboleh ubah `GOOGLE_SHEETS_SCRIPT_URL` di dalam `leaderboard-config.js` belum digantikan dengan URL Google Apps Script sebenar. Sila lengkapkan Langkah 3 & 4 di atas.
2. **Murid main di telefon, adakah markah masuk ke Google Sheet cikgu?**
   - Ya! Sebaik sahaja murid selesai menjawab 10 soalan, markah dan masa mereka akan dihantar terus ke Google Sheet anda dalam masa 1-2 saat.
3. **Bagaimana jika sekolah tiada sambungan internet?**
   - Game tetap berfungsi sepenuhnya! Jika tiada sambungan internet, sistem secara automatik menggunakan Mod Demo Tempatan tanpa sebarang ralat teknikal.
