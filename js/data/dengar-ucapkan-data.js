// js/data/dengar-ucapkan-data.js
// Data soal untuk game "Dengar & Ucapkan!"
// Format: user melihat gambar situasi, lalu memilih kata yang tepat untuk melengkapi kalimat

const dengarUcapkanQuestions = [
  // EASY: Kalimat sederhana, pilihan ganda 4 opsi
  {
    id: "du-e1",
    difficulty: "easy",
    instruction: "Listen carefully and use the missing verb to complete the sentence.",
    image: "../../assets/images/games/voxy_study_at night.svg",
    sentence: "Voxy _____ English.",
    answer: "studies",
    choices: ["studies", "plays", "eats", "sleeps"]
  },
  {
    id: "du-e2",
    difficulty: "easy",
    instruction: "Listen carefully and use the missing verb to complete the sentence.",
    image: "../../assets/images/games/voxy_study_at night.svg",
    sentence: "Voxy _____ football.",
    answer: "plays",
    choices: ["reads", "plays", "cooks", "runs"]
  },
  // NORMAL
  {
    id: "du-n1",
    difficulty: "normal",
    instruction: "Listen carefully and use the missing verb to complete the sentence.",
    image: "../../assets/images/games/voxy_study_at night.svg",
    sentence: "Voxy _____ at night.",
    answer: "Study",
    choices: ["Study", "Sleep", "Eat", "Run"]
  },
  {
    id: "du-n2",
    difficulty: "normal",
    instruction: "Listen carefully and use the missing verb to complete the sentence.",
    image: "../../assets/images/games/voxy_study_at night.svg",
    sentence: "Voxy and friends _____ in the park.",
    answer: "play",
    choices: ["play", "swims", "study", "cook"]
  },
  // HARD
  {
    id: "du-h1",
    difficulty: "hard",
    instruction: "What is the correct verb for this sentence?",
    image: "../../assets/images/games/voxy_study_at night.svg",
    sentence: "Voxy has been _____ English for two years.",
    answer: "learning",
    choices: ["learning", "learns", "learned", "to learn"]
  },
  {
    id: "du-h2",
    difficulty: "hard",
    instruction: "What is the correct verb for this sentence?",
    image: "../../assets/images/games/voxy_study_at night.svg",
    sentence: "Voxy _____ football every Saturday morning.",
    answer: "plays",
    choices: ["play", "played", "plays", "is play"]
  }
];

window.DENGAR_UCAPKAN_QUESTIONS = dengarUcapkanQuestions;
