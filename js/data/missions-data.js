// js/data/missions-data.js
// Mock Data untuk Mission Management

let mockMissions = [
  // ── DAILY MISSIONS (5) ──────────────────────────────────────
  {
    id: 'M001',
    title: 'Membaca Buku Pemula',
    category: 'Daily',
    desc: 'Selesaikan membaca 1 buku di kategori pemula.',
    target: '1 Buku',
    xpReward: 50,
    stickerReward: 1,
    status: 'Aktif',
    icon: 'ph-book-open'
  },
  {
    id: 'M002',
    title: 'Main Game Susun Kata',
    category: 'Daily',
    desc: 'Mainkan game Susun Kata setidaknya 2 kali.',
    target: '2 Kali Main',
    xpReward: 30,
    stickerReward: 0,
    status: 'Aktif',
    icon: 'ph-puzzle-piece'
  },
  {
    id: 'M003',
    title: 'Dapat Nilai Sempurna',
    category: 'Daily',
    desc: 'Selesaikan 1 game tanpa kesalahan.',
    target: '1 Perfect Game',
    xpReward: 100,
    stickerReward: 2,
    status: 'Aktif',
    icon: 'ph-star'
  },
  {
    id: 'M004',
    title: 'Belajar 15 Menit',
    category: 'Daily',
    desc: 'Gunakan aplikasi selama 15 menit berturut-turut.',
    target: '15 Menit',
    xpReward: 40,
    stickerReward: 1,
    status: 'Nonaktif',
    icon: 'ph-clock'
  },
  {
    id: 'M005',
    title: 'Login Harian',
    category: 'Daily',
    desc: 'Buka aplikasi hari ini.',
    target: '1 Login',
    xpReward: 10,
    stickerReward: 0,
    status: 'Aktif',
    icon: 'ph-calendar-check'
  },

  // ── WEEKLY MISSIONS (3) ─────────────────────────────────────
  {
    id: 'M006',
    title: 'Kolektor Buku',
    category: 'Weekly',
    desc: 'Selesaikan membaca 5 buku dalam minggu ini.',
    target: '5 Buku',
    xpReward: 300,
    stickerReward: 3,
    status: 'Aktif',
    icon: 'ph-books'
  },
  {
    id: 'M007',
    title: 'Master Game',
    category: 'Weekly',
    desc: 'Kumpulkan skor 5000 di semua game.',
    target: '5000 Skor',
    xpReward: 500,
    stickerReward: 5,
    status: 'Aktif',
    icon: 'ph-game-controller'
  },
  {
    id: 'M008',
    title: 'Konsisten Belajar',
    category: 'Weekly',
    desc: 'Selesaikan semua Daily Mission selama 5 hari berturut-turut.',
    target: '5 Hari Streak',
    xpReward: 1000,
    stickerReward: 10,
    status: 'Nonaktif',
    icon: 'ph-fire'
  },

  // ── SPECIAL MISSIONS (3) ────────────────────────────────────
  {
    id: 'M009',
    title: 'Ujian Naik Kelas',
    category: 'Special',
    desc: 'Selesaikan tes evaluasi akhir untuk naik level.',
    target: 'Lulus Tes',
    xpReward: 2000,
    stickerReward: 15,
    status: 'Aktif',
    icon: 'ph-graduation-cap'
  },
  {
    id: 'M010',
    title: 'Event Kemerdekaan',
    category: 'Special',
    desc: 'Baca 3 buku bertema sejarah kemerdekaan Indonesia.',
    target: '3 Buku Sejarah',
    xpReward: 800,
    stickerReward: 8,
    status: 'Aktif',
    icon: 'ph-flag'
  },
  {
    id: 'M011',
    title: 'Pemburu Harta Karun',
    category: 'Special',
    desc: 'Temukan 3 stiker tersembunyi di dalam buku-buku tertentu.',
    target: '3 Stiker Rahasia',
    xpReward: 1500,
    stickerReward: 5,
    status: 'Nonaktif',
    icon: 'ph-treasure-chest'
  }
];
