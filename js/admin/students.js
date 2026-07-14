// js/admin/students.js
// Logika untuk halaman Data Siswa (Admin)

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('studentContainer');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');
  const filterChips = document.querySelectorAll('.std-chip');

  let activeFilters = {
    kelas: 'all',
    level: 'all'
  };

  // Render awal
  renderStudents(mockStudents);

  // Event Listener Search
  searchInput.addEventListener('input', (e) => {
    applyFiltersAndSearch();
  });

  // Event Listener Filters
  filterChips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      const type = chip.dataset.filterType;
      const val = chip.dataset.filterVal;
      
      // Update UI active state
      document.querySelectorAll(`.std-chip[data-filter-type="${type}"]`).forEach(c => c.classList.remove('active'));
      chip.classList.add('active');

      // Update state
      activeFilters[type] = val;

      applyFiltersAndSearch();
    });
  });

  // Fungsi Filter & Search Gabungan
  function applyFiltersAndSearch() {
    const query = searchInput.value.toLowerCase().trim();
    
    const filteredData = mockStudents.filter(student => {
      // 1. Search match (Nama, NISN, Kelas)
      const matchSearch = student.nama.toLowerCase().includes(query) || 
                          student.nisn.includes(query) || 
                          student.kelas.toString() === query;
      
      // 2. Filter Kelas match
      const matchKelas = activeFilters.kelas === 'all' || student.kelas.toString() === activeFilters.kelas;
      
      // 3. Filter Level match
      // Logic for Level 4+
      let matchLevel = false;
      if (activeFilters.level === 'all') {
        matchLevel = true;
      } else if (activeFilters.level === '4') {
        matchLevel = student.level >= 4;
      } else {
        matchLevel = student.level.toString() === activeFilters.level;
      }

      return matchSearch && matchKelas && matchLevel;
    });

    renderStudents(filteredData);
  }

  // Fungsi Render DOM
  function renderStudents(data) {
    container.innerHTML = '';

    if (data.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    
    emptyState.classList.add('hidden');

    data.forEach(student => {
      const card = document.createElement('div');
      card.className = 'std-card';
      
      card.innerHTML = `
        <div class="std-card__head">
          <div class="std-avatar" style="background: ${student.avatarColor};">${student.avatar}</div>
          <div class="std-info">
            <h3 class="std-info__name">${student.nama}</h3>
            <p class="std-info__nisn">NISN: ${student.nisn}</p>
          </div>
        </div>

        <div class="std-tags">
          <span class="std-tag kelas">Kelas ${student.kelas}</span>
          <span class="std-tag level">Level ${student.level}</span>
          <span class="std-tag sticker"><i class="ph-fill ph-star"></i> ${student.sticker} Sticker</span>
        </div>

        <div class="std-progress-wrap">
          <div class="std-progress-head">
            <span>Progress XP</span>
            <span>${student.xp}%</span>
          </div>
          <div class="std-progress-bar">
            <div class="std-progress-fill" style="width: ${student.xp}%"></div>
          </div>
        </div>

        <div class="std-action">
          <button class="std-btn" onclick="window.location.href='student-detail.html?id=${student.id}'">Lihat Detail</button>
        </div>
      `;

      container.appendChild(card);
    });
  }
});
