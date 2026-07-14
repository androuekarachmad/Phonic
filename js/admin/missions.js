// js/admin/missions.js
// Logika untuk halaman Mission Management

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('missionContainer');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterChips = document.querySelectorAll('.std-chip');

  let activeFilters = { category: 'all', status: 'all' };
  let deleteTargetId = null;

  // ── INIT ─────────────────────────────────────────────────
  updateStats();
  renderMissions(mockMissions);
  initSearch();
  initFilters();
  initModals();

  // ── STATISTICS ───────────────────────────────────────────
  function updateStats() {
    document.getElementById('statTotal').textContent   = mockMissions.length;
    document.getElementById('statDaily').textContent   = mockMissions.filter(m => m.category === 'Daily').length;
    document.getElementById('statWeekly').textContent  = mockMissions.filter(m => m.category === 'Weekly').length;
    document.getElementById('statSpecial').textContent = mockMissions.filter(m => m.category === 'Special').length;
  }

  // ── RENDER ───────────────────────────────────────────────
  function renderMissions(data) {
    container.innerHTML = '';
    
    if (data.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');

    data.forEach(mission => {
      const card = document.createElement('div');
      card.className = 'ms-card slide-up';
      card.dataset.id = mission.id;
      card.dataset.category = mission.category; // For CSS color accent

      const isActive = mission.status === 'Aktif';

      card.innerHTML = `
        <div class="ms-card__header">
          <div class="ms-card__icon"><i class="ph-fill ${mission.icon}"></i></div>
          <div class="ms-toggle-switch ${isActive ? 'active' : ''}" data-id="${mission.id}" title="Toggle Status"></div>
        </div>
        
        <div class="ms-card__body">
          <h3 class="ms-card__title">${mission.title}</h3>
          <span class="ms-card__target">Target: ${mission.target}</span>
          
          <div class="ms-card__rewards">
            <span class="ms-reward-badge xp"><i class="ph-fill ph-lightning"></i> ${mission.xpReward} XP</span>
            ${mission.stickerReward > 0 ? `<span class="ms-reward-badge sticker"><i class="ph-fill ph-sticker"></i> ${mission.stickerReward}</span>` : ''}
          </div>
        </div>

        <div class="ms-card__actions">
          <button class="ms-icon-btn preview-btn" data-id="${mission.id}" title="Preview">
            <i class="ph ph-eye"></i>
          </button>
          <button class="ms-icon-btn edit-btn" data-id="${mission.id}" title="Edit">
            <i class="ph ph-pencil-simple"></i>
          </button>
          <button class="ms-icon-btn delete" data-id="${mission.id}" title="Hapus">
            <i class="ph ph-trash"></i>
          </button>
        </div>
      `;

      container.appendChild(card);
    });

    bindCardEvents();
  }

  function bindCardEvents() {
    // Card Body Click -> Preview
    container.querySelectorAll('.ms-card__body').forEach(body => {
      body.addEventListener('click', (e) => {
        const id = body.closest('.ms-card').dataset.id;
        openPreview(id);
      });
    });

    // Preview btn
    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); openPreview(btn.dataset.id); });
    });

    // Edit btn
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); openEditForm(btn.dataset.id); });
    });

    // Delete btn
    container.querySelectorAll('.ms-icon-btn.delete').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); openDeleteModal(btn.dataset.id); });
    });

    // Toggle Status
    container.querySelectorAll('.ms-toggle-switch').forEach(toggle => {
      toggle.addEventListener('click', (e) => { e.stopPropagation(); toggleStatus(toggle.dataset.id); });
    });
  }

  // ── SEARCH & FILTERS ─────────────────────────────────────
  function initSearch() {
    searchInput.addEventListener('input', applyFiltersAndSearch);
  }

  function initFilters() {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.dataset.filterType;
        const val  = chip.dataset.filterVal;
        
        document.querySelectorAll(`.std-chip[data-filter-type="${type}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        
        activeFilters[type] = val;
        applyFiltersAndSearch();
      });
    });
  }

  function applyFiltersAndSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = mockMissions.filter(m => {
      const matchSearch = m.title.toLowerCase().includes(query) || m.desc.toLowerCase().includes(query);
      const matchCategory = activeFilters.category === 'all' || m.category === activeFilters.category;
      const matchStatus = activeFilters.status === 'all' || m.status === activeFilters.status;
      
      return matchSearch && matchCategory && matchStatus;
    });
    renderMissions(filtered);
  }

  // ── TOGGLE STATUS ─────────────────────────────────────────
  function toggleStatus(id) {
    const mission = mockMissions.find(m => m.id === id);
    if (!mission) return;
    
    mission.status = mission.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
    applyFiltersAndSearch();
  }

  // ── PREVIEW MODAL ─────────────────────────────────────────
  function openPreview(id) {
    const mission = mockMissions.find(m => m.id === id);
    if (!mission) return;

    // Set colors based on category
    let bg = '#0ea5e9'; // Daily
    if(mission.category === 'Weekly') bg = '#10b981';
    if(mission.category === 'Special') bg = '#a855f7';

    document.getElementById('previewHeaderBg').style.background = bg;
    document.getElementById('previewIcon').className = `ph-fill ${mission.icon}`;
    document.getElementById('previewCategory').textContent = mission.category;
    document.getElementById('previewTitle').textContent = mission.title;
    document.getElementById('previewDesc').textContent = mission.desc;
    document.getElementById('previewTarget').textContent = mission.target;
    document.getElementById('previewXp').textContent = `${mission.xpReward} XP`;
    document.getElementById('previewSticker').textContent = mission.stickerReward;
    
    const statusEl = document.getElementById('previewStatus');
    statusEl.textContent = mission.status;
    statusEl.style.color = mission.status === 'Aktif' ? '#10b981' : '#64748b';

    openModal('previewModal');
  }

  // ── ADD / EDIT FORM ───────────────────────────────────────
  document.getElementById('btnAddMission').addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Tambah Mission Baru';
    document.getElementById('missionForm').reset();
    document.getElementById('formId').value = '';
    openModal('formModal');
  });

  function openEditForm(id) {
    const m = mockMissions.find(m => m.id === id);
    if (!m) return;
    
    document.getElementById('formTitle').textContent = 'Edit Mission';
    document.getElementById('formId').value          = m.id;
    document.getElementById('formTitle2').value      = m.title;
    document.getElementById('formDesc').value        = m.desc;
    document.getElementById('formCategory').value    = m.category;
    document.getElementById('formTarget').value      = m.target;
    document.getElementById('formXp').value          = m.xpReward;
    document.getElementById('formSticker').value     = m.stickerReward;
    document.getElementById('formStatus').value      = m.status;
    
    openModal('formModal');
  }

  document.getElementById('missionForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('formId').value;
    const cat = document.getElementById('formCategory').value;
    
    // Auto icon based on category (simplified logic)
    let icon = 'ph-star';
    if(cat === 'Daily') icon = 'ph-sun';
    if(cat === 'Weekly') icon = 'ph-calendar-blank';
    if(cat === 'Special') icon = 'ph-sparkle';

    const payload = {
      title: document.getElementById('formTitle2').value,
      desc: document.getElementById('formDesc').value,
      category: cat,
      target: document.getElementById('formTarget').value,
      xpReward: parseInt(document.getElementById('formXp').value) || 0,
      stickerReward: parseInt(document.getElementById('formSticker').value) || 0,
      status: document.getElementById('formStatus').value,
      icon: icon
    };

    if (id) {
      const idx = mockMissions.findIndex(m => m.id === id);
      if (idx !== -1) {
        // preserve original icon if already set
        payload.icon = mockMissions[idx].icon; 
        mockMissions[idx] = { ...mockMissions[idx], ...payload };
      }
    } else {
      mockMissions.unshift({ id: 'M' + Date.now(), ...payload });
    }

    closeModal('formModal');
    updateStats();
    applyFiltersAndSearch();
  });

  document.getElementById('formCancel').addEventListener('click', () => closeModal('formModal'));

  // ── DELETE ────────────────────────────────────────────────
  function openDeleteModal(id) {
    deleteTargetId = id;
    openModal('deleteModal');
  }

  document.getElementById('btnConfirmDelete').addEventListener('click', () => {
    if (!deleteTargetId) return;
    const idx = mockMissions.findIndex(m => m.id === deleteTargetId);
    if (idx !== -1) mockMissions.splice(idx, 1);
    deleteTargetId = null;
    closeModal('deleteModal');
    updateStats();
    applyFiltersAndSearch();
  });

  document.getElementById('btnCancelDelete').addEventListener('click', () => closeModal('deleteModal'));

  // ── MODAL HELPERS ─────────────────────────────────────────
  function initModals() {
    ['previewModal', 'formModal', 'deleteModal'].forEach(id => {
      const modal = document.getElementById(id);
      const backdrop = modal.querySelector('.ms-modal__backdrop');
      const closeBtn = modal.querySelector('.ms-modal__close');
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
