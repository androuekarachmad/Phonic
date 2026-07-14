// js/student/books.js

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('booksGrid');
  if (!grid || typeof bookDatabase === 'undefined') return;

  bookDatabase.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Read ${book.title}`);

    card.innerHTML = `
      <h2 class="book-card__title">${book.title}</h2>
      <div class="book-card__cover-wrapper">
        <img
          class="book-card__cover"
          src="${book.thumbnail}"
          alt="${book.title}"
          onerror="this.style.background='#f19f2a'"
        >
      </div>
      <div class="book-card__dots">
        <span class="book-card__dot book-card__dot--active"></span>
        <span class="book-card__dot"></span>
      </div>
      <p class="book-card__author">${book.author}</p>
    `;

    card.addEventListener('click', () => {
      sessionStorage.setItem('currentBookId', book.id);
      window.location.href = 'reader.html';
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') card.click();
    });

    grid.appendChild(card);
  });
});
