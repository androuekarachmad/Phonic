// js/student/game-mode.js

document.addEventListener('DOMContentLoaded', () => {
  const prevBtn = document.getElementById('prevModeBtn');
  const nextBtn = document.getElementById('nextModeBtn');
  const modeTitle = document.getElementById('modeTitle');
  const modeDesc = document.getElementById('modeDesc');
  const modeMascot = document.getElementById('modeMascot');
  const startBtn = document.getElementById('startBtn');

  // Parse URL params
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('gameId') || 'game-1'; // default to game-1

  // Define per-game descriptions
  const gameDescriptions = {
    'game-1': {
      easy: 'Mode ini kamu harus menyusun kata-kata yang tersedia menjadi kalimat bahasa Inggris yang benar. Jumlah kata lebih sedikit sehingga lebih mudah.',
      normal: 'Mode ini kamu harus menyusun kata-kata menjadi kalimat bahasa Inggris. Tersedia beberapa kata pengecoh tambahan yang harus kamu hindari.',
      hard: 'Mode ini kamu harus menyusun kalimat bahasa Inggris yang lebih panjang dengan penambahan keterangan tempat dan waktu. Tantangan tertinggi!'
    },
    'game-2': {
      easy: 'Mode ini kamu akan melihat gambar dan mengisi huruf yang hilang dari sebuah kata bahasa Inggris yang pendek. Hanya 1-2 huruf yang tersembunyi!',
      normal: 'Mode ini kamu akan mengisi huruf-huruf yang hilang dari kata bahasa Inggris yang lebih panjang berdasarkan gambar yang ditampilkan.',
      hard: 'Mode ini kamu harus mengisi banyak huruf yang hilang dari kata bahasa Inggris yang panjang dan kompleks berdasarkan gambar. Ujian terberat!'
    },
    'game-3': {
      easy: 'Mode ini kamu akan mendengarkan kalimat, lalu memilih kata kerja yang tepat untuk melengkapi kalimat tersebut dari 4 pilihan yang ada.',
      normal: 'Mode ini kamu harus memilih kata kerja yang paling tepat untuk melengkapi kalimat bahasa Inggris. Pilihannya lebih sulit dan mirip-mirip!',
      hard: 'Mode ini kamu harus memilih kata kerja dalam bentuk tenses yang benar untuk melengkapi kalimat bahasa Inggris yang kompleks.'
    }
  };

  const currentDesc = gameDescriptions[gameId] || gameDescriptions['game-1'];

  // Define modes and their text
  const modes = [
    {
      id: 'easy',
      title: 'Easy',
      desc: currentDesc.easy,
      mascot: '../../assets/images/mascot/easy.png'
    },
    {
      id: 'normal',
      title: 'Normal',
      desc: currentDesc.normal,
      mascot: '../../assets/images/mascot/normal.png'
    },
    {
      id: 'hard',
      title: 'Hard',
      desc: currentDesc.hard,
      mascot: '../../assets/images/mascot/hard.png'
    }
  ];

  let currentIndex = 1; // Default to Normal

  function updateModeUI() {
    const currentMode = modes[currentIndex];
    
    // Animate mascot
    modeMascot.classList.add('fade-out');
    
    setTimeout(() => {
      modeTitle.textContent = currentMode.title;
      modeDesc.textContent = currentMode.desc;
      modeMascot.src = currentMode.mascot;
      
      modeMascot.classList.remove('fade-out');
    }, 150);

    // Update buttons
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === modes.length - 1;
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateModeUI();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < modes.length - 1) {
      currentIndex++;
      updateModeUI();
    }
  });

  // Init
  updateModeUI();

  startBtn.addEventListener('click', () => {
    const currentMode = modes[currentIndex].id;
    
    // Map gameId to its gameplay page
    const gameRoutes = {
      'game-1': 'game-play.html',
      'game-2': 'baca-pikir-ucapkan.html',
      'game-3': 'dengar-ucapkan.html'
    };
    const targetPage = gameRoutes[gameId] || 'game-play.html';

    // Check if openInstructionPopup exists (loaded via component loader)
    if (typeof window.openInstructionPopup === 'function') {
      window.openInstructionPopup(currentMode, () => {
        // Save state to sessionStorage
        sessionStorage.setItem('phonic_current_game', gameId);
        sessionStorage.setItem('phonic_current_mode', currentMode);
        sessionStorage.setItem('phonic_question_index', 0);
        
        // Redirect to gameplay
        window.location.href = targetPage;
      }, gameId); // pass gameId for per-game modal descriptions
    } else {
      // Fallback if modal not loaded
      sessionStorage.setItem('phonic_current_game', gameId);
      sessionStorage.setItem('phonic_current_mode', currentMode);
      sessionStorage.setItem('phonic_question_index', 0);
      window.location.href = targetPage;
    }
  });
});
