const renderCards = async () => {
  const response = await fetch('/cards');
  const data = await response.json();
  
  const mainContent = document.getElementById('main-content');

  if (data && data.length > 0) {
    // Organize cards by arcana type
    const majorCards = data.filter(card => card.arcana === 'Major');
    const minorCards = data.filter(card => card.arcana === 'Minor');

    // Create Major Arcana section
    const majorSection = createCollapsibleSection('Major Arcana', majorCards);
    mainContent.appendChild(majorSection);

    // Create Minor Arcana sections by suit
    const suits = ['Cups', 'Pentacles', 'Swords', 'Wands'];
    suits.forEach(suit => {
      const suitCards = minorCards.filter(card => card.suit === suit);
      const suitSection = createCollapsibleSection(`${suit}`, suitCards);
      mainContent.appendChild(suitSection);
    });
  } else {
    const message = document.createElement('h2');
    message.textContent = 'No Cards Available 😞';
    mainContent.appendChild(message);
  }
};

const createCollapsibleSection = (title, cards) => {
  const sectionContainer = document.createElement('section');
  sectionContainer.className = 'section-container';

  const sectionTitle = document.createElement('button');
  sectionTitle.className = 'accordion-title';
  sectionTitle.textContent = title;

  const cardsGrid = document.createElement('div');
  cardsGrid.className = 'cards-grid';
  cardsGrid.style.display = 'none';

  // Populate cards
  cards.forEach(card => {
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

  // Toggle section on click
  sectionTitle.addEventListener('click', () => {
    const isVisible = cardsGrid.style.display === 'grid';
    cardsGrid.style.display = isVisible ? 'none' : 'grid';
    sectionTitle.classList.toggle('open');
  });

  sectionContainer.appendChild(sectionTitle);
  sectionContainer.appendChild(cardsGrid);

  return sectionContainer;
};

renderCards();