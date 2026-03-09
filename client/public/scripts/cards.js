const DEFAULT_CARDS_URL = '/cards/data';

const renderCards = async (fetchUrl = DEFAULT_CARDS_URL, options = {}) => {
  const { showResultsHeader = fetchUrl !== DEFAULT_CARDS_URL } = options;
  const mainContent = document.getElementById('main-content');
  mainContent.innerHTML = '';

  try {
    const response = await fetch(fetchUrl);

    // Redirect to 404 page if search returns no results
    if (response.status === 404) {
      console.log('Search returned 404, redirecting to 404 page');
      window.location.replace('/404.html');
      return;
    }

    if (!response.ok) {
      throw new Error(`Failed to load cards (${response.status})`);
    }

    const data = await response.json();

    if (!data || data.length === 0) {
      const message = document.createElement('h2');
      message.textContent = 'No Cards Available 😞';
      mainContent.appendChild(message);
      return;
    }

    // Show header for search results
    if (showResultsHeader) {
      const resultsHeader = document.createElement('h2');
      resultsHeader.textContent = `Results (${data.length})`;
      resultsHeader.style.marginBottom = '2rem';
      mainContent.appendChild(resultsHeader);
    }

    // Create giant grid with all cards
    const cardsGrid = document.createElement('div');
    cardsGrid.className = 'cards-grid';

    data.forEach(card => {
      const cardEl = document.createElement('article');
      cardEl.classList.add('card');

      const cardInner = document.createElement('div');
      cardInner.classList.add('card-inner');

      const cardFront = document.createElement('div');
      cardFront.classList.add('card-front');
      cardFront.style.backgroundImage = `url(${card.image})`;

      const cardBack = document.createElement('div');
      cardBack.classList.add('card-back');

      const name = document.createElement('h3');
      name.textContent = card.name;
      name.style.color = 'var(--primary)';

      const arcana = document.createElement('p');
      if (card.suit) {
        arcana.textContent = `${card.arcana} Arcana · ${card.suit}`;
      } else {
        arcana.textContent = `${card.arcana} Arcana`;
      }

      const link = document.createElement('a');
      link.textContent = 'Read More >';
      link.setAttribute('role', 'button');
      link.href = `/cards/${card.slug}`;

      cardBack.appendChild(name);
      cardBack.appendChild(arcana);
      cardBack.appendChild(link);

      cardInner.appendChild(cardFront);
      cardInner.appendChild(cardBack);

      cardEl.appendChild(cardInner);
      cardsGrid.appendChild(cardEl);
    });

    mainContent.appendChild(cardsGrid);
  } catch (error) {
    const message = document.createElement('h2');
    message.textContent = 'Unable to load cards right now.';
    mainContent.appendChild(message);
    console.error(error);
  }
};

renderCards();

document.getElementById('search-form').addEventListener('submit', (e) => {
  e.preventDefault();

  const attr = document.getElementById('search-attr').value;
  const q = document.getElementById('search-query').value.trim();

  if (!q) {
    renderCards();
    return;
  }

  const params = new URLSearchParams({ attr, q });
  renderCards(`/cards/data/search?${params.toString()}`);
});

document.getElementById('reset-btn').addEventListener('click', () => {
  document.getElementById('search-query').value = '';
  document.getElementById('search-attr').value = 'suit_or_arcana';
  renderCards();
});