// js/student/pages.js

let currentBook = null;
let currentPageIndex = 0;
let currentAudio = null;

document.addEventListener('DOMContentLoaded', () => {
  initReader();
});

function initReader() {
  const bookId = sessionStorage.getItem('currentBookId');
  if (!bookId || typeof bookDatabase === 'undefined') {
    window.location.href = 'books.html';
    return;
  }

  currentBook = bookDatabase.find(b => b.id === bookId);
  if (!currentBook || !currentBook.pages.length) {
    window.location.href = 'books.html';
    return;
  }

  // Setup Event Listeners
  document.getElementById('btnPrev').addEventListener('click', prevPage);
  document.getElementById('btnNext').addEventListener('click', nextPage);
  
  // Audio Controls
  document.getElementById('audioPlay').addEventListener('click', toggleAudio);
  
  // Render first page
  renderPage(currentPageIndex);
}

window.closeReader = function() {
  stopAudio();
  window.location.href = 'books.html';
};

function renderPage(index, direction = 'next') {
  if (index < 0 || index >= currentBook.pages.length) return;
  
  const pageData = currentBook.pages[index];
  const pageWrapper = document.getElementById('pageWrapper');
  const pageImage = document.getElementById('pageImage');
  const pageOverlays = document.getElementById('pageOverlays');
  
  // Stop any playing audio when changing page
  stopAudio();
  closeVocabPopup();

  // Animation Out
  pageWrapper.classList.add('page-exit');
  
  setTimeout(() => {
    // Update Content
    pageImage.src = pageData.img;
    pageOverlays.innerHTML = '';
    
    // Setup Page Type Features
    setupPageType(pageData);
    
    // Update Indicators
    document.getElementById('currentPageNum').textContent = index + 1;
    document.getElementById('totalPagesNum').textContent = currentBook.pages.length;
    
    // Button states
    document.getElementById('btnPrev').disabled = (index === 0);
    document.getElementById('btnNext').disabled = (index === currentBook.pages.length - 1);
    
    // Animation In
    pageWrapper.classList.remove('page-exit');
    pageWrapper.classList.add('page-enter');
    
    setTimeout(() => {
      pageWrapper.classList.remove('page-enter');
    }, 300); // match css transition time
    
  }, 300);
}

function setupPageType(pageData) {
  const audioContainer = document.getElementById('audioPlayerContainer');
  const btnAudio = document.getElementById('btnAudio'); // Top right header audio button
  
  // Reset visibility
  audioContainer.style.display = 'none';
  btnAudio.style.display = 'none';
  
  if (pageData.type === 'vocabulary') {
    setupVocabularyOverlays(pageData.vocabularies);
  } 
  else if (pageData.type === 'song') {
    setupSongAudio(pageData.audioUrl);
  }
}

// ========== VOCABULARY FEATURE ==========
function setupVocabularyOverlays(vocabularies) {
  if (!vocabularies) return;
  
  const pageOverlays = document.getElementById('pageOverlays');
  
  vocabularies.forEach(vocab => {
    const hitbox = document.createElement('div');
    hitbox.className = 'vocab-hitbox';
    hitbox.style.top = vocab.position.top;
    hitbox.style.left = vocab.position.left;
    hitbox.style.width = vocab.size.width;
    hitbox.style.height = vocab.size.height;
    
    hitbox.addEventListener('click', (e) => {
      e.stopPropagation();
      openVocabPopup(vocab);
    });
    
    pageOverlays.appendChild(hitbox);
  });
}

window.openVocabPopup = function(vocabData) {
  const popup = document.getElementById('vocabPopup');
  if (!popup) return;
  
  document.getElementById('vocabWord').textContent = vocabData.word;
  document.getElementById('vocabPronunciation').textContent = vocabData.pronunciation;
  document.getElementById('vocabMeaning').textContent = vocabData.meaning;
  
  // Setup Speaker Button for Text-to-Speech
  const speakerBtn = document.getElementById('vocabSpeaker');
  // Remove old event listeners by cloning
  const newSpeakerBtn = speakerBtn.cloneNode(true);
  speakerBtn.parentNode.replaceChild(newSpeakerBtn, speakerBtn);
  
  newSpeakerBtn.addEventListener('click', () => {
    speakWord(vocabData.word);
  });
  
  popup.style.display = 'block';
};

window.closeVocabPopup = function() {
  const popup = document.getElementById('vocabPopup');
  if (popup) popup.style.display = 'none';
};

function speakWord(word) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9; // Slightly slower for kids
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Maaf, browser Anda tidak mendukung fitur suara.");
  }
}

// ========== SONG FEATURE ==========
function setupSongAudio(audioUrl) {
  const audioContainer = document.getElementById('audioPlayerContainer');
  const btnAudio = document.getElementById('btnAudio');
  const audioEl = document.getElementById('html5Audio');
  const msgEl = document.getElementById('audioMsg');
  const playBtn = document.getElementById('audioPlay');
  
  audioContainer.style.display = 'flex';
  btnAudio.style.display = 'flex';
  
  if (!audioUrl || audioUrl === '') {
    // Coming Soon State
    msgEl.textContent = "Coming Soon";
    playBtn.style.opacity = '0.5';
    playBtn.style.pointerEvents = 'none';
    currentAudio = null;
  } else {
    // Has Audio State
    msgEl.textContent = "Sing along!";
    playBtn.style.opacity = '1';
    playBtn.style.pointerEvents = 'auto';
    
    audioEl.src = audioUrl;
    currentAudio = audioEl;
    
    // Sync Play/Pause Icon
    audioEl.onplay = () => {
      playBtn.innerHTML = '<i class="ph-fill ph-pause-circle"></i>';
    };
    audioEl.onpause = () => {
      playBtn.innerHTML = '<i class="ph-fill ph-play-circle"></i>';
    };
    audioEl.onended = () => {
      playBtn.innerHTML = '<i class="ph-fill ph-play-circle"></i>';
    };
  }
}

function toggleAudio() {
  if (!currentAudio) return;
  
  if (currentAudio.paused) {
    currentAudio.play().catch(e => console.log("Audio play failed:", e));
  } else {
    currentAudio.pause();
  }
}

function stopAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  // Also stop SpeechSynthesis if reading
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// ========== NAVIGATION ==========
function nextPage() {
  if (currentPageIndex < currentBook.pages.length - 1) {
    currentPageIndex++;
    renderPage(currentPageIndex, 'next');
  }
}

function prevPage() {
  if (currentPageIndex > 0) {
    currentPageIndex--;
    renderPage(currentPageIndex, 'prev');
  }
}
