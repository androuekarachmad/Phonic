// js/admin/admin-navbar.js
// Modifies the Student bottom-nav component into an Admin nav after component-loader injects it.

(function() {
  const ADMIN_MENU = [
    { page: 'dashboard', href: 'dashboard.html', icon: 'ph-squares-four' },
    { page: 'students',  href: 'students.html',  icon: 'ph-users'        },
    { page: 'rewards',   href: 'rewards.html',   icon: 'ph-gift'         },
    { page: 'books',     href: 'books.html',     icon: 'ph-book'         },
    { page: 'games',     href: 'games.html',     icon: 'ph-game-controller' }
  ];

  function tryModify() {
    const nav = document.getElementById('bottomNavigation');
    if (!nav || nav.dataset.adminModified) return;
    nav.dataset.adminModified = 'true';
    modifyNav(nav);
  }

  // Poll until nav appears (component-loader is async)
  let attempts = 0;
  const poll = setInterval(() => {
    tryModify();
    if (document.getElementById('bottomNavigation') || ++attempts > 40) {
      clearInterval(poll);
    }
  }, 100);

  function modifyNav(nav) {
    // Remove student items
    nav.querySelectorAll('.bottom-nav-item').forEach(el => el.remove());

    // Add admin items
    ADMIN_MENU.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'bottom-nav-item';
      a.dataset.page = item.page;
      a.innerHTML = `<div class="icon-wrapper"><i class="ph ${item.icon}"></i></div>`;
      nav.appendChild(a);
    });

    // Ensure 5-item grid fits
    if (!document.getElementById('adminNavStyle')) {
      const s = document.createElement('style');
      s.id = 'adminNavStyle';
      s.textContent = `.bottom-nav { justify-content: space-evenly !important; }`;
      document.head.appendChild(s);
    }

    // Activate current page & bind click
    const path = window.location.pathname;
    let active = 'dashboard';
    if (path.includes('students')) active = 'students';
    else if (path.includes('rewards')) active = 'rewards';
    else if (path.includes('books'))   active = 'books';
    else if (path.includes('games'))   active = 'games';

    const items     = nav.querySelectorAll('.bottom-nav-item');
    const indicator = nav.querySelector('.nav-indicator');

    function setActive(item) {
      items.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      if (indicator) {
        const navR  = nav.getBoundingClientRect();
        const itemR = item.getBoundingClientRect();
        const cx = (itemR.left - navR.left) + itemR.width / 2 - indicator.offsetWidth / 2;
        indicator.style.transform = `translateX(${cx}px)`;
      }
    }

    items.forEach(item => {
      if (item.dataset.page === active) setTimeout(() => setActive(item), 80);
      item.addEventListener('click', e => {
        if (!item.classList.contains('active')) {
          e.preventDefault();
          setActive(item);
          setTimeout(() => { window.location.href = item.getAttribute('href'); }, 380);
        }
      });
    });

    window.addEventListener('resize', () => {
      const a = nav.querySelector('.bottom-nav-item.active');
      if (a) setActive(a);
    });
  }
}());

function modifyBottomNavForAdmin(nav) {

