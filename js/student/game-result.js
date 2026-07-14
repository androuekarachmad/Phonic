// js/student/game-result.js

document.addEventListener('DOMContentLoaded', () => {
  const resultStr  = sessionStorage.getItem('phonic_game_result');
  const isSuccess  = resultStr === 'true';

  const body           = document.getElementById('resultBody');
  const resultIcon     = document.getElementById('resultIcon');
  const resultTitle    = document.getElementById('resultTitle');
  const resultSubtitle = document.getElementById('resultSubtitle');
  const resultPoints   = document.getElementById('resultPoints');
  const nextBtn        = document.getElementById('nextBtn');

  if (isSuccess) {
    body.className          = 'result-success';
    resultIcon.innerHTML    = '<i class="ph-bold ph-check"></i>';
    resultTitle.textContent  = 'Hebat!';
    resultSubtitle.textContent = 'Jawaban kamu benar.';
    resultPoints.textContent = '+100';
  } else {
    body.className          = 'result-error';
    resultIcon.innerHTML    = '<i class="ph-bold ph-x"></i>';
    resultTitle.textContent  = 'Oh tidak!';
    resultSubtitle.textContent = 'Jawaban kamu masih kurang tepat.';
    resultPoints.textContent = '+50';
  }

  nextBtn.addEventListener('click', () => {
    const questionIndex  = parseInt(sessionStorage.getItem('phonic_question_index') || '0', 10);
    const totalQuestions = parseInt(sessionStorage.getItem('phonic_total_questions') || '999', 10);
    const currentGame    = sessionStorage.getItem('phonic_current_game') || 'game-1';

    // Map game to its gameplay page
    const gameRoutes = {
      'game-1': 'game-play.html',
      'game-2': 'baca-pikir-ucapkan.html',
      'game-3': 'dengar-ucapkan.html'
    };
    const gameplayPage = gameRoutes[currentGame] || 'game-play.html';

    const isLastQuestion = (questionIndex + 1 >= totalQuestions);

    if (isLastQuestion) {
      // Show complete modal
      const modal = document.getElementById('gameCompleteModal');
      if (modal) {
        modal.style.display = 'flex';
        // Small delay to allow display:flex to apply before transition
        setTimeout(() => modal.classList.add('show'), 10);
      }

      const playAgainBtn = document.getElementById('playAgainBtn');
      const exitGameBtn  = document.getElementById('exitGameBtn');

      if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
          sessionStorage.setItem('phonic_question_index', 0);
          window.location.href = gameplayPage;
        });
      }
      if (exitGameBtn) {
        exitGameBtn.addEventListener('click', () => {
          sessionStorage.setItem('phonic_question_index', 0);
          window.location.href = 'games.html';
        });
      }
    } else {
      // Increment question index and go back to gameplay
      sessionStorage.setItem('phonic_question_index', questionIndex + 1);
      window.location.href = gameplayPage;
    }
  });
});
