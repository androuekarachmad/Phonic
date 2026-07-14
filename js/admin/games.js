// js/admin/games.js
// Logika untuk halaman daftar Game

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('gameContainer');
  const emptyState = document.getElementById('emptyState');
  const searchInput = document.getElementById('searchInput');

  // ── INIT ─────────────────────────────────────────────────
  updateStats();
  renderGames(mockGames);
  
  if (searchInput) {
    searchInput.addEventListener('input', applySearch);
  }

  // ── STATISTICS ───────────────────────────────────────────
  function updateStats() {
    document.getElementById('statGames').textContent = mockGames.length;
    document.getElementById('statQuestions').textContent = mockQuestions.length;
    document.getElementById('statEasy').textContent = mockQuestions.filter(q => q.difficulty === 'Easy').length;
    document.getElementById('statHard').textContent = mockQuestions.filter(q => q.difficulty === 'Hard').length;
  }

  // ── RENDER ───────────────────────────────────────────────
  function renderGames(data) {
    container.innerHTML = '';
    
    if (data.length === 0) {
      emptyState.classList.remove('hidden');
      return;
    }
    emptyState.classList.add('hidden');

    data.forEach(game => {
      const card = document.createElement('div');
      card.className = 'gm-card slide-up';
      
      const isActive = game.status === 'Active';

      card.innerHTML = `
        <div class="gm-card__header">
          <img src="${game.img}" alt="Cover" class="gm-card__cover" style="width:60px; height:60px; border-radius:12px; object-fit:cover; flex-shrink:0;">
          <div class="gm-card__info">
            <h3 class="gm-card__title">${game.title}</h3>
            <p class="gm-card__desc">${game.desc}</p>
            <span class="gm-badge ${isActive ? 'active' : ''}">${game.status}</span>
          </div>
        </div>
        <div class="gm-card__actions">
          ${isActive ? 
            `<button class="gm-btn-primary btn-manage" data-id="${game.id}">Kelola Soal (${game.totalQuestions()})</button>
             <button class="gm-btn-secondary" onclick="alert('Membuka Preview Game...')"><i class="ph-bold ph-play"></i> Preview</button>` 
            : 
            `<button class="gm-btn-secondary" disabled>Belum Tersedia</button>`
          }
        </div>
      `;

      container.appendChild(card);
    });

    bindEvents();
  }

  function bindEvents() {
    container.querySelectorAll('.btn-manage').forEach(btn => {
      btn.addEventListener('click', () => {
        window.location.href = `game-detail.html?id=${btn.dataset.id}`;
      });
    });
  }

  // ── SEARCH ───────────────────────────────────────────────
  function applySearch() {
    const query = searchInput.value.toLowerCase().trim();
    const filtered = mockGames.filter(g => 
      g.title.toLowerCase().includes(query) || 
      g.desc.toLowerCase().includes(query)
    );
    renderGames(filtered);
  }
});
