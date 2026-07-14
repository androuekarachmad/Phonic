/**
 * js/components/logout-modal.js
 * Reusable Logout Confirmation Modal
 * Requires: auth.js, toast.js
 *
 * Usage: LogoutModal.show();
 * Attach trigger: document.getElementById('btnLogout').addEventListener('click', () => LogoutModal.show());
 */

const LogoutModal = (() => {
  const MODAL_ID = 'phonicLogoutModal';

  function _inject() {
    if (document.getElementById(MODAL_ID)) return;

    const modal = document.createElement('div');
    modal.id = MODAL_ID;
    modal.innerHTML = `
      <div class="lm-backdrop" id="lmBackdrop"></div>
      <div class="lm-sheet" id="lmSheet" role="dialog" aria-modal="true" aria-labelledby="lmTitle">
        <div class="lm-handle"></div>
        <div class="lm-icon">
          <i class="ph-fill ph-sign-out"></i>
        </div>
        <h2 class="lm-title" id="lmTitle">Keluar dari Akun?</h2>
        <p class="lm-body">Apakah Anda yakin ingin keluar dari akun?</p>
        <div class="lm-actions">
          <button class="lm-btn lm-btn--cancel" id="lmBtnCancel">Batal</button>
          <button class="lm-btn lm-btn--confirm" id="lmBtnConfirm">Keluar</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('lmBackdrop').addEventListener('click', hide);
    document.getElementById('lmBtnCancel').addEventListener('click', hide);
    document.getElementById('lmBtnConfirm').addEventListener('click', _handleConfirm);

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') hide();
    });
  }

  function _handleConfirm() {
    const btn = document.getElementById('lmBtnConfirm');
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Keluar...';
    }
    setTimeout(() => {
      window.Auth.logout();
    }, 600);
  }

  function show() {
    _inject();
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  function hide() {
    const modal = document.getElementById(MODAL_ID);
    if (modal) {
      modal.classList.remove('is-open');
      document.body.style.overflow = '';
      // Re-enable confirm button if hidden mid-action
      const btn = document.getElementById('lmBtnConfirm');
      if (btn) { btn.disabled = false; btn.textContent = 'Keluar'; }
    }
  }

  return { show, hide };
})();

window.LogoutModal = LogoutModal;
