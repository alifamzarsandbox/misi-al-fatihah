/**
 * BANK SOALAN: MISI AL-FATIHAH (TAHUN 1)
 * Mengandungi 35 soalan berkualiti tinggi yang meliputi kesemua 7 ayat Surah Al-Fatihah.
 * 
 * Format Objek:
 * - id: Pengenal pasti unik
 * - type: 1 (Pilih ayat), 2 (Padankan maksud), 3 (Lengkapkan ayat), 4 (Susunan ayat), 5 (Kenali maksud), 6 (Betul/Salah)
 * - category: 'kenali' (Mengenal ayat & susunan), 'fahami' (Memahami maksud), 'campuran' (Boleh digunakan untuk kedua-duanya)
 * - question: Teks soalan utama (Bahasa Melayu)
 * - arabicText: Petikan teks Arab (jika berkaitan)
 * - options: Senarai 2 atau 4 pilihan jawapan
 * - correctAnswer: Indeks jawapan betul (0, 1, 2, atau 3)
 * - explanation: Penjelasan mesra kanak-kanak
 * - difficulty: 'mudah' | 'sederhana'
 */

const QUESTION_BANK = [
  // --- JENIS 1: PILIH AYAT YANG BETUL ---
  {
    id: "q01",
    type: 1,
    category: "kenali",
    question: "Yang manakah ayat PERTAMA Surah Al-Fatihah?",
    arabicText: null,
    options: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "مَالِكِ يَوْمِ الدِّينِ"
    ],
    correctAnswer: 0,
    explanation: "Ayat pertama Surah Al-Fatihah ialah Bismillah: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ.",
    difficulty: "mudah"
  },
  {
    id: "q02",
    type: 1,
    category: "kenali",
    question: "Yang manakah ayat KEDUA Surah Al-Fatihah?",
    arabicText: null,
    options: [
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"
    ],
    correctAnswer: 1,
    explanation: "Ayat kedua ialah: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ (Segala puji bagi Allah).",
    difficulty: "mudah"
  },
  {
    id: "q03",
    type: 1,
    category: "kenali",
    question: "Yang manakah ayat KETIGA Surah Al-Fatihah?",
    arabicText: null,
    options: [
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"
    ],
    correctAnswer: 2,
    explanation: "Ayat ketiga Surah Al-Fatihah ialah: الرَّحْمَٰنِ الرَّحِيمِ.",
    difficulty: "mudah"
  },
  {
    id: "q04",
    type: 1,
    category: "kenali",
    question: "Yang manakah ayat KEEMPAT Surah Al-Fatihah?",
    arabicText: null,
    options: [
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "مَالِكِ يَوْمِ الدِّينِ"
    ],
    correctAnswer: 3,
    explanation: "Ayat keempat Surah Al-Fatihah ialah: مَالِكِ يَوْمِ الدِّينِ.",
    difficulty: "mudah"
  },
  {
    id: "q05",
    type: 1,
    category: "kenali",
    question: "Yang manakah ayat KELIMA Surah Al-Fatihah?",
    arabicText: null,
    options: [
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
    ],
    correctAnswer: 0,
    explanation: "Ayat kelima Surah Al-Fatihah ialah: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ.",
    difficulty: "mudah"
  },
  {
    id: "q06",
    type: 1,
    category: "kenali",
    question: "Yang manakah ayat KEENAM Surah Al-Fatihah?",
    arabicText: null,
    options: [
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "الرَّحْمَٰنِ الرَّحِيمِ"
    ],
    correctAnswer: 1,
    explanation: "Ayat keenam Surah Al-Fatihah ialah: اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ.",
    difficulty: "mudah"
  },
  {
    id: "q07",
    type: 1,
    category: "kenali",
    question: "Yang manakah ayat KETUJUH (terakhir) Surah Al-Fatihah?",
    arabicText: null,
    options: [
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
    ],
    correctAnswer: 2,
    explanation: "Ayat ketujuh ialah ayat penutup: صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ.",
    difficulty: "sederhana"
  },

  // --- JENIS 2: PADANKAN AYAT DENGAN MAKSUD ---
  {
    id: "q08",
    type: 2,
    category: "fahami",
    question: "Apakah maksud ayat di bawah?",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    options: [
      "Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang",
      "Segala puji bagi Allah, Tuhan seluruh alam",
      "Tunjukilah kami jalan yang lurus",
      "Yang Menguasai hari pembalasan"
    ],
    correctAnswer: 0,
    explanation: "Maksud Bismillah ialah: Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang.",
    difficulty: "mudah"
  },
  {
    id: "q09",
    type: 2,
    category: "fahami",
    question: "Apakah maksud ayat di bawah?",
    arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    options: [
      "Segala puji bagi Allah, Tuhan seluruh alam",
      "Yang Maha Pemurah lagi Maha Penyayang",
      "Hanya kepada-Mu kami menyembah",
      "Tunjukilah kami jalan yang lurus"
    ],
    correctAnswer: 0,
    explanation: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ bermaksud: Segala puji bagi Allah, Tuhan seluruh alam.",
    difficulty: "mudah"
  },
  {
    id: "q10",
    type: 2,
    category: "fahami",
    question: "Apakah maksud ayat di bawah?",
    arabicText: "الرَّحْمَٰنِ الرَّحِيمِ",
    options: [
      "Yang Menguasai hari pembalasan",
      "Segala puji bagi Allah",
      "Yang Maha Pemurah lagi Maha Penyayang",
      "Tunjukilah kami ke jalan kebaikan"
    ],
    correctAnswer: 2,
    explanation: "الرَّحْمَٰنِ الرَّحِيمِ bermaksud: Yang Maha Pemurah lagi Maha Penyayang.",
    difficulty: "mudah"
  },
  {
    id: "q11",
    type: 2,
    category: "fahami",
    question: "Apakah maksud ayat di bawah?",
    arabicText: "مَالِكِ يَوْمِ الدِّينِ",
    options: [
      "Tunjukilah kami jalan yang lurus",
      "Yang Menguasai hari pembalasan",
      "Hanya kepada-Mu kami memohon pertolongan",
      "Dengan nama Allah Yang Maha Kuasa"
    ],
    correctAnswer: 1,
    explanation: "مَالِكِ يَوْمِ الدِّينِ bermaksud: Yang Menguasai hari pembalasan.",
    difficulty: "mudah"
  },
  {
    id: "q12",
    type: 2,
    category: "fahami",
    question: "Apakah maksud ayat di bawah?",
    arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    options: [
      "Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan",
      "Tunjukilah kami jalan yang lurus dan benar",
      "Segala puji bagi Allah Tuhan semesta alam",
      "Bukan jalan mereka yang sesat lagi rugi"
    ],
    correctAnswer: 0,
    explanation: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ bermaksud: Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan.",
    difficulty: "sederhana"
  },
  {
    id: "q13",
    type: 2,
    category: "fahami",
    question: "Apakah maksud ayat di bawah?",
    arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    options: [
      "Yang Menguasai hari akhirat kelak",
      "Tunjukilah kami jalan yang lurus",
      "Dengan nama Allah Yang Maha Pengasih",
      "Hanya kepada Allah kami memohon rezeki"
    ],
    correctAnswer: 1,
    explanation: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ bermaksud doa: Tunjukilah kami jalan yang lurus.",
    difficulty: "mudah"
  },

  // --- JENIS 3: LENGKAPKAN AYAT ---
  {
    id: "q14",
    type: 3,
    category: "kenali",
    question: "Lengkapkan ayat pertama Surah Al-Fatihah ini:",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ ...",
    options: [
      "الرَّحِيمِ",
      "الْعَالَمِينَ",
      "الدِّينِ",
      "الْمُسْتَقِيمَ"
    ],
    correctAnswer: 0,
    explanation: "Ayat penuh ialah: بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ.",
    difficulty: "mudah"
  },
  {
    id: "q15",
    type: 3,
    category: "kenali",
    question: "Lengkapkan ayat kedua Surah Al-Fatihah ini:",
    arabicText: "الْحَمْدُ لِلَّهِ رَبِّ ...",
    options: [
      "الرَّحِيمِ",
      "الْعَالَمِينَ",
      "نَسْتَعِينُ",
      "الدِّينِ"
    ],
    correctAnswer: 1,
    explanation: "Ayat penuh ialah: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.",
    difficulty: "mudah"
  },
  {
    id: "q16",
    type: 3,
    category: "kenali",
    question: "Lengkapkan ayat keempat Surah Al-Fatihah ini:",
    arabicText: "مَالِكِ يَوْمِ ...",
    options: [
      "الْعَالَمِينَ",
      "الرَّحِيمِ",
      "الدِّينِ",
      "الْمُسْتَقِيمَ"
    ],
    correctAnswer: 2,
    explanation: "Ayat penuh ialah: مَالِكِ يَوْمِ الدِّينِ.",
    difficulty: "mudah"
  },
  {
    id: "q17",
    type: 3,
    category: "kenali",
    question: "Lengkapkan ayat keenam Surah Al-Fatihah ini:",
    arabicText: "اهْدِنَا الصِّرَاطَ ...",
    options: [
      "الْمُسْتَقِيمَ",
      "الْعَالَمِينَ",
      "الدِّينِ",
      "نَسْتَعِينُ"
    ],
    correctAnswer: 0,
    explanation: "Ayat penuh ialah: اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ.",
    difficulty: "mudah"
  },
  {
    id: "q18",
    type: 3,
    category: "kenali",
    question: "Lengkapkan ayat kelima Surah Al-Fatihah ini:",
    arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ ...",
    options: [
      "الرَّحِيمِ",
      "الدِّينِ",
      "نَسْتَعِينُ",
      "الْعَالَمِينَ"
    ],
    correctAnswer: 2,
    explanation: "Ayat penuh ialah: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ.",
    difficulty: "sederhana"
  },

  // --- JENIS 4: SUSUNAN AYAT (AYAT SELEPAS / SEBELUM) ---
  {
    id: "q19",
    type: 4,
    category: "kenali",
    question: "Apakah ayat yang datang SELEPAS ayat di bawah?",
    arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    options: [
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
    ],
    correctAnswer: 0,
    explanation: "Selepas ayat 1 ialah ayat 2: الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.",
    difficulty: "mudah"
  },
  {
    id: "q20",
    type: 4,
    category: "kenali",
    question: "Apakah ayat yang datang SELEPAS ayat di bawah?",
    arabicText: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    options: [
      "مَالِكِ يَوْمِ الدِّينِ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
    ],
    correctAnswer: 1,
    explanation: "Selepas ayat 2 ialah ayat 3: الرَّحْمَٰنِ الرَّحِيمِ.",
    difficulty: "mudah"
  },
  {
    id: "q21",
    type: 4,
    category: "kenali",
    question: "Apakah ayat yang datang SELEPAS ayat di bawah?",
    arabicText: "الرَّحْمَٰنِ الرَّحِيمِ",
    options: [
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
    ],
    correctAnswer: 2,
    explanation: "Selepas ayat 3 ialah ayat 4: مَالِكِ يَوْمِ الدِّينِ.",
    difficulty: "mudah"
  },
  {
    id: "q22",
    type: 4,
    category: "kenali",
    question: "Apakah ayat yang datang SELEPAS ayat di bawah?",
    arabicText: "مَالِكِ يَوْمِ الدِّينِ",
    options: [
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
    ],
    correctAnswer: 0,
    explanation: "Selepas ayat 4 ialah ayat 5: إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ.",
    difficulty: "mudah"
  },
  {
    id: "q23",
    type: 4,
    category: "kenali",
    question: "Apakah ayat yang datang SELEPAS ayat di bawah?",
    arabicText: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    options: [
      "مَالِكِ يَوْمِ الدِّينِ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"
    ],
    correctAnswer: 1,
    explanation: "Selepas ayat 5 ialah ayat 6: اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ.",
    difficulty: "mudah"
  },
  {
    id: "q24",
    type: 4,
    category: "kenali",
    question: "Apakah ayat yang datang SELEPAS ayat di bawah?",
    arabicText: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
    options: [
      "مَالِكِ يَوْمِ الدِّينِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
    ],
    correctAnswer: 2,
    explanation: "Selepas ayat 6 ialah ayat terakhir (ke-7): صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ...",
    difficulty: "sederhana"
  },

  // --- JENIS 5: KENALI MAKSUD (BM -> ARAB) ---
  {
    id: "q25",
    type: 5,
    category: "fahami",
    question: "Pilih ayat yang bermaksud: 'Tunjukilah kami jalan yang lurus.'",
    arabicText: null,
    options: [
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "الرَّحْمَٰنِ الرَّحِيمِ"
    ],
    correctAnswer: 0,
    explanation: "Ayat 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' bermaksud memohon agar Allah menunjukkan jalan yang lurus.",
    difficulty: "mudah"
  },
  {
    id: "q26",
    type: 5,
    category: "fahami",
    question: "Pilih ayat yang bermaksud: 'Segala puji bagi Allah, Tuhan seluruh alam.'",
    arabicText: null,
    options: [
      "مَالِكِ يَوْمِ الدِّينِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"
    ],
    correctAnswer: 1,
    explanation: "'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' ialah ucapan pujian dan syukur kepada Allah.",
    difficulty: "mudah"
  },
  {
    id: "q27",
    type: 5,
    category: "fahami",
    question: "Pilih ayat yang bermaksud: 'Yang Menguasai hari pembalasan.'",
    arabicText: null,
    options: [
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ"
    ],
    correctAnswer: 2,
    explanation: "'مَالِكِ يَوْمِ الدِّينِ' menyatakan Allah berkuasa sepenuhnya pada hari pembalasan (akhirat).",
    difficulty: "mudah"
  },
  {
    id: "q28",
    type: 5,
    category: "fahami",
    question: "Pilih ayat yang bermaksud: 'Hanya kepada-Mu kami menyembah dan hanya kepada-Mu kami memohon pertolongan.'",
    arabicText: null,
    options: [
      "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "مَالِكِ يَوْمِ الدِّينِ",
      "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ"
    ],
    correctAnswer: 3,
    explanation: "'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' ialah ikrar kita hanya menyembah dan meminta tolong kepada Allah.",
    difficulty: "sederhana"
  },
  {
    id: "q29",
    type: 5,
    category: "fahami",
    question: "Pilih ayat yang bermaksud: 'Dengan nama Allah Yang Maha Pemurah lagi Maha Penyayang.'",
    arabicText: null,
    options: [
      "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
      "الرَّحْمَٰنِ الرَّحِيمِ",
      "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
      "مَالِكِ يَوْمِ الدِّينِ"
    ],
    correctAnswer: 0,
    explanation: "Bismillah (بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ) dimulakan sebelum melakukan sebarang perkara baik.",
    difficulty: "mudah"
  },

  // --- JENIS 6: BETUL ATAU SALAH ---
  {
    id: "q30",
    type: 6,
    category: "campuran",
    question: "Surah Al-Fatihah mempunyai 7 ayat.",
    arabicText: null,
    options: [
      "BETUL",
      "SALAH"
    ],
    correctAnswer: 0,
    explanation: "Betul! Surah Al-Fatihah terdiri daripada 7 ayat yang wajib kita baca dalam solat.",
    difficulty: "mudah"
  },
  {
    id: "q31",
    type: 6,
    category: "campuran",
    question: "Ayat 'مَالِكِ يَوْمِ الدِّينِ' bermaksud 'Yang Menguasai hari pembalasan'.",
    arabicText: null,
    options: [
      "BETUL",
      "SALAH"
    ],
    correctAnswer: 0,
    explanation: "Betul! 'مَالِكِ يَوْمِ الدِّينِ' bermaksud Allah Menguasai hari pembalasan.",
    difficulty: "mudah"
  },
  {
    id: "q32",
    type: 6,
    category: "campuran",
    question: "Ayat pertama Surah Al-Fatihah ialah 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ'.",
    arabicText: null,
    options: [
      "BETUL",
      "SALAH"
    ],
    correctAnswer: 1,
    explanation: "Salah. Ayat pertama ialah 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', manakala 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ' ialah ayat ke-6.",
    difficulty: "mudah"
  },
  {
    id: "q33",
    type: 6,
    category: "campuran",
    question: "Ayat 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ' bermaksud 'Tunjukilah kami jalan yang lurus'.",
    arabicText: null,
    options: [
      "BETUL",
      "SALAH"
    ],
    correctAnswer: 1,
    explanation: "Salah. Maksudnya ialah 'Segala puji bagi Allah, Tuhan seluruh alam'.",
    difficulty: "mudah"
  },
  {
    id: "q34",
    type: 6,
    category: "campuran",
    question: "Ayat 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ' ialah ayat KELIMA Surah Al-Fatihah.",
    arabicText: null,
    options: [
      "BETUL",
      "SALAH"
    ],
    correctAnswer: 0,
    explanation: "Betul! Ayat kelima ialah 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ'.",
    difficulty: "sederhana"
  },
  {
    id: "q35",
    type: 6,
    category: "campuran",
    question: "Ayat 'الرَّحْمَٰنِ الرَّحِيمِ' bermaksud 'Yang Maha Pemurah lagi Maha Penyayang'.",
    arabicText: null,
    options: [
      "BETUL",
      "SALAH"
    ],
    correctAnswer: 0,
    explanation: "Betul! Ar-Rahman bermaksud Maha Pemurah, dan Ar-Rahim bermaksud Maha Penyayang.",
    difficulty: "mudah"
  }
];

// Pastikan QUESTION_BANK boleh diakses secara global di browser & modular jika diperlukan
if (typeof module !== "undefined" && module.exports) {
  module.exports = { QUESTION_BANK };
}
