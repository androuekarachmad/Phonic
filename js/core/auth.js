/**
 * js/core/auth.js
 * PHONIC — Centralized Authentication System
 *
 * Public API (via window.Auth):
 *   Auth.login(username, password, remember)
 *   Auth.logout()
 *   Auth.register(data)
 *   Auth.getCurrentUser()
 *   Auth.isLoggedIn()
 *   Auth.checkRole(requiredRole)
 *   Auth.redirectByRole()
 *   Auth.autoLogin()
 *   Auth.initSplash()
 *   Auth.clearSession()
 *   Auth.populateUserUI()
 *
 * Session key: 'phonicUser'
 * Registered users key: 'phonicUsers'
 *
 * ARCHITECTURE NOTE:
 *  - Default users live in js/data/users.js (window.PHONIC_DEFAULT_USERS).
 *  - Registered students are saved to localStorage key 'phonicUsers'.
 *  - auth.js merges both lists when looking up a user.
 *  - Replace _findUser() and the storage calls to integrate a real backend later.
 */

const Auth = (() => {
  // ─── Constants ─────────────────────────────────────────────────────────────
  const SESSION_KEY  = 'phonicUser';
  const REG_KEY      = 'phonicUsers';   // LocalStorage: registered student accounts

  // ─── Storage Helpers ────────────────────────────────────────────────────────
  function _saveSession(user, remember) {
    const json = JSON.stringify(user);
    if (remember) {
      localStorage.setItem(SESSION_KEY, json);
    } else {
      sessionStorage.setItem(SESSION_KEY, json);
    }
  }

  function _readSession() {
    const ls = localStorage.getItem(SESSION_KEY);
    const ss = sessionStorage.getItem(SESSION_KEY);
    if (ls) return JSON.parse(ls);
    if (ss) return JSON.parse(ss);
    return null;
  }

  function _clearSession() {
    localStorage.removeItem(SESSION_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  }

  // ─── User Lookup ────────────────────────────────────────────────────────────
  function _getRegisteredUsers() {
    try {
      return JSON.parse(localStorage.getItem(REG_KEY) || '[]');
    } catch {
      return [];
    }
  }

  function _saveRegisteredUsers(users) {
    localStorage.setItem(REG_KEY, JSON.stringify(users));
  }

  /**
   * Merge default users (from users.js) + registered users from LocalStorage.
   * Default users take precedence (cannot be overwritten by registration).
   */
  function _getAllUsers() {
    const defaults   = window.PHONIC_DEFAULT_USERS || [];
    const registered = _getRegisteredUsers();
    return [...defaults, ...registered];
  }

  function _findUser(username) {
    return _getAllUsers().find(u => u.username === username) || null;
  }

  // ─── Path Utilities ─────────────────────────────────────────────────────────
  /**
   * Returns the correct path to login.html based on current directory depth.
   * depth 0 = root (index.html / login.html)
   * depth 1 = e.g. pages/student/
   * depth 2 = not used yet
   */
  function _loginPath() {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    if (depth >= 2) return '../../login.html';
    if (depth === 1) return '../login.html';
    return 'login.html';
  }

  function _homePath(role) {
    const depth = (window.location.pathname.match(/\//g) || []).length - 1;
    const prefix = depth >= 2 ? '../../' : depth === 1 ? '../' : '';
    if (role === 'admin') return `${prefix}pages/admin/dashboard.html`;
    return `${prefix}pages/student/home.html`;
  }

  // ─── Public API ─────────────────────────────────────────────────────────────

  /**
   * login(username, password, remember)
   * Validates credentials and saves session.
   * Returns Promise<user> on success, rejects with descriptive Error on failure.
   */
  function login(username, password, remember = false) {
    return new Promise((resolve, reject) => {
      // Simulate async network delay
      setTimeout(() => {
        const user = _findUser(username);

        if (!user) {
          reject(new Error('Username tidak ditemukan.'));
          return;
        }
        if (user.password !== password) {
          reject(new Error('Password salah.'));
          return;
        }

        // Build clean session object (no password stored)
        const session = {
          username: user.username,
          role:     user.role,
          name:     user.name,
          nisn:     user.nisn  || null,
          class:    user.class || null,
          gender:   user.gender || null
        };

        _saveSession(session, remember);
        resolve(session);
      }, 1000);
    });
  }

  /**
   * logout()
   * Clears session and redirects to login page.
   */
  function logout() {
    _clearSession();
    window.location.href = _loginPath();
  }

  /**
   * register(data)
   * Registers a new student account in LocalStorage.
   * data: { username, password, name, nisn, class, gender }
   * Returns Promise<session> and auto-logs in.
   */
  function register(data) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check uniqueness
        if (_findUser(data.username)) {
          reject(new Error('Username atau NISN sudah terdaftar.'));
          return;
        }

        const newUser = {
          username: data.username,
          password: data.password,
          role:     'student',
          name:     data.name,
          nisn:     data.nisn  || data.username,
          class:    data.class || null,
          gender:   data.gender || null
        };

        // Persist to LocalStorage
        const users = _getRegisteredUsers();
        users.push(newUser);
        _saveRegisteredUsers(users);

        // Auto-login (remember = true so the account persists)
        const session = {
          username: newUser.username,
          role:     newUser.role,
          name:     newUser.name,
          nisn:     newUser.nisn,
          class:    newUser.class,
          gender:   newUser.gender
        };
        _saveSession(session, true);
        resolve(session);
      }, 1200);
    });
  }

  /**
   * getCurrentUser()
   * Returns the current session object or null.
   */
  function getCurrentUser() {
    return _readSession();
  }

  /**
   * isLoggedIn()
   * Returns true if a valid session exists.
   */
  function isLoggedIn() {
    return _readSession() !== null;
  }

  /**
   * checkRole(requiredRole)
   * Guards a page. If not logged in or role doesn't match → redirects.
   * Call this as the FIRST script on every protected page.
   *
   * Usage (student page):  Auth.checkRole('student');
   * Usage (admin page):    Auth.checkRole('admin');
   */
  function checkRole(requiredRole) {
    const user = _readSession();

    if (!user) {
      // Not logged in → send to login
      window.location.replace(_loginPath());
      return;
    }

    if (user.role !== requiredRole) {
      // Wrong role → send to their correct home
      window.location.replace(_homePath(user.role));
    }
  }

  /**
   * redirectByRole()
   * Redirects user to their correct dashboard based on role.
   * Used on login page to prevent already-logged-in users from seeing login form.
   */
  function redirectByRole() {
    const user = _readSession();
    if (!user) return;
    window.location.replace(_homePath(user.role));
  }

  /**
   * autoLogin()
   * Used by Splash Screen. Checks session and redirects.
   * Redirects to login if no session.
   */
  function autoLogin() {
    const user = _readSession();
    if (!user) {
      window.location.href = _loginPath();
    } else {
      window.location.href = _homePath(user.role);
    }
  }

  /**
   * initSplash(delay)
   * Wrapper for Splash Screen: waits for animation then calls autoLogin().
   */
  function initSplash(delay = 2800) {
    setTimeout(autoLogin, delay);
  }

  /**
   * clearSession()
   * Explicitly clears session (useful for testing).
   */
  function clearSession() {
    _clearSession();
  }

  /**
   * populateUserUI()
   * Convenience method: fills in common UI elements with current user data.
   * Looks for elements with data-auth-* attributes:
   *   data-auth-name    → fills textContent with user.name
   *   data-auth-nisn    → fills textContent with user.nisn
   *   data-auth-class   → fills textContent with user.class
   *   data-auth-initial → fills textContent with first letter of user.name
   */
  function populateUserUI() {
    const user = _readSession();
    if (!user) return;

    document.querySelectorAll('[data-auth-name]').forEach(el => {
      el.textContent = user.name || '';
    });
    document.querySelectorAll('[data-auth-nisn]').forEach(el => {
      el.textContent = user.nisn || '-';
    });
    document.querySelectorAll('[data-auth-class]').forEach(el => {
      el.textContent = user.class || '-';
    });
    document.querySelectorAll('[data-auth-initial]').forEach(el => {
      el.textContent = (user.name || 'U').charAt(0).toUpperCase();
    });
  }

  // ─── Dropdown UI ────────────────────────────────────────────────────────────
  function _initDropdown() {
    const triggers = document.querySelectorAll('.auth-avatar-trigger');
    if (triggers.length === 0) return;

    triggers.forEach(trigger => {
      // Create dropdown
      const menu = document.createElement('div');
      menu.className = 'auth-dropdown-menu';
      
      const user = _readSession();
      const userName = user ? user.name : 'User';
      const userRole = user ? (user.role === 'admin' ? 'Admin' : 'Siswa') : '';

      menu.innerHTML = `
        <div style="padding: 8px 16px; border-bottom: 1px solid #e2e8f0; margin-bottom: 8px;">
          <div style="font-weight: 700; color: var(--color-primary-dark); font-size: 14px;">${userName}</div>
          <div style="font-size: 12px; color: #64748b;">${userRole}</div>
        </div>
        <button class="auth-dropdown-item logout" id="authDropdownLogout">
          <i class="ph-fill ph-sign-out" style="font-size: 18px;"></i>
          Keluar
        </button>
      `;

      trigger.appendChild(menu);

      // Toggle
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = menu.classList.contains('is-open');
        document.querySelectorAll('.auth-dropdown-menu').forEach(m => m.classList.remove('is-open'));
        if (!isOpen) menu.classList.add('is-open');
      });

      // Handle logout click
      menu.querySelector('#authDropdownLogout').addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.remove('is-open');
        if (window.LogoutModal) {
          window.LogoutModal.show();
        } else {
          Auth.logout();
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', () => {
      document.querySelectorAll('.auth-dropdown-menu').forEach(m => m.classList.remove('is-open'));
    });
  }

  // ─── Initialize ─────────────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    _initDropdown();
  });

  // ─── Expose Public API ───────────────────────────────────────────────────────
  return {
    login,
    logout,
    register,
    getCurrentUser,
    isLoggedIn,
    checkRole,
    redirectByRole,
    autoLogin,
    initSplash,
    clearSession,
    populateUserUI
  };
})();

window.Auth = Auth;
