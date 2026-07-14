// js/data/games.js

const gamesData = [
  {
    id: "game-1",
    title: "Susun Kalimat",
    subtitle: "Jadi Sempurna!",
    description: "Cocokkan bagian kalimat menjadi kalimat yang tepat!",
    image: "../../assets/images/games/susun_kalimat_game.png",
    modes: ["easy", "normal", "hard"],
    status: "active"
  },
  {
    id: "game-2",
    title: "Baca, Pikir, Ucapkan!",
    subtitle: "Fill the blanks!",
    description: "Lengkapi kalimatnya dengan kata yang tepat!",
    image: "../../assets/images/games/baca_pikir_ucapkan_game.png",
    modes: ["easy", "normal", "hard"],
    status: "active"
  },
  {
    id: "game-3",
    title: "Dengar & Ucapkan!",
    subtitle: "Listen and speak!",
    description: "Dengarkan kata, lalu ucapkan dengan benar!",
    image: "../../assets/images/games/dengar_dan_ucapkan_game.png",
    modes: ["easy", "normal", "hard"],
    status: "active"
  }
];

const susunKalimatQuestions = [
  // EASY: Simple Subject + Verb + Object
  {
    id: "q-e1",
    difficulty: "easy",
    indonesian: "Voxy sedang belajar bahasa Inggris",
    english: ["Voxy", "is", "learning", "English"],
    distractors: ["cooking", "a", "the"],
    image: "../../assets/images/games/voxy_sedang_belajar_bahasa_inggris.svg"
  },
  {
    id: "q-e2",
    difficulty: "easy",
    indonesian: "Voxy sedang bermain bola",
    english: ["Voxy", "is", "playing", "football"],
    distractors: ["play", "They", "ball"],
    image: "../../assets/images/games/voxy_sedang_bermain_bola.svg"
  },
  // NORMAL: Subject + Verb + Object + Adverb/Adjective
  {
    id: "q-n1",
    difficulty: "normal",
    indonesian: "Voxy sedang membaca buku yang menarik",
    english: ["Voxy", "is", "reading", "an", "interesting", "book"],
    distractors: ["reads", "a", "the", "bored"],
    image: "../../assets/images/games/voxy_sedang_belajar_bahasa_inggris.svg"
  },
  {
    id: "q-n2",
    difficulty: "normal",
    indonesian: "Kucing itu tidur di sofa",
    english: ["The", "cat", "sleeps", "on", "the", "sofa"],
    distractors: ["a", "in", "sleep", "dog"],
    image: "../../assets/images/games/voxy_sedang_bermain_bola.svg"
  },
  // HARD: Subject + Verb + Object + Place + Time
  {
    id: "q-h1",
    difficulty: "hard",
    indonesian: "Voxy pergi ke perpustakaan setiap hari Sabtu",
    english: ["Voxy", "goes", "to", "the", "library", "every", "Saturday"],
    distractors: ["go", "in", "a", "Sunday", "school"],
    image: "../../assets/images/games/voxy_sedang_belajar_bahasa_inggris.svg"
  },
  {
    id: "q-h2",
    difficulty: "hard",
    indonesian: "Kami memiliki waktu yang hebat di pantai liburan lalu",
    english: ["We", "had", "a", "great", "time", "at", "the", "beach", "last", "holiday"],
    distractors: ["have", "an", "in", "next", "summer"],
    image: "../../assets/images/games/voxy_sedang_bermain_bola.svg"
  }
];

// If using ES modules or just global variables. Since the project uses global scope for simplicity without build tools:
window.GAMES_DATA = gamesData;
window.SUSUN_KALIMAT_QUESTIONS = susunKalimatQuestions;
