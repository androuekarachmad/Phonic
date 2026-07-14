/* =============================================
   Level Page — JavaScript
   Handles:
   - EXP progress bar animation
   - Quest card rendering (Daily + Special)
   ============================================= */

document.addEventListener("DOMContentLoaded", () => {
  initExpProgress();
  renderQuests();
});

/* ---------- EXP Progress ---------- */

/**
 * Animates the EXP progress bar on page load.
 * Change `currentExp` and `maxExp` to reflect real data.
 */
function initExpProgress() {
  const currentExp = 65;
  const maxExp     = 100;

  const fill = document.getElementById("expProgressFill");
  const text = document.getElementById("expProgressText");

  if (!fill || !text) return;

  const percentage = Math.min((currentExp / maxExp) * 100, 100);

  // Delay to trigger CSS transition animation
  setTimeout(() => {
    fill.style.width = `${percentage}%`;
    text.textContent = `${currentExp} EXP`;
  }, 300);
}

/* ---------- Quest Data ---------- */

/** Daily quest data */
const DAILY_QUESTS = [
  { name: "Online 15 minutes",           exp: 5  },
  { name: "Reading any book 1 hours",    exp: 10 },
  { name: "Play any hard games once",    exp: 50 },
];

/** Special quest data */
const SPECIAL_QUESTS = [
  { name: "Get 100 points on vocabulary games", exp: 100 },
];

/* ---------- Quest Rendering ---------- */

/**
 * Creates a single quest card DOM element.
 * @param {Object} quest – { name: string, exp: number }
 * @returns {HTMLElement}
 */
function createQuestCard(quest) {
  const card = document.createElement("div");
  card.className = "quest-card";

  card.innerHTML = `
    <span class="quest-card__name">${quest.name}</span>
    <div class="quest-card__right">
      <span class="quest-card__exp">${quest.exp} EXP</span>
      <!-- Replace icon-arrow-right.svg placeholder -->
      <img class="quest-card__arrow" src="../../assets/images/icons/icon-arrow-right.svg" alt="Arrow">
    </div>
  `;

  return card;
}

/**
 * Renders quest cards into their respective containers.
 */
function renderQuests() {
  const dailyList   = document.getElementById("dailyQuestList");
  const specialList = document.getElementById("specialQuestList");

  if (dailyList) {
    DAILY_QUESTS.forEach(q => dailyList.appendChild(createQuestCard(q)));
  }

  if (specialList) {
    SPECIAL_QUESTS.forEach(q => specialList.appendChild(createQuestCard(q)));
  }
}
