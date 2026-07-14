// js/admin/student-detail.js
// Logika untuk halaman Detail Siswa (Admin)

document.addEventListener('DOMContentLoaded', () => {
  // 1. Dapatkan parameter URL
  const urlParams = new URLSearchParams(window.location.search);
  const studentId = urlParams.get('id');

  const emptyState = document.getElementById('emptyState');
  const dashboardContent = document.getElementById('dashboardContent');

  // 2. Cari data siswa dari mockStudents (yang ada di students-data.js)
  let student = null;
  
  if (studentId) {
    student = mockStudents.find(s => s.id === studentId);
  } else if (mockStudents && mockStudents.length > 0) {
    // Fallback: Jika dibuka tanpa ID tapi ada data dummy, gunakan siswa pertama
    student = mockStudents[0];
  }

  if (!student) {
    showEmptyState();
    return;
  }

  // 3. Render Data Siswa
  renderStudentDetail(student);
});

function showEmptyState() {
  document.getElementById('emptyState').classList.remove('hidden');
  document.getElementById('dashboardContent').classList.add('hidden');
}

function renderStudentDetail(student) {
  document.getElementById('dashboardContent').classList.remove('hidden');

  // --- Profile Header ---
  const avatarEl = document.getElementById('detailAvatar');
  avatarEl.textContent = student.avatar;
  avatarEl.style.background = student.avatarColor;
  
  document.getElementById('detailName').textContent = student.nama;
  document.getElementById('detailNisn').textContent = `NISN: ${student.nisn}`;
  document.getElementById('detailKelas').textContent = `Kelas ${student.kelas}`;
  document.getElementById('detailLevel').innerHTML = `<i class="ph-fill ph-star"></i> Level ${student.level}`;

  // --- Summary Grid ---
  document.getElementById('statBooks').textContent = student.stats.booksRead;
  document.getElementById('statGames').textContent = student.stats.gamesPlayed;
  document.getElementById('statRewards').textContent = student.stats.rewards;
  document.getElementById('statStickers').textContent = student.stats.stickers;

  // --- Progress Bar ---
  document.getElementById('nextLevel').textContent = student.level + 1;
  document.getElementById('xpPct').textContent = `${student.xp}%`;
  
  // Animate progress bar slightly after load
  setTimeout(() => {
    document.getElementById('xpFill').style.width = `${student.xp}%`;
  }, 100);

  // --- Sticker Collection ---
  const stickerContainer = document.getElementById('stickerContainer');
  stickerContainer.innerHTML = '';
  if (student.stickers_collection && student.stickers_collection.length > 0) {
    student.stickers_collection.forEach(sticker => {
      const item = document.createElement('div');
      item.className = 'sticker-item';
      item.innerHTML = `<img src="../../assets/images/mascot/${sticker}" alt="Sticker">`;
      stickerContainer.appendChild(item);
    });
  } else {
    stickerContainer.innerHTML = '<div class="sticker-empty-msg">Belum ada stiker yang dikumpulkan.</div>';
  }

  // --- Activities ---
  // Books
  if (student.activities.book) {
    document.getElementById('lastBook').textContent = student.activities.book.title;
    document.getElementById('bookPages').textContent = student.activities.book.pages;
    document.getElementById('bookTime').textContent = student.activities.book.totalTime;
  }
  // Games
  if (student.activities.game) {
    document.getElementById('lastGame').textContent = student.activities.game.title;
    document.getElementById('gameScore').textContent = student.activities.game.score;
    document.getElementById('gamePlays').textContent = student.activities.game.plays;
  }

  // --- Missions ---
  const missionList = document.getElementById('missionList');
  missionList.innerHTML = '';
  if (student.missions && student.missions.length > 0) {
    student.missions.forEach(mission => {
      missionList.innerHTML += `
        <div class="mission-item">
          <div class="mission-item-header">
            <span class="mission-title">${mission.title}</span>
            <span class="mission-type">${mission.type}</span>
          </div>
          <div class="progress-wrap">
            <div class="progress-bar">
              <div class="progress-fill" style="width: ${mission.progress}%;"></div>
            </div>
          </div>
        </div>
      `;
    });
  } else {
    missionList.innerHTML = '<p class="sticker-empty-msg">Tidak ada misi aktif.</p>';
  }

  // --- Timeline ---
  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = '';
  if (student.timeline && student.timeline.length > 0) {
    student.timeline.forEach(item => {
      timelineList.innerHTML += `
        <div class="timeline-item">
          <div class="timeline-date">${item.date}</div>
          <div class="timeline-action">${item.action}</div>
        </div>
      `;
    });
  } else {
    timelineList.innerHTML = '<p class="sticker-empty-msg" style="margin-left: -16px;">Belum ada aktivitas tercatat.</p>';
  }
}
