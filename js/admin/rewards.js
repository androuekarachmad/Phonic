// js/admin/rewards.js
// Logika Rewards Management

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('rewardContainer');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterChips = document.querySelectorAll('.std-chip');

  let activeFilters = { status: 'all', rarity: 'all' };
  let deleteTargetId = null;

  // ── INIT ─────────────────────────────────────────────────
  updateStats();
  renderRewards(mockRewards);
  initSearch();
  initFilters();
  initModals();

  // ── STATISTICS ───────────────────────────────────────────
  function updateStats() {
    document.getElementById('statTotal').textContent = mockRewards.length;
    document.getElementById('statActive').textContent = mockRewards.filter(r => r.status === 'Unlocked').length;
    document.getElementById('statLocked').textContent = mockRewards.filter(r => r.status === 'Locked').length;
    document.getElementById('statLegendary').textContent = mockRewards.filter(r => r.rarity === 'Legendary').length;
  }

  // ── RENDER ───────────────────────────────────────────────
  function renderRewards(data) {
    container.innerHTML = '';
    if (data.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');

    data.forEach(reward => {
      const card = document.createElement('div');
      card.className = 'rw-card slide-up';
      card.setAttribute('data-rarity', reward.rarity);
      card.dataset.id = reward.id;

      const isLocked = reward.status === 'Locked';
      card.innerHTML = `
        <div class="rw-card__head">
          <div class="rw-card__img-wrap">
            <img src="${reward.img}" alt="${reward.name}" onerror="this.style.display='none'">
          </div>
          <div class="rw-card__info">
            <h3 class="rw-card__title">${reward.name}</h3>
            <p class="rw-card__cat">${reward.category}</p>
          </div>
          <span class="rw-badge">${reward.rarity}</span>
        </div>

        <div class="rw-card__stats">
          <div class="rw-stat">
            <span>Min Level</span>
            <strong>Lv.${reward.minLevel}</strong>
          </div>
          <div class="rw-stat">
            <span>XP Req</span>
            <strong>${reward.xpReq} XP</strong>
          </div>
        </div>

        <div class="rw-card__actions">
          <button class="rw-toggle ${isLocked ? 'locked' : 'unlocked'}" data-id="${reward.id}" title="Toggle Lock">
            <i class="ph-fill ${isLocked ? 'ph-lock-simple' : 'ph-lock-simple-open'}"></i>
            <span>${isLocked ? 'Locked' : 'Unlocked'}</span>
          </button>

          <div class="rw-action-group">
            <button class="rw-btn-icon preview-btn" data-id="${reward.id}" title="Preview">
              <i class="ph ph-eye"></i>
            </button>
            <button class="rw-btn-icon edit-btn" data-id="${reward.id}" title="Edit">
              <i class="ph ph-pencil-simple"></i>
            </button>
            <button class="rw-btn-icon delete" data-id="${reward.id}" title="Hapus">
              <i class="ph ph-trash"></i>
            </button>
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    bindCardEvents();
  }

  function bindCardEvents() {
    // Preview buttons
    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', () => openPreview(btn.dataset.id));
    });
    // Edit buttons
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditForm(btn.dataset.id));
    });
    // Delete buttons
    container.querySelectorAll('.rw-btn-icon.delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
    });
    // Toggle lock buttons
    container.querySelectorAll('.rw-toggle').forEach(btn => {
      btn.addEventListener('click', () => toggleLock(btn.dataset.id));
    });
  }

  // ── SEARCH ───────────────────────────────────────────────
  function initSearch() {
    searchInput.addEventListener('input', applyFiltersAndSearch);
  }

  // ── FILTERS ──────────────────────────────────────────────
  function initFilters() {
    filterChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const type = chip.dataset.filterType;
        const val = chip.dataset.filterVal;
        document.querySelectorAll(`.std-chip[data-filter-type="${type}"]`).forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeFilters[type] = val;
        applyFiltersAndSearch();
      });
    });
  }

  function applyFiltersAndSearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = mockRewards.filter(r => {
      const matchSearch = r.name.toLowerCase().includes(query) ||
                          r.category.toLowerCase().includes(query) ||
                          r.rarity.toLowerCase().includes(query);
      const matchStatus = activeFilters.status === 'all' || r.status === activeFilters.status;
      const matchRarity = activeFilters.rarity === 'all' || r.rarity === activeFilters.rarity;
      return matchSearch && matchStatus && matchRarity;
    });
    renderRewards(filtered);
  }

  // ── TOGGLE LOCK ───────────────────────────────────────────
  function toggleLock(id) {
    const reward = mockRewards.find(r => r.id === id);
    if (!reward) return;
    reward.status = reward.status === 'Locked' ? 'Unlocked' : 'Locked';
    updateStats();
    applyFiltersAndSearch();
  }

  // ── PREVIEW MODAL ─────────────────────────────────────────
  function openPreview(id) {
    const reward = mockRewards.find(r => r.id === id);
    if (!reward) return;

    document.getElementById('previewImg').src = reward.img;
    document.getElementById('previewName').textContent = reward.name;
    document.getElementById('previewCat').textContent = reward.category;
    document.getElementById('previewDesc').textContent = reward.desc;
    document.getElementById('previewMinLevel').textContent = `Level ${reward.minLevel}`;
    document.getElementById('previewXp').textContent = `${reward.xpReq} XP`;
    document.getElementById('previewStatus').textContent = reward.status;

    const badge = document.getElementById('previewRarity');
    badge.textContent = reward.rarity;
    badge.setAttribute('data-rarity', reward.rarity);

    const colorMap = {
      Common: '#64748b', Rare: '#3b82f6', Epic: '#a855f7', Legendary: '#d97706'
    };
    const bgMap = {
      Common: '#f1f5f9', Rare: '#eff6ff', Epic: '#faf5ff', Legendary: '#fffbeb'
    };
    badge.style.color = colorMap[reward.rarity] || '#64748b';
    badge.style.background = bgMap[reward.rarity] || '#f1f5f9';

    document.getElementById('previewBg').style.background = bgMap[reward.rarity] || '#f8faff';

    openModal('previewModal');
  }

  // ── ADD FORM MODAL ────────────────────────────────────────
  document.getElementById('btnAddReward').addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Tambah Reward';
    document.getElementById('rewardForm').reset();
    document.getElementById('formId').value = '';
    openModal('formModal');
  });

  function openEditForm(id) {
    const reward = mockRewards.find(r => r.id === id);
    if (!reward) return;
    document.getElementById('formTitle').textContent = 'Edit Reward';
    document.getElementById('formId').value = reward.id;
    document.getElementById('formName').value = reward.name;
    document.getElementById('formCategory').value = reward.category;
    document.getElementById('formRarity').value = reward.rarity;
    document.getElementById('formMinLevel').value = reward.minLevel;
    document.getElementById('formXp').value = reward.xpReq;
    document.getElementById('formStatus').value = reward.status;
    document.getElementById('formDesc').value = reward.desc;
    openModal('formModal');
  }

  document.getElementById('rewardForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('formId').value;
    const formData = {
      name: document.getElementById('formName').value,
      category: document.getElementById('formCategory').value,
      rarity: document.getElementById('formRarity').value,
      minLevel: parseInt(document.getElementById('formMinLevel').value),
      xpReq: parseInt(document.getElementById('formXp').value),
      status: document.getElementById('formStatus').value,
      desc: document.getElementById('formDesc').value,
      img: '../../assets/images/mascot/mascot-home.png'
    };

    if (id) {
      // EDIT
      const idx = mockRewards.findIndex(r => r.id === id);
      if (idx !== -1) {
        mockRewards[idx] = { ...mockRewards[idx], ...formData };
      }
    } else {
      // ADD
      const newId = 'R' + String(Date.now()).slice(-4);
      mockRewards.push({ id: newId, ...formData });
    }

    closeModal('formModal');
    updateStats();
    applyFiltersAndSearch();
  });

  // ── DELETE MODAL ──────────────────────────────────────────
  function openDeleteModal(id) {
    deleteTargetId = id;
    openModal('deleteModal');
  }

  document.getElementById('btnConfirmDelete').addEventListener('click', () => {
    if (!deleteTargetId) return;
    const idx = mockRewards.findIndex(r => r.id === deleteTargetId);
    if (idx !== -1) mockRewards.splice(idx, 1);
    deleteTargetId = null;
    closeModal('deleteModal');
    updateStats();
    applyFiltersAndSearch();
  });

  document.getElementById('btnCancelDelete').addEventListener('click', () => {
    deleteTargetId = null;
    closeModal('deleteModal');
  });

  // ── MODAL HELPERS ─────────────────────────────────────────
  function initModals() {
    ['previewModal', 'formModal', 'deleteModal'].forEach(id => {
      const modal = document.getElementById(id);
      const backdrop = modal.querySelector('.rw-modal__backdrop');
      const closeBtn = modal.querySelector('.rw-modal__close');
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
