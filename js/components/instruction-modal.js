// js/components/instruction-modal.js

/**
 * Open the Instruction Modal with dynamic description
 * @param {string} mode   - The selected game mode (easy, normal, hard)
 * @param {function} onStart - Callback when Mulai is clicked
 * @param {string} gameId - The game id (game-1, game-2, game-3)
 */
window.openInstructionPopup = function(mode, onStart, gameId) {
  window._instructionStartCallback = onStart;
  const modal = document.getElementById('instructionModal');
  if (!modal) return;

  const descEl   = document.getElementById('instructionModalDesc');
  const mascotEl = document.getElementById('instructionModalMascot');

  // Fix mascot image
  if (mascotEl) {
    mascotEl.src = '../../assets/images/mascot/mascot-home.png';
  }

  // Per-game mode descriptions
  const descriptions = {
    'game-1': {
      easy:   'Mode ini kamu harus menyusun kata-kata yang tersedia menjadi kalimat bahasa Inggris yang benar. Jumlah kata lebih sedikit sehingga lebih mudah.',
      normal: 'Mode ini kamu harus menyusun kata-kata menjadi kalimat bahasa Inggris. Tersedia beberapa kata pengecoh tambahan yang harus kamu hindari.',
      hard:   'Mode ini kamu harus menyusun kalimat bahasa Inggris yang lebih panjang dengan penambahan keterangan tempat dan waktu. Tantangan tertinggi!'
    },
    'game-2': {
      easy:   'Mode ini kamu akan melihat gambar dan mengisi huruf yang hilang dari sebuah kata bahasa Inggris yang pendek. Hanya 1-2 huruf yang tersembunyi!',
      normal: 'Mode ini kamu akan mengisi huruf-huruf yang hilang dari kata bahasa Inggris yang lebih panjang berdasarkan gambar yang ditampilkan.',
      hard:   'Mode ini kamu harus mengisi banyak huruf yang hilang dari kata bahasa Inggris yang panjang dan kompleks berdasarkan gambar. Ujian terberat!'
    },
    'game-3': {
      easy:   'Mode ini kamu akan mendengarkan kalimat, lalu memilih kata kerja yang tepat untuk melengkapi kalimat tersebut dari 4 pilihan yang ada.',
      normal: 'Mode ini kamu harus memilih kata kerja yang paling tepat untuk melengkapi kalimat bahasa Inggris. Pilihannya lebih sulit dan mirip-mirip!',
      hard:   'Mode ini kamu harus memilih kata kerja dalam bentuk tenses yang benar untuk melengkapi kalimat bahasa Inggris yang kompleks.'
    }
  };

  // Determine game id — prefer passed arg, then sessionStorage, then url param
  const currentGameId = gameId
    || sessionStorage.getItem('phonic_current_game')
    || new URLSearchParams(window.location.search).get('gameId')
    || 'game-1';

  if (descEl) {
    const gameDefs = descriptions[currentGameId] || descriptions['game-1'];
    descEl.textContent = gameDefs[mode] || gameDefs['easy'];
  }

  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};

/**
 * Start Game Action
 */
window.startInstructionGame = function() {
  if (typeof window._instructionStartCallback === 'function') {
    window._instructionStartCallback();
  } else {
    closeInstructionPopup();
  }
};

/**
 * Close the Instruction Modal
 */
window.closeInstructionPopup = function() {
  const modal = document.getElementById('instructionModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Optionally trigger an event when closed to start the game
    window.dispatchEvent(new Event('instructionModalClosed'));
  }
};

// Listen for clicks on the backdrop to close the modal
document.addEventListener('click', function(e) {
  const modal = document.getElementById('instructionModal');
  if (modal && modal.classList.contains('show') && e.target === modal) {
    closeInstructionPopup();
  }
});
