const formatLabel = (value) => {
  if (!value) {
    return '';
  }

  return String(value)
    .replaceAll('_', ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const normalizeSlug = () => {
  const parts = window.location.pathname.split('/').filter(Boolean);
  return parts[parts.length - 1] || '';
};

const SECTION_IDS = {
  image: 'section-image',
  quickFacts: 'section-quick-facts',
  description: 'section-description',
  keywords: 'section-keywords',
  meanings: 'section-meanings',
  visualSymbols: 'section-visual-symbols',
  reading: 'section-reading',
  spirituality: 'section-spirituality',
  numerology: 'section-numerology',
  symbolism: 'section-symbolism',
  guidance: 'section-guidance',
  affirmation: 'section-affirmation',
  correspondences: 'section-correspondences',
  related: 'section-related',
  original: 'section-original',
  additional: 'section-additional'
};

const getSection = (sectionId) => document.getElementById(sectionId);

const getSectionBody = (sectionId) => {
  const section = getSection(sectionId);
  return section ? section.querySelector('.section-body') : null;
};

const getSafeSectionBody = (sectionId) => {
  const body = getSectionBody(sectionId);
  if (!body) {
    hideSection(sectionId);
    return null;
  }

  return body;
};

const showSection = (sectionId) => {
  const section = getSection(sectionId);
  if (section) {
    section.hidden = false;
  }
};

const hideSection = (sectionId) => {
  const section = getSection(sectionId);
  if (section) {
    section.hidden = true;
  }
};

const clearSectionBody = (sectionId) => {
  const body = getSectionBody(sectionId);
  if (body) {
    body.innerHTML = '';
  }
};

const resetDynamicSections = () => {
  const sections = document.querySelectorAll('[data-dynamic-section]');
  sections.forEach((section) => {
    section.hidden = true;

    if (section.id === SECTION_IDS.image) {
      return;
    }

    const body = section.querySelector('.section-body');
    if (body) {
      body.innerHTML = '';
    }
  });
};

const createTagRow = (items, tagClass = 'tag') => {
  const row = document.createElement('div');
  row.className = 'tag-row';

  (items || []).forEach((item) => {
    const tag = document.createElement('span');
    tag.className = `tag ${tagClass}`;
    tag.textContent = formatLabel(item);
    row.appendChild(tag);
  });

  return row;
};

const addText = (container, text, className = 'meta-text') => {
  if (!container || !text) {
    return;
  }

  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  container.appendChild(p);
};

const renderHero = (card) => {
  document.getElementById('card-name').textContent = card.name;
  document.getElementById('card-number').textContent = Number.isFinite(card.number) ? card.number : '-';

  const heroMeta = document.getElementById('card-meta');
  const parts = Array.isArray(card.keywords) ? card.keywords : [];

  heroMeta.innerHTML = '';
  parts.forEach((part, index) => {
    const span = document.createElement('span');
    span.textContent = formatLabel(part);
    heroMeta.appendChild(span);

    if (index < parts.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'sep';
      separator.textContent = '✦';
      heroMeta.appendChild(separator);
    }
  });
};

const createOrientationToggle = () => {
  const updateOrientationA11y = (button, isReversed) => {
    button.setAttribute('aria-pressed', String(isReversed));
    button.setAttribute('aria-label', isReversed ? 'Switch to upright card view' : 'Switch to reversed card view');
    button.title = isReversed ? 'Switch to upright view' : 'Switch to reversed view';
  };

  const cardFrame = document.querySelector('.card-frame');
  if (!cardFrame) {
    return;
  }

  const existingButton = document.getElementById('orientation-toggle');
  if (existingButton) {
    existingButton.remove();
  }

  const toggleButton = document.createElement('button');
  toggleButton.type = 'button';
  toggleButton.className = 'orientation-overlay-btn';
  toggleButton.id = 'orientation-toggle';
  updateOrientationA11y(toggleButton, false);

  const toggleIcon = document.createElement('img');
  toggleIcon.src = '/images/exchange.png';
  toggleIcon.alt = '';
  toggleIcon.setAttribute('aria-hidden', 'true');

  toggleButton.appendChild(toggleIcon);

  toggleButton.addEventListener('click', () => {
    const isReversed = toggleButton.classList.toggle('reversed');
    const cardImage = document.getElementById('card-image');
    updateOrientationA11y(toggleButton, isReversed);

    cardImage.classList.toggle('reversed', isReversed);

    const uprightContainers = document.querySelectorAll('.meanings-container[data-orientation="upright"]');
    const reversedContainers = document.querySelectorAll('.meanings-container[data-orientation="reversed"]');

    uprightContainers.forEach((container) => {
      container.classList.toggle('active', !isReversed);
    });

    reversedContainers.forEach((container) => {
      container.classList.toggle('active', isReversed);
    });
  });

  cardFrame.appendChild(toggleButton);
};

const renderImageAndFacts = (card) => {
  const image = document.getElementById('card-image');
  image.src = card.image || card.image_url || '';
  image.alt = card.name || 'Tarot Card';

  clearSectionBody(SECTION_IDS.quickFacts);
  const quickFacts = document.getElementById('quick-facts');

  const facts = [
    ['Arcana', card.arcana ? `${card.arcana} Arcana` : '-'],
    ['Suit', card.suit || '-'],
    ['Element', card.element || '-'],
    ['Astrology', card.astrology || '-'],
    ['Yes / No', card.yes_maybe_no || '-'],
    ['Number', Number.isFinite(card.number) ? card.number : '-']
  ];

  facts.forEach(([label, value]) => {
    const fact = document.createElement('div');
    fact.className = 'quick-fact';

    const labelNode = document.createElement('div');
    labelNode.className = 'quick-fact-label';
    labelNode.textContent = label;

    const valueNode = document.createElement('div');
    valueNode.className = 'quick-fact-value';
    valueNode.textContent = value;

    fact.appendChild(labelNode);
    fact.appendChild(valueNode);
    quickFacts.appendChild(fact);
  });

  showSection(SECTION_IDS.image);
  showSection(SECTION_IDS.quickFacts);
};

const renderDescription = (card) => {
  if (!card.description) {
    hideSection(SECTION_IDS.description);
    return;
  }

  const body = getSectionBody(SECTION_IDS.description);
  addText(body, card.description, 'description-text');
  showSection(SECTION_IDS.description);
};

const renderKeywords = (card) => {
  const hasKeywords = Array.isArray(card.keywords) && card.keywords.length > 0;
  if (!hasKeywords) {
    hideSection(SECTION_IDS.keywords);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.keywords);
  if (!body) {
    return;
  }

  body.appendChild(createTagRow(card.keywords));
  showSection(SECTION_IDS.keywords);
};

const renderMeanings = (card) => {
  const hasUpright = Array.isArray(card.meanings_upright) && card.meanings_upright.length > 0;
  const hasReversed = Array.isArray(card.meanings_reversed) && card.meanings_reversed.length > 0;

  if (!hasUpright && !hasReversed) {
    hideSection(SECTION_IDS.meanings);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.meanings);
  if (!body) {
    return;
  }

  if (hasUpright) {
    const uprightContainer = document.createElement('div');
    uprightContainer.className = 'meanings-container active';
    uprightContainer.dataset.orientation = 'upright';

    const tagRow = createTagRow(card.meanings_upright, 'tag-upright');
    uprightContainer.appendChild(tagRow);
    body.appendChild(uprightContainer);
  }

  if (hasReversed) {
    const reversedContainer = document.createElement('div');
    reversedContainer.className = 'meanings-container';
    reversedContainer.dataset.orientation = 'reversed';

    reversedContainer.appendChild(createTagRow(card.meanings_reversed, 'tag-reversed'));
    body.appendChild(reversedContainer);
  }

  showSection(SECTION_IDS.meanings);
};

const renderVisualSymbols = (card) => {
  if (!card.visual_symbols || typeof card.visual_symbols !== 'object') {
    hideSection(SECTION_IDS.visualSymbols);
    return;
  }

  const entries = Object.entries(card.visual_symbols);
  if (entries.length === 0) {
    hideSection(SECTION_IDS.visualSymbols);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.visualSymbols);
  if (!body) {
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'symbol-grid';

  entries.forEach(([name, meaning]) => {
    const symbolCard = document.createElement('div');
    symbolCard.className = 'symbol-card';

    const nameEl = document.createElement('div');
    nameEl.className = 'symbol-card-name';
    nameEl.textContent = formatLabel(name);

    const descEl = document.createElement('div');
    descEl.className = 'symbol-card-desc';
    descEl.textContent = meaning;

    symbolCard.appendChild(nameEl);
    symbolCard.appendChild(descEl);
    grid.appendChild(symbolCard);
  });

  body.appendChild(grid);
  showSection(SECTION_IDS.visualSymbols);
};

const renderReadingSection = (card) => {
  const topics = [
    { title: 'Love & Relationships', icon: '💕', upright: card.love_upright, reversed: card.love_reversed },
    { title: 'Career & Work', icon: '💼', upright: card.career_upright, reversed: card.career_reversed },
    { title: 'Finances', icon: '💰', upright: card.finances_upright, reversed: card.finances_reversed },
    { title: 'Health & Wellness', icon: '🌿', upright: card.health_upright, reversed: card.health_reversed }
  ].filter((topic) => topic.upright || topic.reversed);

  if (topics.length === 0) {
    hideSection(SECTION_IDS.reading);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.reading);
  if (!body) {
    return;
  }

  const uprightGrid = document.createElement('div');
  uprightGrid.className = 'reading-grid meanings-container active';
  uprightGrid.dataset.orientation = 'upright';

  topics.forEach((topic) => {
    if (topic.upright) {
      const cardNode = document.createElement('div');
      cardNode.className = 'reading-card';

      const titleEl = document.createElement('div');
      titleEl.className = 'reading-card-title';
      titleEl.textContent = topic.icon + ' ' + topic.title;
      cardNode.appendChild(titleEl);

      const uprightText = document.createElement('p');
      uprightText.textContent = topic.upright;
      cardNode.appendChild(uprightText);

      uprightGrid.appendChild(cardNode);
    }
  });

  const reversedGrid = document.createElement('div');
  reversedGrid.className = 'reading-grid meanings-container';
  reversedGrid.dataset.orientation = 'reversed';

  topics.forEach((topic) => {
    if (topic.reversed) {
      const cardNode = document.createElement('div');
      cardNode.className = 'reading-card';

      const titleEl = document.createElement('div');
      titleEl.className = 'reading-card-title';
      titleEl.textContent = topic.icon + ' ' + topic.title;
      cardNode.appendChild(titleEl);

      const reversedText = document.createElement('p');
      reversedText.textContent = topic.reversed;
      cardNode.appendChild(reversedText);

      reversedGrid.appendChild(cardNode);
    }
  });

  body.appendChild(uprightGrid);
  body.appendChild(reversedGrid);
  showSection(SECTION_IDS.reading);
};

const renderSimpleTextSections = (card) => {
  if (card.spirituality) {
    const body = getSectionBody(SECTION_IDS.spirituality);
    addText(body, card.spirituality);
    showSection(SECTION_IDS.spirituality);
  }

  if (card.numerology) {
    const body = getSectionBody(SECTION_IDS.numerology);
    addText(body, card.numerology);
    showSection(SECTION_IDS.numerology);
  }

  if (Array.isArray(card.symbolism) && card.symbolism.length > 0) {
    const body = getSafeSectionBody(SECTION_IDS.symbolism);
    if (!body) {
      return;
    }

    body.appendChild(createTagRow(card.symbolism));
    showSection(SECTION_IDS.symbolism);
  }
};

const renderGuidance = (card) => {
  if (!card.advice && !card.warning) {
    hideSection(SECTION_IDS.guidance);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.guidance);
  if (!body) {
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'guidance-grid';

  if (card.advice) {
    const adviceCard = document.createElement('div');
    adviceCard.className = 'guidance-card guidance-advice';

    const title = document.createElement('div');
    title.className = 'guidance-card-title';
    title.textContent = '✦ Advice';
    adviceCard.appendChild(title);

    const text = document.createElement('p');
    text.textContent = card.advice;
    adviceCard.appendChild(text);

    grid.appendChild(adviceCard);
  }

  if (card.warning) {
    const warningCard = document.createElement('div');
    warningCard.className = 'guidance-card guidance-warning';

    const title = document.createElement('div');
    title.className = 'guidance-card-title';
    title.textContent = '⚠ Warning';
    warningCard.appendChild(title);

    const text = document.createElement('p');
    text.textContent = card.warning;
    warningCard.appendChild(text);

    grid.appendChild(warningCard);
  }

  body.appendChild(grid);
  showSection(SECTION_IDS.guidance);
};

const renderAffirmation = (card) => {
  if (!card.affirmation) {
    hideSection(SECTION_IDS.affirmation);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.affirmation);
  if (!body) {
    return;
  }

  const text = document.createElement('p');
  text.className = 'affirmation-text';
  text.textContent = `"${card.affirmation}"`;
  body.appendChild(text);
  showSection(SECTION_IDS.affirmation);
};

const renderCorrespondences = (card) => {
  const hasAny = (Array.isArray(card.colors) && card.colors.length > 0)
    || (Array.isArray(card.crystals) && card.crystals.length > 0)
    || (Array.isArray(card.herbs) && card.herbs.length > 0);

  if (!hasAny) {
    hideSection(SECTION_IDS.correspondences);
    return;
  }

  const colorMap = {
    yellow: '#f5e642',
    'light blue': '#87ceeb',
    light_blue: '#87ceeb',
    white: '#f0f0f0',
    red: '#e74c3c',
    orange: '#f39c12',
    green: '#27ae60',
    blue: '#3498db',
    purple: '#9b59b6',
    black: '#2c3e50',
    brown: '#8b7355',
    gold: '#ffd700',
    silver: '#c0c0c0',
    pink: '#ff99cc',
    gray: '#95a5a6',
    grey: '#95a5a6'
  };

  const body = getSafeSectionBody(SECTION_IDS.correspondences);
  if (!body) {
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'correspondences-row';

  if (Array.isArray(card.colors) && card.colors.length > 0) {
    const colorCard = document.createElement('div');
    colorCard.className = 'corr-card';

    const title = document.createElement('div');
    title.className = 'corr-card-title';
    title.textContent = 'Colors';
    colorCard.appendChild(title);

    const colorRow = document.createElement('div');
    colorRow.className = 'color-row';
    card.colors.forEach((color) => {
      const swatch = document.createElement('div');
      swatch.className = 'color-swatch';
      const colorKey = String(color).toLowerCase().trim();
      swatch.style.background = colorMap[colorKey] || '#888';
      swatch.setAttribute('title', formatLabel(color));
      colorRow.appendChild(swatch);
    });

    colorCard.appendChild(colorRow);
    grid.appendChild(colorCard);
  }

  if (Array.isArray(card.crystals) && card.crystals.length > 0) {
    const crystalCard = document.createElement('div');
    crystalCard.className = 'corr-card';

    const title = document.createElement('div');
    title.className = 'corr-card-title';
    title.textContent = 'Crystals';
    crystalCard.appendChild(title);

    const pills = document.createElement('div');
    pills.className = 'corr-pills';
    card.crystals.forEach((item) => {
      const pill = document.createElement('span');
      pill.className = 'corr-pill';
      pill.textContent = formatLabel(item);
      pills.appendChild(pill);
    });

    crystalCard.appendChild(pills);
    grid.appendChild(crystalCard);
  }

  if (Array.isArray(card.herbs) && card.herbs.length > 0) {
    const herbCard = document.createElement('div');
    herbCard.className = 'corr-card';

    const title = document.createElement('div');
    title.className = 'corr-card-title';
    title.textContent = 'Herbs';
    herbCard.appendChild(title);

    const pills = document.createElement('div');
    pills.className = 'corr-pills';
    card.herbs.forEach((item) => {
      const pill = document.createElement('span');
      pill.className = 'corr-pill';
      pill.textContent = formatLabel(item);
      pills.appendChild(pill);
    });

    herbCard.appendChild(pills);
    grid.appendChild(herbCard);
  }

  body.appendChild(grid);
  showSection(SECTION_IDS.correspondences);
};

const createCardNameToSlugMap = (allCards) => {
  const map = new Map();

  if (!Array.isArray(allCards)) {
    return map;
  }

  allCards.forEach((entry) => {
    if (entry && entry.name && entry.slug) {
      map.set(entry.name, entry.slug);
    }
  });

  return map;
};

const renderRelatedCards = (card, cardNameToSlug) => {
  if (!Array.isArray(card.related_cards) || card.related_cards.length === 0) {
    hideSection(SECTION_IDS.related);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.related);
  if (!body) {
    return;
  }

  const row = document.createElement('div');
  row.className = 'related-row';

  card.related_cards.forEach((name) => {
    const slug = cardNameToSlug.get(name);
    const link = document.createElement('a');
    link.className = 'related-chip';
    link.textContent = name;
    link.href = slug ? `/cards/${slug}` : '#';
    row.appendChild(link);
  });

  body.appendChild(row);
  showSection(SECTION_IDS.related);
};

const renderOriginalMeaning = (card) => {
  if (!card.original_meaning) {
    hideSection(SECTION_IDS.original);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.original);
  if (!body) {
    return;
  }

  const block = document.createElement('div');
  block.className = 'original-block';
  block.innerHTML = `<strong>Traditional Interpretation</strong>${card.original_meaning}`;
  body.appendChild(block);
  showSection(SECTION_IDS.original);
};

const renderAdditionalFields = (card) => {
  const usedKeys = new Set([
    'id',
    'slug',
    'name',
    'arcana',
    'number',
    'image',
    'image_url',
    'description',
    'meanings_upright',
    'meanings_reversed',
    'keywords',
    'yes_maybe_no',
    'element',
    'astrology',
    'numerology',
    'symbolism',
    'original_meaning',
    'visual_symbols',
    'love_upright',
    'love_reversed',
    'career_upright',
    'career_reversed',
    'finances_upright',
    'finances_reversed',
    'health_upright',
    'health_reversed',
    'spirituality',
    'advice',
    'warning',
    'affirmation',
    'colors',
    'crystals',
    'herbs',
    'related_cards',
    'suit'
  ]);

  const extras = Object.entries(card).filter(([key, value]) => {
    if (usedKeys.has(key) || value === null || value === undefined) {
      return false;
    }

    if (typeof value === 'string') {
      return value.trim().length > 0;
    }

    if (Array.isArray(value)) {
      return value.length > 0;
    }

    return typeof value === 'object' ? Object.keys(value).length > 0 : true;
  });

  if (extras.length === 0) {
    hideSection(SECTION_IDS.additional);
    return;
  }

  const body = getSafeSectionBody(SECTION_IDS.additional);
  if (!body) {
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'grid-two';

  extras.forEach(([key, value]) => {
    const cardNode = document.createElement('article');
    cardNode.className = 'soft-card';

    const title = document.createElement('h4');
    title.textContent = formatLabel(key);
    cardNode.appendChild(title);

    if (Array.isArray(value)) {
      const row = document.createElement('div');
      row.className = 'pill-row';
      value.forEach((item) => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = formatLabel(item);
        row.appendChild(pill);
      });
      cardNode.appendChild(row);
    } else if (typeof value === 'object') {
      const list = document.createElement('div');
      list.className = 'pill-row';
      Object.entries(value).forEach(([childKey, childValue]) => {
        const pill = document.createElement('span');
        pill.className = 'pill';
        pill.textContent = `${formatLabel(childKey)}: ${childValue}`;
        list.appendChild(pill);
      });
      cardNode.appendChild(list);
    } else {
      addText(cardNode, value);
    }

    grid.appendChild(cardNode);
  });

  body.appendChild(grid);
  showSection(SECTION_IDS.additional);
};

const renderFooter = (card, totalCards) => {
  const footer = document.getElementById('page-footer');
  if (!footer) {
    return;
  }

  const parts = [];

  if (Number.isFinite(card.number)) {
    parts.push(`Card ${card.number} of ${totalCards}`);
  } else {
    parts.push(`Card of ${totalCards}`);
  }

  if (card.arcana) {
    parts.push(`${card.arcana} Arcana`);
  }

  footer.textContent = parts.join(' · ');
};

const renderCard = async () => {
  const slug = normalizeSlug();

  try {
    const [cardResponse, cardsResponse] = await Promise.all([
      fetch(`/cards/data/${encodeURIComponent(slug)}`),
      fetch('/cards/data')
    ]);

    // Redirect to 404 page if card is not found
    if (cardResponse.status === 404) {
      window.location.replace('/404.html');
      return;
    }

    if (!cardResponse.ok) {
      throw new Error(`Card request failed with status: ${cardResponse.status}`);
    }

    if (!cardsResponse.ok) {
      throw new Error(`Cards request failed with status: ${cardsResponse.status}`);
    }

    const [card, cards] = await Promise.all([
      cardResponse.json(),
      cardsResponse.json()
    ]);
    const cardNameToSlug = createCardNameToSlugMap(cards);

    document.title = `Tarot Guide — ${card.name}`;
    resetDynamicSections();

    renderHero(card);
    renderImageAndFacts(card);
    createOrientationToggle();

    renderDescription(card);
    renderMeanings(card);
    renderVisualSymbols(card);
    renderReadingSection(card);
    renderSimpleTextSections(card);
    renderGuidance(card);
    renderAffirmation(card);
    renderCorrespondences(card);
    renderRelatedCards(card, cardNameToSlug);
    renderOriginalMeaning(card);
    renderAdditionalFields(card);
    renderFooter(card, cards.length);
  } catch (error) {
    const content = document.getElementById('detail-sections');
    content.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'detail-error';
    wrapper.innerHTML = `<h2>Card Not Found</h2><p>${error.message}</p><a href="/" role="button">Return Home</a>`;
    content.appendChild(wrapper);
  }
};

renderCard();
