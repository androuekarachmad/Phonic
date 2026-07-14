// js/data/students-data.js
// Mock Data untuk Siswa

const mockStudents = [
  {
    id: 'S001',
    nama: 'Budi Santoso',
    nisn: '0012345678',
    kelas: 1,
    level: 1,
    xp: 45,
    sticker: 12,
    avatar: 'B',
    avatarColor: 'var(--color-primary)',
    stats: {
      booksRead: 15,
      gamesPlayed: 38,
      rewards: 8,
      stickers: 12
    },
    activities: {
      book: { title: 'Petualangan Voxy', pages: 12, totalTime: '1h 20m' },
      game: { title: 'Susun Kalimat', score: 1250, plays: 5 }
    },
    missions: [
      { id: 1, title: 'Selesaikan 2 game Phonic', progress: 50, type: 'daily' },
      { id: 2, title: 'Baca buku 10 menit', progress: 100, type: 'daily' }
    ],
    timeline: [
      { date: 'Hari ini', action: 'Menyelesaikan Buku "Petualangan Voxy"', type: 'book' },
      { date: 'Kemarin', action: 'Mendapat Reward: Badge Emas', type: 'reward' },
      { date: '3 Hari lalu', action: 'Naik Level ke Level 2', type: 'level' }
    ],
    stickers_collection: ['mascot-home.png', 'mascot-home.png', 'mascot-home.png', 'mascot-home.png']
  },
  {
    id: 'S002',
    nama: 'Siti Aminah',
    nisn: '0023456789',
    kelas: 2,
    level: 3,
    xp: 80,
    sticker: 24,
    avatar: 'S',
    avatarColor: '#10b981',
    stats: { booksRead: 45, gamesPlayed: 110, rewards: 22, stickers: 24 },
    activities: {
      book: { title: 'Bawang Merah Bawang Putih', pages: 30, totalTime: '3h 15m' },
      game: { title: 'Tebak Kata', score: 3400, plays: 15 }
    },
    missions: [],
    timeline: [
      { date: 'Hari ini', action: 'Selesai Misi Mingguan', type: 'mission' },
      { date: '2 Hari lalu', action: 'Menyelesaikan Game "Tebak Kata"', type: 'game' }
    ],
    stickers_collection: ['mascot-home.png', 'mascot-home.png']
  },
  {
    id: 'S003',
    nama: 'Ahmad Fauzi',
    nisn: '0034567890',
    kelas: 1,
    level: 2,
    xp: 60,
    sticker: 18,
    avatar: 'A',
    avatarColor: '#f59e0b',
    stats: { booksRead: 20, gamesPlayed: 45, rewards: 10, stickers: 18 },
    activities: {
      book: { title: 'Belajar Alfabet', pages: 10, totalTime: '45m' },
      game: { title: 'Mencari Huruf', score: 980, plays: 8 }
    },
    missions: [],
    timeline: [{ date: 'Kemarin', action: 'Membaca Buku "Belajar Alfabet"', type: 'book' }],
    stickers_collection: ['mascot-home.png']
  },
  {
    id: 'S004',
    nama: 'Nisa Rahma',
    nisn: '0045678901',
    kelas: 3,
    level: 5,
    xp: 90,
    sticker: 35,
    avatar: 'N',
    avatarColor: '#8b5cf6',
    stats: { booksRead: 60, gamesPlayed: 200, rewards: 40, stickers: 35 },
    activities: {
      book: { title: 'Sains Anak', pages: 45, totalTime: '5h 30m' },
      game: { title: 'Dengar dan Ucapkan', score: 5600, plays: 25 }
    },
    missions: [],
    timeline: [],
    stickers_collection: []
  },
  {
    id: 'S005',
    nama: 'Kevin Pratama',
    nisn: '0056789012',
    kelas: 2,
    level: 2,
    xp: 55,
    sticker: 15,
    avatar: 'K',
    avatarColor: '#ec4899',
    stats: { booksRead: 10, gamesPlayed: 30, rewards: 5, stickers: 15 },
    activities: { book: { title: 'Kosakata Dasar', pages: 15, totalTime: '1h 10m' }, game: { title: 'Susun Kalimat', score: 800, plays: 4 } },
    missions: [], timeline: [], stickers_collection: []
  },
  {
    id: 'S006',
    nama: 'Rina Wijaya',
    nisn: '0067890123',
    kelas: 4,
    level: 4,
    xp: 70,
    sticker: 28,
    avatar: 'R',
    avatarColor: '#14b8a6',
    stats: { booksRead: 35, gamesPlayed: 80, rewards: 18, stickers: 28 },
    activities: { book: { title: 'Cerita Nusantara', pages: 25, totalTime: '2h 45m' }, game: { title: 'Baca Pikir Ucapkan', score: 2100, plays: 12 } },
    missions: [], timeline: [], stickers_collection: []
  },
  {
    id: 'S007',
    nama: 'Dion Saputra',
    nisn: '0078901234',
    kelas: 3,
    level: 3,
    xp: 65,
    sticker: 22,
    avatar: 'D',
    avatarColor: '#0ea5e9',
    stats: { booksRead: 25, gamesPlayed: 60, rewards: 12, stickers: 22 },
    activities: { book: { title: 'Matematika Seru', pages: 20, totalTime: '2h 00m' }, game: { title: 'Tebak Gambar', score: 1500, plays: 9 } },
    missions: [], timeline: [], stickers_collection: []
  },
  {
    id: 'S008',
    nama: 'Fara Nabila',
    nisn: '0089012345',
    kelas: 1,
    level: 1,
    xp: 30,
    sticker: 8,
    avatar: 'F',
    avatarColor: '#f43f5e',
    stats: { booksRead: 5, gamesPlayed: 15, rewards: 2, stickers: 8 },
    activities: { book: { title: 'Kenal Hewan', pages: 8, totalTime: '30m' }, game: { title: 'Suara Hewan', score: 500, plays: 3 } },
    missions: [], timeline: [], stickers_collection: []
  },
  {
    id: 'S009',
    nama: 'Gilang Ramadhan',
    nisn: '0090123456',
    kelas: 5,
    level: 6,
    xp: 85,
    sticker: 40,
    avatar: 'G',
    avatarColor: '#d946ef',
    stats: { booksRead: 80, gamesPlayed: 250, rewards: 50, stickers: 40 },
    activities: { book: { title: 'Sejarah Indonesia', pages: 60, totalTime: '8h 20m' }, game: { title: 'Quiz Sejarah', score: 8500, plays: 30 } },
    missions: [], timeline: [], stickers_collection: []
  },
  {
    id: 'S010',
    nama: 'Hana Safitri',
    nisn: '0101234567',
    kelas: 4,
    level: 5,
    xp: 78,
    sticker: 32,
    avatar: 'H',
    avatarColor: '#84cc16',
    stats: { booksRead: 50, gamesPlayed: 150, rewards: 30, stickers: 32 },
    activities: { book: { title: 'Dongeng Mancanegara', pages: 40, totalTime: '4h 50m' }, game: { title: 'Menyusun Cerita', score: 4200, plays: 18 } },
    missions: [], timeline: [], stickers_collection: []
  },
  {
    id: 'S011',
    nama: 'Iqbal Hakim',
    nisn: '0112345678',
    kelas: 6,
    level: 7,
    xp: 95,
    sticker: 50,
    avatar: 'I',
    avatarColor: '#f97316',
    stats: { booksRead: 100, gamesPlayed: 350, rewards: 75, stickers: 50 },
    activities: { book: { title: 'Astronomi Ruang Angkasa', pages: 85, totalTime: '12h 10m' }, game: { title: 'Eksplorasi Antariksa', score: 12500, plays: 45 } },
    missions: [], timeline: [], stickers_collection: []
  },
  {
    id: 'S012',
    nama: 'Maya Puspita',
    nisn: '0123456789',
    kelas: 2,
    level: 2,
    xp: 40,
    sticker: 10,
    avatar: 'M',
    avatarColor: '#6366f1',
    stats: { booksRead: 12, gamesPlayed: 25, rewards: 4, stickers: 10 },
    activities: { book: { title: 'Belajar Warna', pages: 10, totalTime: '50m' }, game: { title: 'Warna Warni', score: 700, plays: 5 } },
    missions: [], timeline: [], stickers_collection: []
  }
];
