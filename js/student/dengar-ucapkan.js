// js/student/dengar-ucapkan.js
// Logic untuk game "Dengar & Ucapkan!" (multiple-choice + voice input)

document.addEventListener('DOMContentLoaded', () => {
  if (!window.DENGAR_UCAPKAN_QUESTIONS) {
    console.error('Data questions not found.');
    return;
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const currentMode   = sessionStorage.getItem('phonic_current_mode') || 'easy';
  let   questionIndex = parseInt(sessionStorage.getItem('phonic_question_index') || '0', 10);
  const modeQuestions = window.DENGAR_UCAPKAN_QUESTIONS.filter(q => q.difficulty === currentMode);

  if (modeQuestions.length === 0) {
    alert('No questions found for this mode.');
    window.location.href = 'games.html';
    return;
  }
  if (questionIndex >= modeQuestions.length) {
    questionIndex = 0;
    sessionStorage.setItem('phonic_question_index', 0);
  }

  let currentQuestion = modeQuestions[questionIndex];
  let timerInterval;
  let timeLeft    = 60;
  let isListening  = false;
  let selectedAnswer = null;
  let answered     = false;

  // ── UI refs ────────────────────────────────────────────────────────────────
  const questionText    = document.getElementById('questionText');
  const questionImage   = document.getElementById('questionImage');
  const sentenceText    = document.getElementById('sentenceText');
  const choicesContainer = document.getElementById('choicesContainer');
  const timerFill       = document.getElementById('timerFill');
  const timerText       = document.getElementById('timerText');
  const closeBtn        = document.getElementById('closeGameBtn');
  const helpBtn         = document.getElementById('helpBtn');
  const micBtn          = document.getElementById('micBtn');
  const waveLeft        = document.getElementById('waveLeft');
  const waveRight       = document.getElementById('waveRight');

  // ── Init ───────────────────────────────────────────────────────────────────
  function initGame() {
    currentQuestion = modeQuestions[questionIndex];
    selectedAnswer  = null;
    answered        = false;
    timeLeft        = 60;
    timerFill.classList.remove('danger');

    questionText.textContent = currentQuestion.instruction;
    questionImage.src        = currentQuestion.image;
    questionImage.onerror    = function() {
      this.onerror = null;
      this.src = '../../assets/images/mascot/easy.png';
    };
    sentenceText.textContent = currentQuestion.sentence;

    renderChoices();
    startTimer();
  }

  // ── Render choices ─────────────────────────────────────────────────────────
  function renderChoices() {
    choicesContainer.innerHTML = '';

    // Shuffle choices
    const shuffled = [...currentQuestion.choices].sort(() => Math.random() - 0.5);

    shuffled.forEach(choice => {
      const btn = document.createElement('button');
      btn.className   = 'choice-btn';
      btn.textContent = choice;
      btn.addEventListener('click', () => handleChoiceClick(btn, choice));
      choicesContainer.appendChild(btn);
    });
  }

  // ── Choice click handler ───────────────────────────────────────────────────
  function handleChoiceClick(btn, choice) {
    if (answered) return;

    // Deselect previous
    document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedAnswer = choice;

    // Auto-submit on select
    submitAnswer(choice);
  }

  // ── Submit answer ──────────────────────────────────────────────────────────
  function submitAnswer(choice) {
    if (answered) return;
    answered = true;
    clearInterval(timerInterval);

    const isCorrect = choice === currentQuestion.answer;

    // Mark correct / wrong
    document.querySelectorAll('.choice-btn').forEach(btn => {
      if (btn.textContent === currentQuestion.answer) {
        btn.classList.add('correct');
      } else if (btn.textContent === choice && !isCorrect) {
        btn.classList.add('wrong');
      }
      btn.disabled = true;
    });

    // Navigate to result after feedback delay
    setTimeout(() => {
      sessionStorage.setItem('phonic_game_result', isCorrect ? 'true' : 'false');
      sessionStorage.setItem('phonic_question_index', questionIndex);
      sessionStorage.setItem('phonic_total_questions', modeQuestions.length);
      window.location.href = 'game-result.html';
    }, 1200);
  }

  // ── Timer ──────────────────────────────────────────────────────────────────
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.textContent = `${timeLeft}s`;
      timerFill.style.width = `${(timeLeft / 60) * 100}%`;

      if (timeLeft <= 10) timerFill.classList.add('danger');
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        // On timeout, show correct answer and advance
        if (!answered) submitAnswer('');
      }
    }, 1000);
  }

  // ── Microphone toggle (voice input) ───────────────────────────────────────
  function toggleMic() {
    if (isListening || answered) return;

    isListening = true;
    micBtn.classList.add('listening');
    waveLeft.classList.add('active');
    waveRight.classList.add('active');

    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SR    = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SR();
      recog.lang  = 'en-US';
      recog.start();

      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toLowerCase().trim();
        stopListening();

        // Find matching choice
        const matched = currentQuestion.choices.find(c =>
          transcript.includes(c.toLowerCase())
        );
        if (matched) {
          const btn = [...document.querySelectorAll('.choice-btn')]
            .find(b => b.textContent === matched);
          if (btn) btn.click();
        }
      };

      recog.onerror = () => stopListening();
      recog.onend   = () => stopListening();
    } else {
      // Simulate: auto-click correct answer after 1.5s
      setTimeout(() => {
        stopListening();
        const correctBtn = [...document.querySelectorAll('.choice-btn')]
          .find(b => b.textContent === currentQuestion.answer);
        if (correctBtn) correctBtn.click();
      }, 1500);
    }
  }

  function stopListening() {
    isListening = false;
    micBtn.classList.remove('listening');
    waveLeft.classList.remove('active');
    waveRight.classList.remove('active');
  }

  // ── Complete Modal ─────────────────────────────────────────────────────────
  function showCompleteModal() {
    const modal = document.getElementById('gameCompleteModal');
    modal.style.display = 'flex';

    document.getElementById('playAgainBtn').addEventListener('click', () => {
      sessionStorage.setItem('phonic_question_index', 0);
      window.location.reload();
    });

    document.getElementById('exitGameBtn').addEventListener('click', () => {
      sessionStorage.setItem('phonic_question_index', 0);
      window.location.href = 'games.html';
    });
  }

  // ── Event Listeners ────────────────────────────────────────────────────────
  micBtn.addEventListener('click', toggleMic);

  closeBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    window.location.href = 'games.html';
  });

  helpBtn.addEventListener('click', () => {
    if (typeof window.openInstructionPopup === 'function') {
      window.openInstructionPopup(currentMode);
    }
  });

  // ── Start ──────────────────────────────────────────────────────────────────
  initGame();
});
