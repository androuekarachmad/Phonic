// js/student/game-play.js

document.addEventListener('DOMContentLoaded', () => {
  if (!window.SUSUN_KALIMAT_QUESTIONS) {
    console.error("Data questions not found.");
    return;
  }

  // State
  const currentMode = sessionStorage.getItem('phonic_current_mode') || 'normal';
  let questionIndex = parseInt(sessionStorage.getItem('phonic_question_index') || '0', 10);
  
  // Filter questions by mode
  const modeQuestions = window.SUSUN_KALIMAT_QUESTIONS.filter(q => q.difficulty === currentMode);
  
  if (modeQuestions.length === 0) {
    alert("No questions found for this mode.");
    window.location.href = 'games.html';
    return;
  }

  // Wrap around if index exceeds
  if (questionIndex >= modeQuestions.length) {
    questionIndex = 0;
    sessionStorage.setItem('phonic_question_index', 0);
  }

  const currentQuestion = modeQuestions[questionIndex];
  let selectedWords = new Array(currentQuestion.english.length).fill(null);
  let timerInterval;
  let timeLeft = 60;

  // UI Elements
  const questionText = document.getElementById('questionText');
  const slotsContainer = document.getElementById('sentenceSlots');
  const wordBank = document.getElementById('wordBank');
  const checkBtn = document.getElementById('checkBtn');
  const timerFill = document.getElementById('timerFill');
  const timerText = document.getElementById('timerText');
  const closeBtn = document.getElementById('closeGameBtn');
  const helpBtn = document.getElementById('helpBtn');

  // Initialize UI
  function initGame() {
    questionText.textContent = `"${currentQuestion.indonesian}"`;
    
    // Update Mascot dynamically based on question text or image property
    const mascotImg = document.querySelector('.gameplay-mascot');
    if (mascotImg) {
      if (currentQuestion.image) {
        mascotImg.src = currentQuestion.image;
      } else {
        let filename = currentQuestion.indonesian.toLowerCase().replace(/[^a-z0-9]+/g, '_');
        filename = filename.replace(/_$/, ''); // remove trailing underscore
        mascotImg.src = `../../assets/images/games/${filename}.svg`;
      }
      
      mascotImg.onerror = function() {
        this.onerror = null;
        this.src = '../../assets/images/mascot/mascot-home.png'; // fallback
      };
    }
    
    // Setup Slots
    slotsContainer.innerHTML = '';
    for (let i = 0; i < currentQuestion.english.length; i++) {
      const slot = document.createElement('div');
      slot.className = 'slot';
      slot.dataset.index = i;
      slotsContainer.appendChild(slot);
    }

    // Setup Word Bank
    const allWords = [...currentQuestion.english, ...currentQuestion.distractors];
    // Shuffle words
    allWords.sort(() => Math.random() - 0.5);

    wordBank.innerHTML = '';
    allWords.forEach((word, index) => {
      const btn = document.createElement('button');
      btn.className = 'word-btn';
      btn.textContent = word;
      btn.dataset.id = `word-${index}`;
      btn.addEventListener('click', () => handleWordClick(btn, word));
      wordBank.appendChild(btn);
    });

    startTimer();
  }

  function handleWordClick(btn, word) {
    // Find first empty slot
    const emptyIndex = selectedWords.findIndex(w => w === null);
    if (emptyIndex !== -1) {
      // Move to slot
      selectedWords[emptyIndex] = { id: btn.dataset.id, text: word };
      btn.classList.add('hidden');
      renderSlots();
      checkCompletion();
    }
  }

  function handleSlotClick(index) {
    if (selectedWords[index]) {
      // Return to bank
      const wordId = selectedWords[index].id;
      const bankBtn = document.querySelector(`.word-btn[data-id="${wordId}"]`);
      if (bankBtn) {
        bankBtn.classList.remove('hidden');
      }
      selectedWords[index] = null;
      renderSlots();
      checkCompletion();
    }
  }

  function renderSlots() {
    const slots = slotsContainer.querySelectorAll('.slot');
    slots.forEach((slot, index) => {
      slot.innerHTML = '';
      if (selectedWords[index]) {
        slot.classList.add('filled');
        const btn = document.createElement('button');
        btn.className = 'slot-btn';
        btn.textContent = selectedWords[index].text;
        btn.addEventListener('click', () => handleSlotClick(index));
        slot.appendChild(btn);
      } else {
        slot.classList.remove('filled');
      }
    });
  }

  function checkCompletion() {
    const isFull = selectedWords.every(w => w !== null);
    checkBtn.disabled = !isFull;
  }

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      timerText.textContent = `${timeLeft}s`;
      timerFill.style.width = `${(timeLeft / 60) * 100}%`;
      
      if (timeLeft <= 10) {
        timerFill.classList.add('danger');
      }
      
      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        submitAnswer(false); // Time out = fail
      }
    }, 1000);
  }

  function submitAnswer(isTimeout = false) {
    clearInterval(timerInterval);
    
    let isCorrect = false;
    if (!isTimeout) {
      // Check if matches exactly
      const userSentence = selectedWords.map(w => w.text).join(' ');
      const correctSentence = currentQuestion.english.join(' ');
      isCorrect = (userSentence === correctSentence);
    }

    // Store result and whether this was the LAST question
    sessionStorage.setItem('phonic_game_result', isCorrect ? 'true' : 'false');
    sessionStorage.setItem('phonic_question_index', questionIndex);
    sessionStorage.setItem('phonic_total_questions', modeQuestions.length);
    window.location.href = 'game-result.html';
  }

  // Event Listeners
  checkBtn.addEventListener('click', () => submitAnswer(false));
  
  closeBtn.addEventListener('click', () => {
    window.location.href = 'games.html';
  });

  helpBtn.addEventListener('click', () => {
    if (typeof window.openInstructionPopup === 'function') {
      window.openInstructionPopup(currentMode);
    }
  });

  // Init
  initGame();
});
