// js/student/reader.js

(function () {
  'use strict';

  // ── State ──
  let book = null;
  let currentPage = 1;
  let audioEl = null;

  // ── DOM Refs ──
  const $ = (id) => document.getElementById(id);

  // ── Init ──
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    const bookId = sessionStorage.getItem('currentBookId');
    if (!bookId || typeof bookDatabase === 'undefined') {
      return goBack();
    }

    book = bookDatabase.find(b => b.id === bookId);
    if (!book) return goBack();

    // Wire buttons
    $('btnClose').addEventListener('click', goBack);
    $('btnPrev').addEventListener('click', prevPage);
    $('btnNext').addEventListener('click', nextPage);
    $('vocabSpeak').addEventListener('click', () => {
      const word = $('vocabSpeak').dataset.word;
      if (word) speak(word);
    });
    $('audioPlayPause').addEventListener('click', toggleAudio);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextPage();
      if (e.key === 'ArrowLeft') prevPage();
      if (e.key === 'Escape') goBack();
    });

    // Dismiss vocab popup when clicking outside
    document.addEventListener('click', (e) => {
      const popup = $('vocabPopup');
      if (popup.classList.contains('vocab-popup--visible') && !popup.contains(e.target)) {
        popup.classList.remove('vocab-popup--visible');
      }
    });

    renderPage();
  }

  function goBack() {
    stopAudio();
    window.location.href = 'books.html';
  }

  // ── Page path generator ──
  function getPagePath(pageNum) {
    const num = String(pageNum).padStart(3, '0');
    return book.basePath + 'pages/' + num + '.webp';
  }

  // ── Get page type ──
  function getPageType(pageNum) {
    if (book.features && book.features[pageNum]) {
      return book.features[pageNum].type || 'normal';
    }
    return 'normal';
  }

  // ── Get page features ──
  function getPageFeatures(pageNum) {
    return (book.features && book.features[pageNum]) || null;
  }

  // ── Render current page ──
  function renderPage() {
    const page = $('readerPage');
    const img = $('pageImg');

    // Transition out
    page.classList.add('reader-page--exit');

    setTimeout(() => {
      // Set image
      img.src = getPagePath(currentPage);
      img.alt = `${book.title} — Page ${currentPage}`;

      // Update indicator
      $('pageIndicator').textContent = `${currentPage} / ${book.totalPages}`;

      // Button states
      $('btnPrev').disabled = currentPage <= 1;
      $('btnNext').disabled = currentPage >= book.totalPages;

      // Reset all type-specific UI
      resetTypeUI();

      // Setup type-specific UI
      const type = getPageType(currentPage);
      if (type === 'song') setupSong(getPageFeatures(currentPage));
      if (type === 'vocabulary') setupVocabulary(getPageFeatures(currentPage));

      // Show speaker button for song/vocabulary pages
      $('btnSpeaker').style.visibility =
        (type === 'song' || type === 'vocabulary') ? 'visible' : 'hidden';

      // Transition in
      page.classList.remove('reader-page--exit');
      page.classList.add('reader-page--enter');
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          page.classList.remove('reader-page--enter');
        });
      });
    }, 300);
  }

  function resetTypeUI() {
    stopAudio();
    $('audioPlayer').style.display = 'none';
    $('audioMsg').textContent = '';
    $('vocabPopup').classList.remove('vocab-popup--visible');
    $('vocabOverlays').innerHTML = '';
  }

  // ── Navigation ──
  function nextPage() {
    if (currentPage < book.totalPages) {
      currentPage++;
      renderPage();
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderPage();
    }
  }

  // ══════════════════════════════════════
  //  VOCABULARY (Web Speech API)
  // ══════════════════════════════════════
  function setupVocabulary(features) {
    if (!features || !features.vocabularies) return;

    const popup = $('vocabPopup');

    features.vocabularies.forEach(vocab => {
      const chip = document.createElement('button');
      chip.className = 'vocab-chip';
      chip.textContent = vocab.word;
      chip.style.cssText = `
        position: absolute;
        bottom: 12px;
        left: 50%;
        transform: translateX(-50%);
        display: none;
      `;
      // We won't use overlay hitboxes for now — instead add a chip bar
    });

    // For simplicity: show all vocabulary words as clickable chips at the bottom
    const overlay = $('vocabOverlays');
    const chipBar = document.createElement('div');
    chipBar.className = 'vocab-chip-bar';
    chipBar.style.cssText = `
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
      z-index: 15;
      pointer-events: auto;
    `;

    features.vocabularies.forEach(vocab => {
      const chip = document.createElement('button');
      chip.className = 'vocab-chip';
      chip.textContent = vocab.word;
      chip.style.cssText = `
        padding: 6px 14px;
        border-radius: 20px;
        border: 2px solid #3b82f6;
        background: rgba(59, 130, 246, 0.1);
        color: #2563eb;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        transition: background 0.2s, transform 0.15s;
      `;

      chip.addEventListener('click', (e) => {
        e.stopPropagation();
        showVocabPopup(vocab);
        speak(vocab.word);
      });

      chipBar.appendChild(chip);
    });

    overlay.appendChild(chipBar);
  }

  function showVocabPopup(vocab) {
    $('vocabPronunciation').textContent = vocab.pronunciation;
    $('vocabMeaning').textContent =
      `"${vocab.word}" → dibaca seperti "${vocab.pronunciation}"\nArti: ${vocab.meaning}`;
    $('vocabSpeak').dataset.word = vocab.word;
    $('vocabPopup').classList.add('vocab-popup--visible');
  }

  function speak(word) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  }

  // ══════════════════════════════════════
  //  SONG (HTML5 Audio)
  // ══════════════════════════════════════
  function setupSong(features) {
    const player = $('audioPlayer');
    const msg = $('audioMsg');
    const playBtn = $('audioPlayPause');
    audioEl = $('audioElement');

    player.style.display = 'flex';

    if (!features || !features.audioUrl || features.audioUrl === '') {
      // Coming Soon
      msg.textContent = '🎵 Coming Soon';
      playBtn.style.opacity = '0.4';
      playBtn.style.pointerEvents = 'none';
      audioEl.src = '';
    } else {
      msg.textContent = '🎵 Sing along!';
      playBtn.style.opacity = '1';
      playBtn.style.pointerEvents = 'auto';
      audioEl.src = features.audioUrl;

      audioEl.onplay = () => {
        playBtn.innerHTML = '<i class="ph-fill ph-pause"></i>';
      };
      audioEl.onpause = () => {
        playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
      };
      audioEl.onended = () => {
        playBtn.innerHTML = '<i class="ph-fill ph-play"></i>';
      };
      audioEl.onerror = () => {
        msg.textContent = '🎵 Coming Soon';
        playBtn.style.opacity = '0.4';
        playBtn.style.pointerEvents = 'none';
      };
    }
  }

  function toggleAudio() {
    if (!audioEl || !audioEl.src) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
    } else {
      audioEl.pause();
    }
  }

  function stopAudio() {
    if (audioEl) {
      audioEl.pause();
      audioEl.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
})();
