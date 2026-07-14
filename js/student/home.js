// js/student/home.js
document.addEventListener("DOMContentLoaded", () => {
  initStickerProgress();
});

function initStickerProgress() {
  // Simulate fetching data for collected stickers
  const totalStickers = 4;
  const collectedStickers = 4;
  
  const progressBarFill = document.querySelector('.progress-bar-fill');
  const progressText = document.querySelector('.progress-text');
  
  if (progressBarFill && progressText) {
    const percentage = (collectedStickers / totalStickers) * 100;
    
    // Add a slight delay for a nice animation effect
    setTimeout(() => {
      progressBarFill.style.width = `${percentage}%`;
      progressText.textContent = `${collectedStickers} / Collected`;
    }, 300);
  }
}
