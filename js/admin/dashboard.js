// js/admin/dashboard.js

document.addEventListener('DOMContentLoaded', () => {
  initReadingChart();
  animateCircularProgress();
  startCountdown();
  renderMissions();
  renderSpecialMissions();
  initNotifModal();
});

/* ── Chart ───────────────────────────────────────────────── */
function initReadingChart() {
  // Canvas ID in HTML is "readingChart" — was mistakenly "readingActivityChart" before
  const ctx = document.getElementById('readingChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      datasets: [{
        label: 'Menit Membaca',
        data: [11, 14, 19, 29, 29, 35, 44],
        borderColor: '#3f7cf6',
        backgroundColor: (ctx) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, 220);
          gradient.addColorStop(0, 'rgba(63, 124, 246, 0.25)');
          gradient.addColorStop(1, 'rgba(63, 124, 246, 0)');
          return gradient;
        },
        borderWidth: 2.5,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: '#3f7cf6',
        pointBorderWidth: 2.5,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: '#3f7cf6',
        pointHoverBorderColor: '#fff',
        fill: true,
        tension: 0.35
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#1c3773',
          titleColor: '#fff',
          bodyColor: '#fff',
          padding: { x: 14, y: 10 },
          cornerRadius: 10,
          displayColors: false,
          callbacks: {
            label: (ctx) => `${ctx.parsed.y} Menit`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 60,
          ticks: {
            stepSize: 15,
            color: '#94a3b8',
            font: { size: 10, weight: '600', family: "'Inter', sans-serif" }
          },
          border: { display: false },
          grid: { color: '#edf2ff', drawTicks: false },
          title: {
            display: true,
            text: 'Menit',
            align: 'end',
            color: '#94a3b8',
            font: { size: 10, weight: 'bold', family: "'Inter', sans-serif" }
          }
        },
        x: {
          ticks: {
            color: '#94a3b8',
            font: { size: 10, weight: '600', family: "'Inter', sans-serif" }
          },
          border: { display: false },
          grid: { display: false }
        }
      },
      interaction: { intersect: false, mode: 'index' }
    }
  });
}

/* ── Circular Progress ───────────────────────────────────── */
function animateCircularProgress() {
  const circle = document.querySelector('.progress-value');
  if (!circle) return;
  // radius 40 → circumference = 2π×40 = 251.2; 75% → offset = 251.2 × (1-0.75) = 62.8
  circle.style.strokeDasharray  = '251.2';
  circle.style.strokeDashoffset = '251.2';
  circle.getBoundingClientRect(); // force reflow
  setTimeout(() => { circle.style.strokeDashoffset = '62.8'; }, 200);
}

/* ── Countdown Timer ─────────────────────────────────────── */
function startCountdown() {
  function updateCountdown() {
    const now   = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    let diff = Math.floor((midnight - now) / 1000);

    const h = Math.floor(diff / 3600);
    diff -= h * 3600;
    const m = Math.floor(diff / 60);
    const s = diff - m * 60;

    const pad = (n) => String(n).padStart(2, '0');
    const el = (id) => document.getElementById(id);
    if (el('cdHours'))   el('cdHours').textContent   = pad(h);
    if (el('cdMinutes')) el('cdMinutes').textContent = pad(m);
    if (el('cdSeconds')) el('cdSeconds').textContent = pad(s);
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);
}

/* ── Daily Missions ──────────────────────────────────────── */
const dailyMissions = [
  { name: 'Online selama 15 menit',         exp: 5 },
  { name: 'Baca buku selama 1 jam',          exp: 10 },
  { name: 'Mainkan game dalam mode Hard',    exp: 50 },
  { name: 'Baca buku selama 3 jam',          exp: 50 }
];

const specialMissions = [
  { name: 'Dapatkan 100 poin game vocabulary', exp: 50 },
  { name: 'Selesaikan 3 game tanpa salah',     exp: 100 },
  { name: 'Login 7 hari berturut-turut',       exp: 150 },
  { name: 'Baca 5 buku berbeda',               exp: 200 }
];

function renderMissions() {
  const list = document.getElementById('missionList');
  if (!list) return;
  renderMissionList(list, dailyMissions);
}

function renderSpecialMissions() {
  const list = document.getElementById('specialMissionList');
  if (!list) return;
  renderMissionList(list, specialMissions);
}

function renderMissionList(container, missions) {
  const mascotPath = '../../assets/images/mascot/mascot-home.png';
  if (!missions || missions.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <img src="${mascotPath}" alt="Voxy">
        <p>Belum ada misi tersedia.<br>Coba lagi nanti! 😊</p>
      </div>`;
    return;
  }
  container.innerHTML = missions.map(m => `
    <div class="mission-item">
      <span class="mission-name">${m.name}</span>
      <span class="mission-exp">${m.exp} EXP</span>
    </div>`).join('');
}

/* ── Notification Modal ──────────────────────────────────── */
const dummyNotifications = [
  {
    group: 'Hari ini',
    items: [
      { icon: 'ph-check-circle', iconClass: 'green',  text: 'Budi menyelesaikan Daily Mission.', time: '5 menit lalu' },
      { icon: 'ph-sticker',      iconClass: 'purple', text: 'Tasya memperoleh Sticker Rare.',    time: '1 jam lalu' }
    ]
  },
  {
    group: 'Kemarin',
    items: [
      { icon: 'ph-users',        iconClass: '',       text: '5 siswa berhasil login.', time: 'Kemarin, 08:00' }
    ]
  },
  {
    group: '2 hari lalu',
    items: [
      { icon: 'ph-gift',         iconClass: 'amber',  text: 'Reward baru berhasil ditambahkan.', time: '2 hari lalu' }
    ]
  }
];

function initNotifModal() {
  const modal    = document.getElementById('notifModal');
  const backdrop = document.getElementById('notifBackdrop');
  const closeBtn = document.getElementById('notifClose');
  const openBtn  = document.getElementById('notifBtn');
  const badge    = document.getElementById('notifBadge');
  const list     = document.getElementById('notifList');
  const empty    = document.getElementById('notifEmpty');

  if (!modal || !openBtn) return;

  // Count unread
  let unread = dummyNotifications.reduce((acc, g) => acc + g.items.length, 0);

  // Update badge
  function updateBadge(count) {
    if (!badge) return;
    badge.textContent = count > 9 ? '9+' : count;
    badge.classList.toggle('hidden', count === 0);
  }
  updateBadge(unread);

  // Render notifications
  function renderNotifs() {
    if (!dummyNotifications.length) {
      if (list) list.classList.add('hidden');
      if (empty) empty.classList.remove('hidden');
      return;
    }
    if (empty) empty.classList.add('hidden');
    if (!list) return;
    list.innerHTML = dummyNotifications.map(group => `
      <div class="notif-group__label">${group.group}</div>
      ${group.items.map(item => `
        <div class="notif-item">
          <div class="notif-item__icon ${item.iconClass}">
            <i class="ph-fill ${item.icon}"></i>
          </div>
          <div class="notif-item__body">
            <p class="notif-item__text">${item.text}</p>
            <span class="notif-item__time">${item.time}</span>
          </div>
        </div>
      `).join('')}
    `).join('');
  }

  function openModal() {
    renderNotifs();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    // Mark as read – clear badge
    unread = 0;
    updateBadge(0);
  }

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });
}
