// js/components/modal.js

/**
 * Open the Reward Popup Modal
 * @param {Event} e - The click event
 */
window.openRewardPopup = function(e) {
  if (e) e.preventDefault();
  
  const modal = document.getElementById('rewardModal');
  if (modal) {
    modal.classList.add('show');
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
  }
};

/**
 * Close the Reward Popup Modal
 */
window.closeRewardPopup = function() {
  const modal = document.getElementById('rewardModal');
  if (modal) {
    modal.classList.remove('show');
    // Restore background scrolling
    document.body.style.overflow = '';
  }
};

// Listen for clicks on the backdrop to close the modal
document.addEventListener('click', function(e) {
  const rewardModal = document.getElementById('rewardModal');
  const stickerModal = document.getElementById('stickerModal');
  
  if (rewardModal && rewardModal.classList.contains('show') && e.target === rewardModal) {
    closeRewardPopup();
  }
  
  if (stickerModal && stickerModal.classList.contains('show') && e.target === stickerModal) {
    closeStickerPopup();
  }
});

/**
 * Open the Sticker Detail Modal with dynamic data
 * @param {HTMLElement} cardElement - The clicked sticker card element
 */
window.openStickerPopup = function(cardElement) {
  const modal = document.getElementById('stickerModal');
  if (!modal) return;
  
  // Extract data from the clicked card
  const title = cardElement.getAttribute('data-name') || 'Unknown Sticker';
  const rarity = cardElement.getAttribute('data-rarity') || 'Common';
  const desc = cardElement.getAttribute('data-desc') || 'A cool sticker to collect.';
  const imgSrc = cardElement.getAttribute('data-img') || '../../assets/images/stickers/sticker-locked.png';
  const howToGet = cardElement.getAttribute('data-how-to-get') || 'Unknown';
  const isLocked = cardElement.classList.contains('locked');
  
  // Elements in modal
  const modalImg = document.getElementById('stickerModalImage');
  const modalTitle = document.getElementById('stickerModalTitle');
  const modalDesc = document.getElementById('stickerModalDesc');
  const modalBadge = document.getElementById('stickerModalBadge');
  const metaRarity = document.getElementById('metaRarity');
  const metaHowTo = document.getElementById('metaHowTo');
  
  // Populate data
  if (modalImg) {
    modalImg.src = imgSrc;
    modalImg.style.filter = isLocked ? 'grayscale(100%) brightness(0.2)' : 'none';
  }
  if (modalTitle) modalTitle.textContent = title;
  if (modalDesc) modalDesc.textContent = desc;
  
  // Configure Badge
  if (modalBadge) {
    modalBadge.className = 'reward-badge'; // reset
    if (isLocked) {
      modalBadge.classList.add('badge-locked');
      modalBadge.innerHTML = '<i class="ph ph-lock-key"></i> Locked';
    } else {
      modalBadge.classList.add(`badge-${rarity.toLowerCase()}`); // e.g. badge-rare, badge-epic
      modalBadge.textContent = rarity;
    }
  }
  
  if (metaRarity) metaRarity.textContent = rarity;
  if (metaHowTo) metaHowTo.textContent = howToGet;
  
  // Show Modal
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
};

/**
 * Close the Sticker Detail Modal
 */
window.closeStickerPopup = function() {
  const modal = document.getElementById('stickerModal');
  if (modal) {
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
};
