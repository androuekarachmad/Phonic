// js/admin/game-detail.js
// Logika untuk halaman kelola soal (Game Detail)

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const gameId = urlParams.get('id');

  const container = document.getElementById('questionContainer');
  const emptyState = document.getElementById('emptyState');
  const filterChips = document.querySelectorAll('.std-chip');
  
  let activeFilter = 'all';
  let deleteTargetId = null;

  // ── INIT ─────────────────────────────────────────────────
  if (!gameId) {
    window.location.href = 'games.html';
    return;
  }

  const game = mockGames.find(g => g.id === gameId);
  if (!game) {
    window.location.href = 'games.html';
    return;
  }

  document.getElementById('gameTitle').textContent = game.title;
  
  renderQuestions();
  initFilters();
  initModals();

  // ── RENDER ───────────────────────────────────────────────
  function renderQuestions() {
    container.innerHTML = '';
    
    // Filter questions by gameId and activeFilter
    let gameQs = mockQuestions.filter(q => q.gameId === gameId);
    if (activeFilter !== 'all') {
      gameQs = gameQs.filter(q => q.difficulty === activeFilter);
    }

    if (gameQs.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');

    gameQs.forEach((q, index) => {
      const card = document.createElement('div');
      card.className = 'gm-qcard slide-up';
      
      const diffClass = q.difficulty.toLowerCase();

      card.innerHTML = `
        <div class="gm-qcard__header">
          <span class="gm-qnum">Soal #${index + 1}</span>
          <span class="gm-qbadge ${diffClass}">${q.difficulty}</span>
        </div>
        <div class="gm-qcard__body">
          <h4 class="gm-qcard__indo">${q.indonesian}</h4>
          <p class="gm-qcard__eng">${q.english}</p>
          <p class="gm-qcard__meta">${q.words.length} kata acak</p>
        </div>
        <div class="gm-qcard__actions">
          <button class="gm-icon-btn preview-btn" data-id="${q.id}" title="Preview">
            <i class="ph ph-eye"></i>
          </button>
          <button class="gm-icon-btn edit-btn" data-id="${q.id}" title="Edit">
            <i class="ph ph-pencil-simple"></i>
          </button>
          <button class="gm-icon-btn delete" data-id="${q.id}" title="Hapus">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    bindCardEvents();
  }

  function bindCardEvents() {
    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', () => alert('Preview UI Student Mode dibuka...'));
    });
    
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditForm(btn.dataset.id));
    });
    
    container.querySelectorAll('.gm-icon-btn.delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
    });
  }

  // ── FILTERS ──────────────────────────────────────────────
  function initFilters() {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.dataset.filterType;
        if(type !== 'difficulty') return;

        document.querySelectorAll(`.std-chip[data-filter-type="difficulty"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilter = chip.dataset.filterVal;
        
        renderQuestions();
      });
    });
  }

  // ── ADD / EDIT FORM ──────────────────────────────────────
  document.getElementById('btnAddQuestion').addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Tambah Soal Baru';
    document.getElementById('questionForm').reset();
    document.getElementById('formId').value = '';
    openModal('formModal');
  });

  function openEditForm(id) {
    const q = mockQuestions.find(q => q.id === id);
    if (!q) return;
    
    document.getElementById('formTitle').textContent = 'Edit Soal';
    document.getElementById('formId').value = q.id;
    document.getElementById('formIndo').value = q.indonesian;
    document.getElementById('formEng').value = q.english;
    document.getElementById('formDiff').value = q.difficulty;
    
    openModal('formModal');
  }

  document.getElementById('questionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('formId').value;
    const engStr = document.getElementById('formEng').value.trim();
    
    // Auto-split words for logic
    const wordsArr = engStr.replace(/[.,!?]/g, '').split(' ').filter(w => w.length > 0);

    const payload = {
      gameId: gameId,
      indonesian: document.getElementById('formIndo').value.trim(),
      english: engStr,
      difficulty: document.getElementById('formDiff').value,
      words: wordsArr
    };

    if (id) {
      const idx = mockQuestions.findIndex(q => q.id === id);
      if (idx !== -1) mockQuestions[idx] = { ...mockQuestions[idx], ...payload };
    } else {
      mockQuestions.push({ id: 'Q' + Date.now(), ...payload });
    }

    closeModal('formModal');
    renderQuestions();
  });

  document.getElementById('formCancel').addEventListener('click', () => closeModal('formModal'));

  // ── DELETE ────────────────────────────────────────────────
  function openDeleteModal(id) {
    deleteTargetId = id;
    openModal('deleteModal');
  }

  document.getElementById('btnConfirmDelete').addEventListener('click', () => {
    if (!deleteTargetId) return;
    const idx = mockQuestions.findIndex(q => q.id === deleteTargetId);
    if (idx !== -1) mockQuestions.splice(idx, 1);
    deleteTargetId = null;
    closeModal('deleteModal');
    renderQuestions();
  });

  document.getElementById('btnCancelDelete').addEventListener('click', () => closeModal('deleteModal'));

  // ── MODAL HELPERS ─────────────────────────────────────────
  function initModals() {
    ['formModal', 'deleteModal'].forEach(id => {
      const modal = document.getElementById(id);
      const backdrop = modal.querySelector('.gm-modal__backdrop');
      const closeBtn = modal.querySelector('.gm-modal__close');
      if (backdrop) backdrop.addEventListener('click', () => closeModal(id));
      if (closeBtn) closeBtn.addEventListener('click', () => closeModal(id));
    });
  }

  function openModal(id) {
    document.getElementById(id).classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    document.getElementById(id).classList.remove('active');
    document.body.style.overflow = '';
  }
});
