// js/student/stickers.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. Mark Bottom Navigation as Active
  // Wait a little bit for the component loader to finish loading bottom-nav
  setTimeout(() => {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      // Remove active from all
      item.classList.remove('active');
      // Assume stickers page maps to a data-page="stickers" or similar
      // The current bottom-nav uses 'sticker' or 'stickers'
      if (item.getAttribute('data-page') === 'sticker' || item.href.includes('sticker')) {
        item.classList.add('active');
      }
    });
  }, 100);

  // 2. Sticker Filtering Logic
  const filterChips = document.querySelectorAll('.filter-chip');
  const stickerItems = document.querySelectorAll('.sticker-item');

  filterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      // Remove active from all chips
      filterChips.forEach(c => c.classList.remove('active'));
      // Add active to clicked chip
      chip.classList.add('active');

      const filterValue = chip.getAttribute('data-filter');

      stickerItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category').toLowerCase();
        
        if (filterValue === 'all') {
          item.classList.remove('hidden');
        } else {
          // Check if the sticker's category string contains the filter keyword
          if (itemCategory.includes(filterValue)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        }
      });
    });
  });

  // 3. Open Modal Logic
  stickerItems.forEach(item => {
    item.addEventListener('click', () => {
      // openStickerPopup is defined in js/components/modal.js
      if (typeof window.openStickerPopup === 'function') {
        window.openStickerPopup(item);
      } else {
        console.warn('openStickerPopup function not found. Ensure modal.js is loaded.');
      }
    });
  });

});
