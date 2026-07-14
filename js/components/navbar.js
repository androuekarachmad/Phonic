// js/components/navbar.js
(function() {
  function initNavbar() {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    const indicator = document.querySelector('.nav-indicator');
    if (navItems.length === 0 || !indicator) return;

    // Get current page name from URL
    const path = window.location.pathname;
    let currentPage = 'home'; // default
    
    if (path.includes('level.html')) currentPage = 'level';
    else if (path.includes('sticker')) currentPage = 'sticker';
    else if (path.includes('profile.html')) currentPage = 'profile';

    function setActive(item) {
      // Remove active from all
      navItems.forEach(nav => nav.classList.remove('active'));
      // Add active to clicked item
      item.classList.add('active');

      // Move the indicator
      const navRect = document.querySelector('.bottom-nav').getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();
      
      // Calculate center position
      const centerOffset = (itemRect.left - navRect.left) + (itemRect.width / 2) - (indicator.offsetWidth / 2);
      
      indicator.style.transform = `translateX(${centerOffset}px)`;
    }

    // Set initial active state
    navItems.forEach(item => {
      if (item.dataset.page === currentPage) {
        // Need a small timeout to ensure DOM layout is complete before calculating offsets
        setTimeout(() => setActive(item), 50);
      }

      // Add click listener for smooth page transition animation
      item.addEventListener('click', (e) => {
        // Only prevent default if it's not already active
        if (!item.classList.contains('active')) {
          e.preventDefault(); // Stop immediate navigation
          setActive(item);    // Run the animation
          
          // Wait for animation to finish before navigating
          setTimeout(() => {
            window.location.href = item.getAttribute('href');
          }, 400); // 400ms matches the CSS transition duration
        }
      });
    });
    
    // Handle window resize to re-center the indicator
    window.addEventListener('resize', () => {
      const activeItem = document.querySelector('.bottom-nav-item.active');
      if (activeItem) setActive(activeItem);
    });
  }

  // Run initialization
  // setTimeout used just to ensure it fires after component is fully loaded into DOM
  setTimeout(initNavbar, 100);
})();
