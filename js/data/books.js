// js/data/books.js
// Simplified book metadata — reader generates file paths automatically

const bookDatabase = [
  {
    id: "my-next-words-grade-4",
    title: "My Next Words",
    author: "Lilin Rachmawati, Nur Fitria Anggarisia, dan Lili Nailufary",
    thumbnail: "../../assets/library/books/my-next-words-grade-4/thumbnail/thumbnail.webp",
    basePath: "../../assets/library/books/my-next-words-grade-4/",
    totalPages: 16,
    // Special page features (keyed by page number)
    features: {
      12: {
        type: "song",
        audioUrl: "" // Empty = Coming Soon
      },
      13: {
        type: "vocabulary",
        vocabularies: [
          { word: "reading", pronunciation: "/ˈriː.dɪŋ/", meaning: "membaca" },
          { word: "writing", pronunciation: "/ˈraɪ.tɪŋ/", meaning: "menulis" },
          { word: "discussing", pronunciation: "/dɪˈskʌs.ɪŋ/", meaning: "berdiskusi" }
        ]
      }
    }
  }
];
