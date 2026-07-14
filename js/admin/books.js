// js/admin/books.js
// Logika Books Management

document.addEventListener('DOMContentLoaded', () => {
  const container  = document.getElementById('bookContainer');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterChips = document.querySelectorAll('.std-chip');

  let activeFilters = { kelas: 'all', status: 'all' };
  let deleteTargetId = null;

  // ── CATEGORY GRADIENT MAP ───────────────────────────────
  const coverGradients = {
    Vocabulary: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
    Grammar:    'linear-gradient(135deg, #d1fae5, #ecfdf5)',
    Reading:    'linear-gradient(135deg, #ede9fe, #f5f3ff)',
    Story:      'linear-gradient(135deg, #fef3c7, #fffbeb)',
    Phonics:    'linear-gradient(135deg, #fce7f3, #fdf2f8)'
  };

  // ── INIT ─────────────────────────────────────────────────
  updateStats();
  renderBooks(mockBooks);
  initSearch();
  initFilters();
  initModals();

  // ── STATISTICS ───────────────────────────────────────────
  function updateStats() {
    document.getElementById('statTotal').textContent     = mockBooks.length;
    document.getElementById('statPublished').textContent = mockBooks.filter(b => b.status === 'Published').length;
    document.getElementById('statDraft').textContent     = mockBooks.filter(b => b.status === 'Draft').length;
    document.getElementById('statPopular').textContent   = mockBooks.filter(b => b.popular).length;
  }

  // ── RENDER ───────────────────────────────────────────────
  function renderBooks(data) {
    container.innerHTML = '';
    if (data.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');

    data.forEach(book => {
      const card = document.createElement('div');
      card.className = 'bk-card slide-up';
      card.dataset.id = book.id;

      const isPublished = book.status === 'Published';
      const gradient = coverGradients[book.category] || coverGradients.Reading;

      card.innerHTML = `
        <div class="bk-card__cover" style="background: ${gradient};" data-id="${book.id}" role="button" tabindex="0">
          <img src="${book.img}" alt="${book.title}" onerror="this.style.display='none'">
          <span class="bk-card__status-badge ${isPublished ? 'published' : 'draft'}">
            ${isPublished ? 'Published' : 'Draft'}
          </span>
        </div>

        <div class="bk-card__body">
          <h3 class="bk-card__title">${book.title}</h3>
          <p class="bk-card__author">${book.author}</p>
          <div class="bk-card__tags">
            <span class="bk-tag kelas">Kelas ${book.kelas}</span>
            <span class="bk-tag category">${book.category}</span>
            <span class="bk-tag pages"><i class="ph ph-files"></i> ${book.pages} hal.</span>
          </div>
        </div>

        <div class="bk-card__actions">
          <button class="bk-publish-toggle ${isPublished ? 'published' : 'draft'}" data-id="${book.id}">
            <i class="ph-fill ${isPublished ? 'ph-check-circle' : 'ph-pencil-circle'}"></i>
            <span>${isPublished ? 'Published' : 'Draft'}</span>
          </button>
          <div class="bk-action-group">
            <button class="bk-icon-btn preview-btn" data-id="${book.id}" title="Preview">
              <i class="ph ph-eye"></i>
            </button>
            <button class="bk-icon-btn edit-btn" data-id="${book.id}" title="Edit">
              <i class="ph ph-pencil-simple"></i>
            </button>
            <button class="bk-icon-btn delete" data-id="${book.id}" title="Hapus">
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
    // Cover click → preview
    container.querySelectorAll('.bk-card__cover').forEach(cover => {
      cover.addEventListener('click', () => openPreview(cover.dataset.id));
      cover.addEventListener('keydown', (e) => { if (e.key === 'Enter') openPreview(cover.dataset.id); });
    });
    // Preview button
    container.querySelectorAll('.preview-btn').forEach(btn => {
      btn.addEventListener('click', (e) => { e.stopPropagation(); openPreview(btn.dataset.id); });
    });
    // Edit button
    container.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditForm(btn.dataset.id));
    });
    // Delete button
    container.querySelectorAll('.bk-icon-btn.delete').forEach(btn => {
      btn.addEventListener('click', () => openDeleteModal(btn.dataset.id));
    });
    // Publish toggle
    container.querySelectorAll('.bk-publish-toggle').forEach(btn => {
      btn.addEventListener('click', () => togglePublish(btn.dataset.id));
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
    const filtered = mockBooks.filter(b => {
      const matchSearch = b.title.toLowerCase().includes(query) ||
                          b.author.toLowerCase().includes(query) ||
                          b.kelas.toString().includes(query) ||
                          b.category.toLowerCase().includes(query);
      const matchKelas  = activeFilters.kelas  === 'all' || b.kelas.toString() === activeFilters.kelas;
      const matchStatus = activeFilters.status === 'all' || b.status === activeFilters.status;
      return matchSearch && matchKelas && matchStatus;
    });
    renderBooks(filtered);
  }

  // ── TOGGLE PUBLISH ────────────────────────────────────────
  function togglePublish(id) {
    const book = mockBooks.find(b => b.id === id);
    if (!book) return;
    book.status = book.status === 'Published' ? 'Draft' : 'Published';
    updateStats();
    applyFiltersAndSearch();
  }

  // ── PREVIEW MODAL ─────────────────────────────────────────
  function openPreview(id) {
    const book = mockBooks.find(b => b.id === id);
    if (!book) return;

    const isPublished = book.status === 'Published';
    const gradient    = coverGradients[book.category] || coverGradients.Reading;

    document.getElementById('previewImg').src        = book.img;
    document.getElementById('previewCoverBg').style.background = gradient;
    document.getElementById('previewTitle').textContent  = book.title;
    document.getElementById('previewAuthor').textContent = book.author;
    document.getElementById('previewDesc').textContent   = book.desc;
    document.getElementById('previewKelas').textContent  = `Kelas ${book.kelas}`;
    document.getElementById('previewPages').textContent  = `${book.pages} hal.`;

    const statusBadge = document.getElementById('previewStatus');
    statusBadge.textContent = book.status;
    statusBadge.className   = `bk-badge-status ${isPublished ? 'published' : 'draft'}`;

    document.getElementById('previewCat').textContent = book.category;

    openModal('previewModal');
  }

  // ── ADD / EDIT FORM ───────────────────────────────────────
  document.getElementById('btnAddBook').addEventListener('click', () => {
    document.getElementById('formTitle').textContent = 'Tambah Buku Baru';
    document.getElementById('bookForm').reset();
    document.getElementById('formId').value = '';
    openModal('formModal');
  });

  function openEditForm(id) {
    const book = mockBooks.find(b => b.id === id);
    if (!book) return;
    document.getElementById('formTitle').textContent    = 'Edit Buku';
    document.getElementById('formId').value             = book.id;
    document.getElementById('formTitle2').value         = book.title;
    document.getElementById('formAuthor').value         = book.author;
    document.getElementById('formCategory').value       = book.category;
    document.getElementById('formKelas').value          = book.kelas.toString();
    document.getElementById('formPages').value          = book.pages;
    document.getElementById('formStatus').value         = book.status;
    document.getElementById('formDesc').value           = book.desc;
    openModal('formModal');
  }

  document.getElementById('bookForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('formId').value;
    const payload = {
      title    : document.getElementById('formTitle2').value,
      author   : document.getElementById('formAuthor').value,
      category : document.getElementById('formCategory').value,
      kelas    : parseInt(document.getElementById('formKelas').value),
      pages    : parseInt(document.getElementById('formPages').value),
      status   : document.getElementById('formStatus').value,
      desc     : document.getElementById('formDesc').value,
      img      : '../../assets/images/mascot/mascot-home.png',
      popular  : false
    };

    if (id) {
      const idx = mockBooks.findIndex(b => b.id === id);
      if (idx !== -1) mockBooks[idx] = { ...mockBooks[idx], ...payload };
    } else {
      mockBooks.push({ id: 'B' + Date.now(), ...payload });
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
    const idx = mockBooks.findIndex(b => b.id === deleteTargetId);
    if (idx !== -1) mockBooks.splice(idx, 1);
    deleteTargetId = null;
    closeModal('deleteModal');
    updateStats();
    applyFiltersAndSearch();
  });

  document.getElementById('btnCancelDelete').addEventListener('click', () => closeModal('deleteModal'));

  // ── MODAL HELPERS ─────────────────────────────────────────
  function initModals() {
    ['previewModal', 'formModal', 'deleteModal'].forEach(id => {
      const modal    = document.getElementById(id);
      const backdrop = modal.querySelector('.bk-modal__backdrop');
      const closeBtn = modal.querySelector('.bk-modal__close');
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
