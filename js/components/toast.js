/**
 * components/toast.js
 * Modern Toast Notification System
 */

const Toast = {
  container: null,

  init() {
    if (!document.getElementById('toast-container')) {
      this.container = document.createElement('div');
      this.container.id = 'toast-container';
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    } else {
      this.container = document.getElementById('toast-container');
    }
  },

  show(message, type = 'info', duration = 3000) {
    if (!this.container) this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;

    let iconClass = 'ph-info';
    if (type === 'success') iconClass = 'ph-check-circle';
    if (type === 'error') iconClass = 'ph-warning-circle';

    toast.innerHTML = `
      <i class="ph-fill ${iconClass}"></i>
      <span>${message}</span>
    `;

    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hiding');
      toast.addEventListener('animationend', () => {
        if (toast.parentNode === this.container) {
          this.container.removeChild(toast);
        }
      });
    }, duration);
  },

  success(message) { this.show(message, 'success'); },
  error(message) { this.show(message, 'error'); },
  info(message) { this.show(message, 'info'); }
};

window.Toast = Toast;
