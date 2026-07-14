// js/student/games.js

document.addEventListener('DOMContentLoaded', () => {
  const gameCarousel = document.getElementById('gameCarousel');
  const pagination = document.getElementById('carouselPagination');
  const searchInput = document.getElementById('gameSearch');

  if (!window.GAMES_DATA) {
    console.error("GAMES_DATA not loaded. Ensure js/data/games.js is loaded first.");
    return;
  }

  let games = window.GAMES_DATA;

  // Render carousel
  function renderCarousel(gamesList) {
    gameCarousel.innerHTML = '';
    pagination.innerHTML = '';

    if (gamesList.length === 0) {
      gameCarousel.innerHTML = '<p style="text-align:center; width:100%; color:var(--color-text-muted);">No games found.</p>';
      return;
    }

    gamesList.forEach((game, index) => {
      // Create card
      const a = document.createElement('a');
      a.className = `game-card ${game.status === 'coming_soon' ? 'disabled' : ''}`;
      if (game.status === 'active') {
        a.href = `game-mode.html?gameId=${game.id}`;
      }

      // Card Content
      let content = `<img src="${game.image}" alt="${game.title}" class="game-card-img" onerror="this.src='../../assets/images/backgrounds/games-banner.png'">`;
      
      if (game.status === 'coming_soon') {
        content += `
          <div class="game-card-coming-soon">
            <i class="ph-fill ph-lock-key"></i>
            <h3>Coming Soon</h3>
          </div>
        `;
      }

      a.innerHTML = content;
      gameCarousel.appendChild(a);

      // Create pagination dot
      const dot = document.createElement('div');
      dot.className = `dot ${index === 0 ? 'active' : ''}`;
      dot.dataset.index = index;
      pagination.appendChild(dot);
    });
  }

  renderCarousel(games);

  // Search filter
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = games.filter(g => 
      g.title.toLowerCase().includes(term) || g.subtitle.toLowerCase().includes(term)
    );
    renderCarousel(filtered);
    updateActiveDot();
  });

  // Scroll detection for active dot
  gameCarousel.addEventListener('scroll', updateActiveDot);

  function updateActiveDot() {
    const scrollLeft = gameCarousel.scrollLeft;
    const cardWidth = gameCarousel.offsetWidth;
    const activeIndex = Math.round(scrollLeft / cardWidth);

    const dots = pagination.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      if (index === activeIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
});
