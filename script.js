/**
 * MISI AL-FATIHAH - LOGIK UTAMA PERMAINAN (JAVASCRIPT)
 * Dibina khas untuk Murid Tahun 1 (Pendidikan Islam Malaysia)
 * 
 * Ciri-ciri:
 * - Tiada kebergantungan library pihak ketiga berat.
 * - Sintesis audio Web Audio API (100% berfungsi tanpa fail MP3 luar).
 * - Pengesahan dan sanitasi nama yang ketat (Bebas XSS).
 * - Pemilihan rawak 10 soalan tanpa ulangan dalam satu sesi.
 * - Sokongan papan kekunci (1-4, Enter).
 * - Integrasi Firebase Firestore & Fallback Mod Demo Tempatan yang lancar.
 */

(function () {
  "use strict";

  // =========================================================================
  // 1. KEADAAN PERMAINAN (STATE MANAGEMENT)
  // =========================================================================
  const state = {
    playerName: "",
    selectedMission: "campuran", // 'campuran' | 'kenali' | 'fahami'
    sessionQuestions: [],
    currentIndex: 0,
    score: 0,
    correctCount: 0,
    wrongCount: 0,
    isAnswered: false,
    sessionStartTime: 0,
    sessionId: "",
    soundEnabled: true,
    audioContext: null
  };

  // Bilangan soalan per sesi
  const QUESTIONS_PER_SESSION = 10;
  const POINTS_PER_QUESTION = 10;

  // =========================================================================
  // 2. RUJUKAN ELEMEN DOM
  // =========================================================================
  const elements = {
    // Skrin
    screens: {
      home: document.getElementById("screen-home"),
      name: document.getElementById("screen-name"),
      mission: document.getElementById("screen-mission"),
      quiz: document.getElementById("screen-quiz"),
      results: document.getElementById("screen-results"),
      leaderboard: document.getElementById("screen-leaderboard")
    },

    // Kawalan Header
    soundToggleBtn: document.getElementById("btn-toggle-sound"),
    soundIcon: document.getElementById("sound-icon"),
    headerHelpBtn: document.getElementById("btn-header-help"),

    // Skrin A: Utama
    btnStartGame: document.getElementById("btn-start-game"),
    btnViewLeaderboard: document.getElementById("btn-view-leaderboard"),
    btnHowToPlay: document.getElementById("btn-how-to-play"),

    // Skrin B: Nama
    nameInput: document.getElementById("player-name-input"),
    nameError: document.getElementById("name-error"),
    btnSubmitName: document.getElementById("btn-submit-name"),
    btnBackFromName: document.getElementById("btn-back-from-name"),

    // Skrin C: Misi
    missionCards: document.querySelectorAll(".mission-card"),
    btnConfirmMission: document.getElementById("btn-confirm-mission"),
    btnBackFromMission: document.getElementById("btn-back-from-mission"),

    // Skrin D: Kuiz
    quizStudentName: document.getElementById("quiz-student-name"),
    quizCounter: document.getElementById("quiz-counter"),
    quizScore: document.getElementById("quiz-current-score"),
    progressBar: document.getElementById("quiz-progress-bar"),
    questionText: document.getElementById("quiz-question-text"),
    arabicContainer: document.getElementById("quiz-arabic-container"),
    optionsContainer: document.getElementById("quiz-options-container"),
    feedbackBox: document.getElementById("quiz-feedback-box"),
    feedbackIcon: document.getElementById("feedback-icon"),
    feedbackTitle: document.getElementById("feedback-title"),
    feedbackExplanation: document.getElementById("feedback-explanation"),
    btnNextQuestion: document.getElementById("btn-next-question"),

    // Skrin E: Keputusan
    resultsPlayerName: document.getElementById("results-player-name"),
    resultsScoreValue: document.getElementById("results-score-value"),
    resultsMessageBox: document.getElementById("results-message-box"),
    resultsBadgeIcon: document.getElementById("results-badge-icon"),
    statCorrectCount: document.getElementById("stat-correct-count"),
    statWrongCount: document.getElementById("stat-wrong-count"),
    statPercent: document.getElementById("stat-percent"),
    btnPlayAgain: document.getElementById("btn-play-again"),
    btnResultsLeaderboard: document.getElementById("btn-results-leaderboard"),
    btnResultsHome: document.getElementById("btn-results-home"),

    // Skrin F: Leaderboard
    leaderboardStatusBadge: document.getElementById("leaderboard-status-badge"),
    leaderboardList: document.getElementById("leaderboard-list"),
    btnLeaderboardPlay: document.getElementById("btn-leaderboard-play"),
    btnBackFromLeaderboard: document.getElementById("btn-back-from-leaderboard"),

    // Modal Panduan
    modalHowToPlay: document.getElementById("modal-how-to-play"),
    btnCloseModal: document.getElementById("btn-close-modal"),

    // Pembaca Skrin & Kanvas
    ariaAnnouncer: document.getElementById("aria-announcer"),
    confettiCanvas: document.getElementById("confetti-canvas")
  };

  // =========================================================================
  // 3. ENJIN AUDIO MESRA KANAK-KANAK (WEB AUDIO API)
  // =========================================================================
  // Sintesis tona bunyi yang lembut dan ceria secara terus melalui Web Audio
  // Tanpa sebarang fail MP3 luar yang boleh rosak atau gagal dimuat turun.
  function getAudioContext() {
    if (!state.audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        state.audioContext = new AudioCtx();
      }
    }
    if (state.audioContext && state.audioContext.state === "suspended") {
      state.audioContext.resume();
    }
    return state.audioContext;
  }

  function playSound(type) {
    if (!state.soundEnabled) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    try {
      if (type === "click") {
        // Bunyi klik lembut seperti buih (pop)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } 
      else if (type === "correct") {
        // Melodi dwi-nada ceria gembira (chime E5 -> A5)
        const notes = [659.25, 880];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.12);
          gain.gain.setValueAtTime(0.2, now + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.12 + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.12);
          osc.stop(now + idx * 0.12 + 0.28);
        });
      } 
      else if (type === "wrong") {
        // Tona lembut untuk galakan (bukan bunyi buzzer menakutkan)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.22);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
      } 
      else if (type === "fanfare") {
        // Fanfare kemenangan ringkas
        const chords = [523.25, 659.25, 783.99, 1046.50];
        chords.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.1);
          gain.gain.setValueAtTime(0.25, now + idx * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.1);
          osc.stop(now + idx * 0.1 + 0.45);
        });
      }
    } catch (e) {
      console.warn("Audio Web Audio API dihalang oleh pelayar:", e);
    }
  }

  function initSoundPreference() {
    const saved = localStorage.getItem("misi_alfatihah_sound");
    state.soundEnabled = saved !== null ? saved === "true" : true;
    updateSoundIcon();
  }

  function toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    localStorage.setItem("misi_alfatihah_sound", String(state.soundEnabled));
    updateSoundIcon();
    if (state.soundEnabled) {
      playSound("click");
    }
    announceAria(state.soundEnabled ? "Bunyi dihidupkan" : "Bunyi dimatikan");
  }

  function updateSoundIcon() {
    if (elements.soundIcon) {
      elements.soundIcon.textContent = state.soundEnabled ? "🔊" : "🔇";
      elements.soundToggleBtn.setAttribute(
        "aria-label",
        state.soundEnabled ? "Matikan kesan bunyi" : "Hidupkan kesan bunyi"
      );
    }
  }

  // =========================================================================
  // 4. NAVIGASI SKRIN & AKSESIBILITI
  // =========================================================================
  function showScreen(screenKey) {
    Object.keys(elements.screens).forEach((key) => {
      const el = elements.screens[key];
      if (el) {
        if (key === screenKey) {
          el.classList.add("active");
          // Fokus pada elemen utama dalam skrin untuk aksesibiliti
          const firstFocusable = el.querySelector("h1, h2, input, button");
          if (firstFocusable && typeof firstFocusable.focus === "function") {
            firstFocusable.focus();
          }
        } else {
          el.classList.remove("active");
        }
      }
    });

    // Skrol ke atas secara automatik
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function announceAria(message) {
    if (elements.ariaAnnouncer) {
      elements.ariaAnnouncer.textContent = "";
      setTimeout(() => {
        elements.ariaAnnouncer.textContent = message;
      }, 50);
    }
  }

  // =========================================================================
  // 5. PENGESAHAN & SANITASI NAMA MURID (BEBAS XSS)
  // =========================================================================
  function validatePlayerName(rawName) {
    const trimmed = (rawName || "").trim();

    if (!trimmed) {
      return { valid: false, error: "Sila masukkan nama anda dahulu ya! 😊" };
    }

    if (trimmed.length > 15) {
      return { valid: false, error: "Nama maksimum 15 aksara sahaja." };
    }

    // Hanya benarkan huruf, nombor dan ruang
    const validPattern = /^[a-zA-Z0-9\s]+$/;
    if (!validPattern.test(trimmed)) {
      return { valid: false, error: "Hanya gunakan huruf dan nombor sahaja ya." };
    }

    return { valid: true, name: trimmed };
  }

  function handleNameSubmit() {
    playSound("click");
    const result = validatePlayerName(elements.nameInput.value);

    if (!result.valid) {
      elements.nameError.textContent = result.error;
      elements.nameInput.focus();
      return;
    }

    elements.nameError.textContent = "";
    state.playerName = result.name;

    // Simpan nama sementara untuk memudahkan murid bermain semula
    try {
      localStorage.setItem("misi_alfatihah_last_name", state.playerName);
    } catch (e) {}

    // Teruskan ke pemilihan misi
    showScreen("mission");
    announceAria(`Nama ${state.playerName} disimpan. Pilih jenis misi.`);
  }

  // =========================================================================
  // 6. RAWAK & PENJANAAN SOALAN PER SESI
  // =========================================================================
  /**
   * Mengacak tatasusunan menggunakan algoritma Fisher-Yates
   */
  function shuffleArray(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Sediakan 10 soalan unik mengikut misi yang dipilih
   */
  function prepareSessionQuestions() {
    if (typeof QUESTION_BANK === "undefined" || !Array.isArray(QUESTION_BANK) || QUESTION_BANK.length === 0) {
      console.error("Bank soalan tidak ditemui!");
      return [];
    }

    let filtered = [];
    if (state.selectedMission === "kenali") {
      filtered = QUESTION_BANK.filter(q => q.category === "kenali" || q.category === "campuran");
    } else if (state.selectedMission === "fahami") {
      filtered = QUESTION_BANK.filter(q => q.category === "fahami" || q.category === "campuran");
    } else {
      // Misi Campuran (Gunakan semua)
      filtered = [...QUESTION_BANK];
    }

    // Pastikan soalan cukup (jika kurang 10, ambil dari semua)
    if (filtered.length < QUESTIONS_PER_SESSION) {
      filtered = [...QUESTION_BANK];
    }

    // Rawakkan soalan dan pilih tepat 10 soalan
    const shuffledQuestions = shuffleArray(filtered).slice(0, QUESTIONS_PER_SESSION);

    // Untuk setiap soalan, rawakkan pilihan jawapan sambil mengekalkan jawapan betul
    return shuffledQuestions.map(q => {
      const originalCorrectText = q.options[q.correctAnswer];
      const shuffledOptions = shuffleArray(q.options);
      const newCorrectIndex = shuffledOptions.indexOf(originalCorrectText);

      return {
        ...q,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex
      };
    });
  }

  // =========================================================================
  // 7. MEMULAKAN & MENJALANKAN KUIZ
  // =========================================================================
  function startQuizSession() {
    playSound("click");
    state.sessionQuestions = prepareSessionQuestions();

    if (state.sessionQuestions.length === 0) {
      alert("Maaf, soalan tidak dapat dimuatkan. Sila muat semula halaman.");
      return;
    }

    state.currentIndex = 0;
    state.score = 0;
    state.correctCount = 0;
    state.wrongCount = 0;
    state.isAnswered = false;
    state.sessionStartTime = Date.now();
    state.sessionId = `session_${Date.now()}_${Math.floor(Math.random() * 10000)}`;

    // Kemas kini nama murid pada header kuiz
    elements.quizStudentName.textContent = state.playerName;

    showScreen("quiz");
    renderCurrentQuestion();
  }

  function renderCurrentQuestion() {
    state.isAnswered = false;
    const q = state.sessionQuestions[state.currentIndex];
    const questionNumber = state.currentIndex + 1;

    // Sembunyikan maklum balas sebelumnya
    elements.feedbackBox.classList.remove("active", "correct", "wrong");

    // Kemas kini metadata
    elements.quizCounter.textContent = `Soalan ${questionNumber} / ${QUESTIONS_PER_SESSION}`;
    elements.quizScore.textContent = `${state.score} Mata`;

    // Bar kemajuan
    const progressPercent = (questionNumber / QUESTIONS_PER_SESSION) * 100;
    elements.progressBar.style.width = `${progressPercent}%`;
    elements.progressBar.parentElement.setAttribute("aria-valuenow", String(progressPercent));

    // Paparkan teks soalan
    elements.questionText.textContent = q.question;

    // Paparkan ayat Arab jika wujud
    if (q.arabicText) {
      elements.arabicContainer.textContent = q.arabicText;
      elements.arabicContainer.style.display = "block";
    } else {
      elements.arabicContainer.textContent = "";
      elements.arabicContainer.style.display = "none";
    }

    // Bersihkan pilihan lama
    elements.optionsContainer.innerHTML = "";

    // Tentukan jenis susun atur kad (Binary untuk Betul/Salah, Quad untuk 4 pilihan)
    const isBinary = q.options.length === 2;
    if (isBinary) {
      elements.optionsContainer.className = "options-grid type-binary";
    } else {
      elements.optionsContainer.className = "options-grid type-quad";
    }

    // Semak sama ada pilihan mengandungi teks Arab
    const containsArabicChars = /[\u0600-\u06FF]/;

    const optionLabels = ["A", "B", "C", "D"];

    q.options.forEach((optText, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.setAttribute("data-index", String(idx));
      btn.setAttribute("aria-label", `Pilihan ${isBinary ? "" : optionLabels[idx] + ":"} ${optText}`);

      if (isBinary) {
        btn.classList.add("binary-btn");
      }

      const hasArabic = containsArabicChars.test(optText);
      if (hasArabic) {
        btn.classList.add("has-arabic");
      }

      // Label penanda pilihan
      if (!isBinary) {
        const badge = document.createElement("span");
        badge.className = "option-letter";
        badge.textContent = optionLabels[idx];
        btn.appendChild(badge);
      }

      const textSpan = document.createElement("span");
      textSpan.textContent = optText;
      btn.appendChild(textSpan);

      btn.addEventListener("click", () => handleSelectAnswer(idx));
      elements.optionsContainer.appendChild(btn);
    });

    announceAria(`Soalan ${questionNumber}. ${q.question}`);
  }

  function handleSelectAnswer(selectedIndex) {
    if (state.isAnswered) return;
    state.isAnswered = true;

    const q = state.sessionQuestions[state.currentIndex];
    const isCorrect = selectedIndex === q.correctAnswer;
    const optionButtons = elements.optionsContainer.querySelectorAll(".option-btn");

    // Kunci semua butang
    optionButtons.forEach(btn => {
      btn.disabled = true;
    });

    if (isCorrect) {
      state.score += POINTS_PER_QUESTION;
      state.correctCount++;
      playSound("correct");

      // Warnakan butang pilihan yang betul
      const selectedBtn = elements.optionsContainer.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedBtn) {
        selectedBtn.classList.add("selected-correct");
      }

      // Tunjukkan maklum balas positif
      elements.feedbackBox.className = "feedback-box correct active";
      elements.feedbackIcon.textContent = "🌟";
      elements.feedbackTitle.textContent = "Hebat! Jawapan betul!";
      elements.feedbackExplanation.textContent = q.explanation || "Syabas! Anda sangat bijak!";
      announceAria("Jawapan betul! Hebat!");
    } else {
      state.wrongCount++;
      playSound("wrong");

      // Warnakan butang yang salah dipilih
      const selectedBtn = elements.optionsContainer.querySelector(`[data-index="${selectedIndex}"]`);
      if (selectedBtn) {
        selectedBtn.classList.add("selected-wrong");
      }

      // Tunjukkan juga jawapan yang sepatutnya betul secara lembut
      const correctBtn = elements.optionsContainer.querySelector(`[data-index="${q.correctAnswer}"]`);
      if (correctBtn) {
        correctBtn.classList.add("highlight-correct");
      }

      // Maklum balas yang membina dan mendidik
      elements.feedbackBox.className = "feedback-box wrong active";
      elements.feedbackIcon.textContent = "💡";
      elements.feedbackTitle.textContent = "Cuba lagi lain kali! Jom belajar bersama.";
      elements.feedbackExplanation.textContent = q.explanation || `Jawapan yang tepat ialah: ${q.options[q.correctAnswer]}`;
      announceAria("Kurang tepat. Jom baca penjelasannya.");
    }

    // Kemas kini mata terkini
    elements.quizScore.textContent = `${state.score} Mata`;

    // Fokuskan butang soalan seterusnya
    elements.btnNextQuestion.focus();
  }

  function handleNextQuestion() {
    playSound("click");
    state.currentIndex++;

    if (state.currentIndex < QUESTIONS_PER_SESSION) {
      renderCurrentQuestion();
    } else {
      finishQuiz();
    }
  }

  // =========================================================================
  // 8. KEPUTUSAN PERMAINAN & PENYIMPANAN
  // =========================================================================
  async function finishQuiz() {
    const timeTakenSeconds = Math.max(1, Math.round((Date.now() - state.sessionStartTime) / 1000));
    const percentage = Math.round((state.score / (QUESTIONS_PER_SESSION * POINTS_PER_QUESTION)) * 100);

    // Bunyi kemenangan
    playSound("fanfare");

    // Paparkan data pada skrin keputusan (Gunakan textContent untuk elak XSS)
    elements.resultsPlayerName.textContent = state.playerName;
    elements.resultsScoreValue.textContent = `${state.score}`;
    elements.statCorrectCount.textContent = `${state.correctCount}`;
    elements.statWrongCount.textContent = `${state.wrongCount}`;
    elements.statPercent.textContent = `${percentage}%`;

    // Mesej motivasi mengikut rubrik
    let message = "";
    let badgeIcon = "🏆";

    if (state.score >= 90) {
      message = "Hebat! Anda sangat mengenali Surah Al-Fatihah!";
      badgeIcon = "🌟";
      triggerConfetti();
    } else if (state.score >= 81) {
      message = "Bagus sekali! Teruskan usaha yang cemerlang!";
      badgeIcon = "⭐";
      triggerConfetti();
    } else if (state.score >= 70) {
      message = "Bagus! Teruskan berlatih membaca dan menghafaz!";
      badgeIcon = "👍";
    } else if (state.score >= 40) {
      message = "Usaha yang baik! Mari cuba lagi untuk skor lebih tinggi!";
      badgeIcon = "📖";
    } else {
      message = "Jangan putus asa. Kita belajar sedikit demi sedikit!";
      badgeIcon = "🌱";
    }

    elements.resultsMessageBox.textContent = message;
    elements.resultsBadgeIcon.textContent = badgeIcon;

    showScreen("results");
    announceAria(`Tahniah ${state.playerName}! Markah anda ialah ${state.score} daripada 100 mata.`);

    // Simpan rekod markah secara latar belakang (Google Sheets API / Fallback Demo)
    if (window.MisiAlFatihahLeaderboard && typeof window.MisiAlFatihahLeaderboard.saveScoreRecord === "function") {
      try {
        await window.MisiAlFatihahLeaderboard.saveScoreRecord({
          name: state.playerName,
          score: state.score,
          timeSeconds: timeTakenSeconds,
          sessionId: state.sessionId
        });
      } catch (err) {
        console.warn("Gagal menyimpan markah:", err);
      }
    }
  }

  // =========================================================================
  // 9. LEADERBOARD TOP 10
  // =========================================================================
  async function loadAndDisplayLeaderboard() {
    showScreen("leaderboard");
    elements.leaderboardStatusBadge.textContent = "Sedang mengambil data kedudukan...";
    elements.leaderboardList.innerHTML = `<li class="leaderboard-empty">Memuatkan senarai juara...</li>`;

    let data = { records: [], isGlobal: false };

    if (window.MisiAlFatihahLeaderboard && typeof window.MisiAlFatihahLeaderboard.fetchTop10Leaderboard === "function") {
      try {
        data = await window.MisiAlFatihahLeaderboard.fetchTop10Leaderboard();
      } catch (e) {
        console.warn("Ralat memuatkan leaderboard:", e);
      }
    }

    // Kemas kini status mod (Global Google Sheets atau Demo Tempatan)
    if (data.isGlobal) {
      elements.leaderboardStatusBadge.textContent = "📊 Leaderboard Google Sheets Aktif";
      elements.leaderboardStatusBadge.style.color = "var(--success-green-dark)";
    } else {
      elements.leaderboardStatusBadge.textContent = "ℹ️ Mod Demo Tempatan (Google Sheets belum diaktifkan)";
      elements.leaderboardStatusBadge.style.color = "var(--muted-text)";
    }

    elements.leaderboardList.innerHTML = "";

    if (!data.records || data.records.length === 0) {
      elements.leaderboardList.innerHTML = `<li class="leaderboard-empty">Belum ada rekod permainan. Jadilah juara yang pertama!</li>`;
      return;
    }

    const medalIcons = ["🥇", "🥈", "🥉"];

    data.records.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = `leaderboard-item ${index < 3 ? `rank-${index + 1}` : ""}`;

      const leftDiv = document.createElement("div");
      leftDiv.className = "lb-left";

      const rankBadge = document.createElement("div");
      rankBadge.className = "lb-rank";
      rankBadge.textContent = index < 3 ? medalIcons[index] : String(index + 1);

      const nameBox = document.createElement("div");
      const nameEl = document.createElement("div");
      nameEl.className = "lb-name";
      nameEl.textContent = (item.name || "Murid").substring(0, 15);

      const dateEl = document.createElement("div");
      dateEl.className = "lb-date";
      dateEl.textContent = item.displayDate || "Baru sahaja";

      nameBox.appendChild(nameEl);
      nameBox.appendChild(dateEl);

      leftDiv.appendChild(rankBadge);
      leftDiv.appendChild(nameBox);

      const rightDiv = document.createElement("div");
      rightDiv.className = "lb-right";

      const scoreEl = document.createElement("div");
      scoreEl.className = "lb-score";
      scoreEl.textContent = `${item.score} mata`;

      const timeEl = document.createElement("div");
      timeEl.className = "lb-time";
      if (item.timeSeconds) {
        timeEl.textContent = `${item.timeSeconds} saat`;
      }

      rightDiv.appendChild(scoreEl);
      if (item.timeSeconds) {
        rightDiv.appendChild(timeEl);
      }

      li.appendChild(leftDiv);
      li.appendChild(rightDiv);

      elements.leaderboardList.appendChild(li);
    });

    announceAria("Senarai Top 10 Juara Misi Al-Fatihah dipaparkan.");
  }

  // =========================================================================
  // 10. KANVAS KONFETI RINGAN (KERAIAN MARKAH TINGGI)
  // =========================================================================
  function triggerConfetti() {
    const canvas = elements.confettiCanvas;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ["#FFD166", "#75C9F5", "#FF8FAB", "#62C370", "#FFFFFF"];
    const particles = [];
    const count = 55;

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10 - Math.random() * 50,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        speedY: Math.random() * 3 + 2,
        speedX: Math.random() * 2 - 1,
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 6 - 3
      });
    }

    let frame = 0;
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 180) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(animate);
  }

  // =========================================================================
  // 11. MODAL PANDUAN CARA BERMAIN
  // =========================================================================
  function openHelpModal() {
    playSound("click");
    elements.modalHowToPlay.classList.add("active");
    elements.btnCloseModal.focus();
  }

  function closeHelpModal() {
    playSound("click");
    elements.modalHowToPlay.classList.remove("active");
  }

  // =========================================================================
  // 12. PENGENDALI PAPAN KEKUNCI (AKSESIBILITI)
  // =========================================================================
  function setupKeyboardListeners() {
    document.addEventListener("keydown", (e) => {
      // Jika modal aktif, tekan Escape untuk tutup
      if (elements.modalHowToPlay.classList.contains("active")) {
        if (e.key === "Escape") {
          closeHelpModal();
        }
        return;
      }

      // Semasa skrin kuiz sedang aktif
      if (elements.screens.quiz.classList.contains("active")) {
        // Jika belum jawab, benarkan kekunci 1, 2, 3, 4
        if (!state.isAnswered) {
          const keyNum = parseInt(e.key, 10);
          if (keyNum >= 1 && keyNum <= 4) {
            const btn = elements.optionsContainer.querySelector(`[data-index="${keyNum - 1}"]`);
            if (btn && !btn.disabled) {
              e.preventDefault();
              handleSelectAnswer(keyNum - 1);
            }
          }
        } else {
          // Jika sudah jawab, tekan Enter atau Space untuk soalan seterusnya
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNextQuestion();
          }
        }
      }
    });
  }

  // =========================================================================
  // 13. INISIALISASI ACARA & PEMASANGAN LISTENER
  // =========================================================================
  function setupEventListeners() {
    // Kawalan Bunyi & Modal
    elements.soundToggleBtn.addEventListener("click", toggleSound);
    elements.headerHelpBtn.addEventListener("click", openHelpModal);
    elements.btnHowToPlay.addEventListener("click", openHelpModal);
    elements.btnCloseModal.addEventListener("click", closeHelpModal);

    // Skrin Utama
    elements.btnStartGame.addEventListener("click", () => {
      playSound("click");
      // Ambil nama terdahulu jika ada
      try {
        const cached = localStorage.getItem("misi_alfatihah_last_name");
        if (cached) elements.nameInput.value = cached;
      } catch (e) {}

      showScreen("name");
      elements.nameInput.focus();
    });

    elements.btnViewLeaderboard.addEventListener("click", () => {
      playSound("click");
      loadAndDisplayLeaderboard();
    });

    // Skrin Nama
    elements.btnSubmitName.addEventListener("click", handleNameSubmit);
    elements.nameInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleNameSubmit();
      }
    });
    elements.btnBackFromName.addEventListener("click", () => {
      playSound("click");
      showScreen("home");
    });

    // Skrin Pemilihan Misi
    elements.missionCards.forEach(card => {
      card.addEventListener("click", () => {
        playSound("click");
        elements.missionCards.forEach(c => {
          c.classList.remove("selected");
          c.setAttribute("aria-checked", "false");
        });
        card.classList.add("selected");
        card.setAttribute("aria-checked", "true");
        state.selectedMission = card.getAttribute("data-mission");
      });

      // Sokongan papan kekunci untuk kad misi
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          card.click();
        }
      });
    });

    elements.btnConfirmMission.addEventListener("click", startQuizSession);
    elements.btnBackFromMission.addEventListener("click", () => {
      playSound("click");
      showScreen("name");
    });

    // Skrin Kuiz
    elements.btnNextQuestion.addEventListener("click", handleNextQuestion);

    // Skrin Keputusan
    elements.btnPlayAgain.addEventListener("click", () => {
      playSound("click");
      startQuizSession();
    });

    elements.btnResultsLeaderboard.addEventListener("click", () => {
      playSound("click");
      loadAndDisplayLeaderboard();
    });

    elements.btnResultsHome.addEventListener("click", () => {
      playSound("click");
      showScreen("home");
    });

    // Skrin Leaderboard
    elements.btnLeaderboardPlay.addEventListener("click", () => {
      playSound("click");
      if (state.playerName) {
        showScreen("mission");
      } else {
        showScreen("name");
      }
    });

    elements.btnBackFromLeaderboard.addEventListener("click", () => {
      playSound("click");
      showScreen("home");
    });

    // Papan Kekunci
    setupKeyboardListeners();
  }

  // =========================================================================
  // 14. TITIK PERMULAAN APLIKASI (BOOTSTRAP)
  // =========================================================================
  async function initApp() {
    initSoundPreference();
    setupEventListeners();

    console.info("🚀 Misi Al-Fatihah (Tahun 1) sedia dimainkan!");
  }

  // Jalankan apabila DOM selesai dimuatkan
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

})();
