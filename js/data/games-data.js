// js/data/games-data.js
// Mock Data untuk Games Management

const mockGames = [
  {
    id: 'G001',
    title: 'Susun Kalimat',
    desc: 'Susun kata-kata acak menjadi kalimat yang benar dalam Bahasa Inggris.',
    icon: 'ph-puzzle-piece',
    // TODO: Replace Game Cover
    img: '../../assets/images/games/cover/susun-kalimat.webp',
    color: '#3f7cf6',
    bg: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
    status: 'Active',
    totalQuestions: function() {
      return mockQuestions.filter(q => q.gameId === 'G001').length;
    }
  },
  {
    id: 'G002',
    title: 'Dengar & Ucapkan',
    desc: 'Dengarkan audio dan ucapkan kata atau kalimat dengan benar.',
    icon: 'ph-speaker-high',
    // TODO: Replace Game Cover
    img: '../../assets/images/games/cover/dengar-ucapkan.webp',
    color: '#10b981',
    bg: 'linear-gradient(135deg, #d1fae5, #ecfdf5)',
    status: 'Coming Soon',
    totalQuestions: function() { return 0; }
  },
  {
    id: 'G003',
    title: 'Baca Pikir Ucapkan',
    desc: 'Baca gambar, pikirkan kata yang tepat, kemudian ucapkan jawabannya.',
    icon: 'ph-eye',
    // TODO: Replace Game Cover
    img: '../../assets/images/games/cover/baca-pikir-ucapkan.webp',
    color: '#a855f7',
    bg: 'linear-gradient(135deg, #ede9fe, #f5f3ff)',
    status: 'Coming Soon',
    totalQuestions: function() { return 0; }
  }
];

let mockQuestions = [
  // ── EASY ──────────────────────────────────────────────────
  { id: 'Q001', gameId: 'G001', indonesian: 'Ini adalah buku.', english: 'This is a book.', difficulty: 'Easy', words: ['This', 'is', 'a', 'book'] },
  { id: 'Q002', gameId: 'G001', indonesian: 'Aku suka apel.', english: 'I like apples.', difficulty: 'Easy', words: ['I', 'like', 'apples'] },
  { id: 'Q003', gameId: 'G001', indonesian: 'Dia bermain bola.', english: 'He plays ball.', difficulty: 'Easy', words: ['He', 'plays', 'ball'] },

  // ── NORMAL ────────────────────────────────────────────────
  { id: 'Q016', gameId: 'G001', indonesian: 'Dia sedang membaca buku.', english: 'She is reading a book.', difficulty: 'Normal', words: ['She', 'is', 'reading', 'a', 'book'] },
  { id: 'Q017', gameId: 'G001', indonesian: 'Mereka bermain di taman.', english: 'They play in the park.', difficulty: 'Normal', words: ['They', 'play', 'in', 'the', 'park'] },
  { id: 'Q018', gameId: 'G001', indonesian: 'Ibu memasak di dapur.', english: 'Mother cooks in the kitchen.', difficulty: 'Normal', words: ['Mother', 'cooks', 'in', 'the', 'kitchen'] },

  // ── HARD ──────────────────────────────────────────────────
  { id: 'Q031', gameId: 'G001', indonesian: 'Dia selalu belajar dengan sungguh-sungguh setiap hari.', english: 'She always studies seriously every day.', difficulty: 'Hard', words: ['She', 'always', 'studies', 'seriously', 'every', 'day'] },
  { id: 'Q032', gameId: 'G001', indonesian: 'Para siswa sedang mengerjakan tugas kelompok di perpustakaan.', english: 'The students are working on a group assignment in the library.', difficulty: 'Hard', words: ['The', 'students', 'are', 'working', 'on', 'a', 'group', 'assignment', 'in', 'the', 'library'] },
  { id: 'Q033', gameId: 'G001', indonesian: 'Guru menjelaskan materi dengan sangat jelas kepada muridnya.', english: 'The teacher explains the material very clearly to her students.', difficulty: 'Hard', words: ['The', 'teacher', 'explains', 'the', 'material', 'very', 'clearly', 'to', 'her', 'students'] }
];
