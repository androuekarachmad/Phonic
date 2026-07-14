// js/student/baca-pikir-ucapkan.js
// Logic untuk game "Baca, Pikir, Ucapkan!" (word letter-fill puzzle)

document.addEventListener('DOMContentLoaded', () => {
  if (!window.BACA_PIKIR_UCAPKAN_QUESTIONS) {
    console.error('Data questions not found.');
    return;
  }

  // ── State ──────────────────────────────────────────────────────────────────
  const currentMode    = sessionStorage.getItem('phonic_current_mode') || 'easy';
  let   questionIndex  = parseInt(sessionStorage.getItem('phonic_question_index') || '0', 10);
  const modeQuestions  = window.BACA_PIKIR_UCAPKAN_QUESTIONS.filter(q => q.difficulty === currentMode);

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
  let timeLeft   = 60;
  let isListening = false;
  let userInput   = []; // filled letters per blank index

  // ── UI refs ────────────────────────────────────────────────────────────────
  const questionText     = document.getElementById('questionText');
  const questionImage    = document.getElementById('questionImage');
  const blanksContainer  = document.getElementById('blanksContainer');
  const timerFill        = document.getElementById('timerFill');
  const timerText        = document.getElementById('timerText');
  const closeBtn         = document.getElementById('closeGameBtn');
  const helpBtn          = document.getElementById('helpBtn');
  const micBtn           = document.getElementById('micBtn');
  const waveLeft         = document.getElementById('waveLeft');
  const waveRight        = document.getElementById('waveRight');

  // ── Init ───────────────────────────────────────────────────────────────────
  function initGame() {
    currentQuestion = modeQuestions[questionIndex];
    userInput       = [];
    timeLeft        = 60;
    timerFill.classList.remove('danger');

    questionText.textContent  = currentQuestion.instruction;
    questionImage.src         = currentQuestion.image;
    questionImage.onerror     = function() {
      this.onerror = null;
      this.src = '../../assets/images/mascot/easy.png';
    };

    renderBlanks();
    startTimer();
  }

  // ── Render letter blanks ───────────────────────────────────────────────────
  function renderBlanks() {
    blanksContainer.innerHTML = '';
    const word   = currentQuestion.word;
    const blanks = currentQuestion.blanks; // true = hidden blank, false = visible letter

    // Split into words if multi-word (future proof), show space separator
    word.split('').forEach((char, i) => {
      if (char === ' ') {
        const sep = document.createElement('div');
        sep.className = 'blank-char separator';
        sep.textContent = '';
        blanksContainer.appendChild(sep);
        return;
      }

      const cell = document.createElement('div');
      cell.className = 'blank-char';
      cell.dataset.index = i;

      if (blanks[i]) {
        // Hidden blank — reveal on mic speak
        cell.textContent = '';
        cell.style.color = 'transparent';
      } else {
        // Visible letter
        cell.textContent = char;
        cell.classList.add('revealed');
      }
      blanksContainer.appendChild(cell);
    });
  }

  // ── Reveal blanks (simulate "correct voice") ────────────────────────────────
  function revealAllBlanks() {
    const word   = currentQuestion.word;
    const blanks = currentQuestion.blanks;

    blanks.forEach((isBlank, i) => {
      if (isBlank) {
        setTimeout(() => {
          const cell = blanksContainer.querySelector(`[data-index="${i}"]`);
          if (cell) {
            cell.textContent = word[i];
            cell.classList.add('revealed');
            cell.style.color = '';
          }
        }, i * 120);
      }
    });

    // After reveal, go to result
    setTimeout(() => finishQuestion(true), word.length * 120 + 800);
  }

  // ── Finish question -> go to game-result.html ─────────────────────────────
  function finishQuestion(isCorrect) {
    clearInterval(timerInterval);
    sessionStorage.setItem('phonic_game_result', isCorrect ? 'true' : 'false');
    sessionStorage.setItem('phonic_question_index', questionIndex);
    sessionStorage.setItem('phonic_total_questions', modeQuestions.length);
    window.location.href = 'game-result.html';
  }

  // ── Microphone toggle ──────────────────────────────────────────────────────
  function toggleMic() {
    if (isListening) return; // already listening

    isListening = true;
    micBtn.classList.add('listening');
    waveLeft.classList.add('active');
    waveRight.classList.add('active');

    // Try Web Speech API first
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SR   = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recog = new SR();
      recog.lang  = 'en-US';
      recog.start();

      recog.onresult = (e) => {
        const transcript = e.results[0][0].transcript.toUpperCase().trim();
        stopListening();
        const isCorrect = transcript.includes(currentQuestion.answer.toUpperCase());
        if (isCorrect) {
          revealAllBlanks();
        } else {
          // Shake hint and try again
          blanksContainer.style.animation = 'none';
          setTimeout(() => {
            blanksContainer.style.animation = '';
          }, 10);
          stopListening();
        }
      };

      recog.onerror = () => {
        // Fallback: simulate after 1.5s
        setTimeout(() => {
          stopListening();
          revealAllBlanks();
        }, 1500);
      };

      recog.onend = () => stopListening();
    } else {
      // Simulate: reveal after 1.5s
      setTimeout(() => {
        stopListening();
        revealAllBlanks();
      }, 1500);
    }
  }

  function stopListening() {
    isListening = false;
    micBtn.classList.remove('listening');
    waveLeft.classList.remove('active');
    waveRight.classList.remove('active');
  }

  // ── Advance to next question ───────────────────────────────────────────────
  function advanceQuestion() {
    clearInterval(timerInterval);
    const isLast = (questionIndex + 1 >= modeQuestions.length);

    if (isLast) {
      showCompleteModal();
    } else {
      questionIndex++;
      sessionStorage.setItem('phonic_question_index', questionIndex);
      initGame();
    }
  }

  // ── Timer ──────────────────────────────────────────────────────────────────
  function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.textContent = `${timeLeft}s`;
      timerFill.style.width = `${(timeLeft / 60) * 100}%`;

      if (timeLeft <= 10) timerFill.classList.add('danger');
      if (timeLeft <= 0)  {
        clearInterval(timerInterval);
        finishQuestion(false); // timeout = wrong
      }
    }, 1000);
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
