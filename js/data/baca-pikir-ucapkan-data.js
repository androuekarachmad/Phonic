// js/data/baca-pikir-ucapkan-data.js
// Data soal untuk game "Baca, Pikir, Ucapkan!"
// Format: user melihat gambar, lalu mengisi huruf yang hilang dari sebuah kata bahasa Inggris

const bacaPikirUcapkanQuestions = [
  // EASY: Kata pendek (3-5 huruf), 1-2 blanks
  {
    id: "bpu-e1",
    difficulty: "easy",
    instruction: "Look at the picture below and say its place!",
    image: "../../assets/images/games/kitchen.svg",
    word: "BOOK",
    blanks: [true, false, false, false], // B___ -> user fills B, O, O, K visible
    answer: "BOOK",
    hint: "Voxy is reading a ___."
  },
  {
    id: "bpu-e2",
    difficulty: "easy",
    instruction: "Look at the picture below and say its place!",
    image: "../../assets/images/games/kitchen.svg",
    word: "BALL",
    blanks: [false, true, true, false],
    answer: "BALL",
    hint: "Voxy is playing with a ___."
  },
  // NORMAL: Kata sedang (5-6 huruf), 2-3 blanks
  {
    id: "bpu-n1",
    difficulty: "normal",
    instruction: "Look at the picture below and say its place!",
    image: "../../assets/images/games/kitchen.svg",
    word: "KITCHEN",
    blanks: [false, true, true, false, false, true, false],
    answer: "KITCHEN",
    hint: "Voxy is cooking in the ___."
  },
  {
    id: "bpu-n2",
    difficulty: "normal",
    instruction: "Look at the picture below and say its place!",
    image: "../../assets/images/games/kitchen.svg",
    word: "SPORT",
    blanks: [false, true, false, true, false],
    answer: "SPORT",
    hint: "Football is a popular ___."
  },
  // HARD: Kata panjang (6+ huruf), 3+ blanks
  {
    id: "bpu-h1",
    difficulty: "hard",
    instruction: "Look at the picture below and say its place!",
    image: "../../assets/images/games/kitchen.svg",
    word: "ENGLISH",
    blanks: [false, true, false, true, false, true, false],
    answer: "ENGLISH",
    hint: "Voxy is learning ___."
  },
  {
    id: "bpu-h2",
    difficulty: "hard",
    instruction: "Look at the picture below and say its place!",
    image: "../../assets/images/games/kitchen.svg",
    word: "FOOTBALL",
    blanks: [false, true, false, false, true, false, true, false],
    answer: "FOOTBALL",
    hint: "Voxy's favorite sport is ___."
  }
];

window.BACA_PIKIR_UCAPKAN_QUESTIONS = bacaPikirUcapkanQuestions;
