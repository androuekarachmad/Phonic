// js/student/profile.js

document.addEventListener('DOMContentLoaded', () => {
  // 1. Trigger fade-in animation for the whole page
  const pageContainer = document.getElementById('profilePageContainer');
  if (pageContainer) {
    pageContainer.classList.add('fade-in');
  }

  // 2. Mark Bottom Navigation as Active
  // Wait a little bit for the component loader to finish loading bottom-nav
  setTimeout(() => {
    const navItems = document.querySelectorAll('.bottom-nav-item');
    navItems.forEach(item => {
      // Remove active from all
      item.classList.remove('active');
      // Set active based on data-page or href matching 'profile'
      if (item.getAttribute('data-page') === 'profile' || item.href.includes('profile')) {
        item.classList.add('active');
      }
    });
  }, 100);

  // 3. Avatar Interaction
  const avatarInteractive = document.getElementById('avatarInteractive');
  if (avatarInteractive) {
    avatarInteractive.addEventListener('click', () => {
      // Future logic: Trigger edit/upload profile photo modal
      console.log('Avatar clicked - ready for upload logic');
    });
  }

  // 4. Logout Interaction
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.addEventListener('click', () => {
      // Simple click effect / feedback
      btnLogout.style.transform = 'scale(0.95)';
      setTimeout(() => {
        btnLogout.style.transform = '';
        // Future logic: Call auth logout method and redirect to login
        console.log('Logout clicked');
      }, 150);
    });
  }

  // 5. Card click effects (Optional, as CSS handles hover/active mostly)
  const profileCards = document.querySelectorAll('.profile-card');
  profileCards.forEach(card => {
    card.addEventListener('click', () => {
      // Can add specific logic here if clicking a card should open a detail editor
      console.log('Profile card clicked');
    });
  });
});
