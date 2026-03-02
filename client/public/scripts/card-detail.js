const sectionTemplate = document.getElementById('section-template');

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

const createSection = (title) => {
  const clone = sectionTemplate.content.cloneNode(true);
  const section = clone.querySelector('.section-block');
  section.querySelector('.section-label').textContent = title;
  return section;
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
  if (!text) {
    return;
  }

  const p = document.createElement('p');
  p.className = className;
  p.textContent = text;
  container.appendChild(p);
};

const createSoftCard = (title, content) => {
  const card = document.createElement('article');
  card.className = 'soft-card';

  const heading = document.createElement('h4');
  heading.textContent = title;

  const body = document.createElement('p');
  body.textContent = content;

  card.appendChild(heading);
  card.appendChild(body);
  return card;
};

const renderHero = (card) => {
  document.getElementById('card-name').textContent = card.name;
  document.getElementById('card-number').textContent = Number.isFinite(card.number) ? card.number : '—';

  const heroMeta = document.getElementById('card-meta');
  const parts = [
    card.arcana ? `${card.arcana} Arcana` : '',
    card.suit || '',
    card.element || '',
    card.astrology || '',
    card.yes_maybe_no || ''
  ].filter(Boolean);

  heroMeta.innerHTML = '';
  parts.forEach((part, index) => {
    const span = document.createElement('span');
    span.textContent = part;
    heroMeta.appendChild(span);

    if (index < parts.length - 1) {
      const separator = document.createElement('span');
      separator.className = 'sep';
      separator.textContent = '✦';
      heroMeta.appendChild(separator);
    }
  });
};

const renderImageAndFacts = (card) => {
  const image = document.getElementById('card-image');
  image.src = card.image || card.image_url || '';
  image.alt = card.name || 'Tarot Card';

  const caption = document.getElementById('card-caption');
  const captionParts = [
    'Rider–Waite–Smith',
    Number.isFinite(card.number) ? `Card ${card.number}` : '',
    card.suit || ''
  ].filter(Boolean);
  caption.textContent = captionParts.join(' · ');

  const quickFacts = document.getElementById('quick-facts');
  quickFacts.innerHTML = '';

  const facts = [
    ['Arcana', card.arcana ? `${card.arcana} Arcana` : '—'],
    ['Suit', card.suit || '—'],
    ['Element', card.element || '—'],
    ['Astrology', card.astrology || '—'],
    ['Yes / No', card.yes_maybe_no || '—'],
    ['Number', Number.isFinite(card.number) ? card.number : '—']
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
};

const renderDescription = (card, container) => {
  console.log('[renderDescription] Has description?', !!card.description);
  if (!card.description) {
    return;
  }

  const section = createSection('Card Description');
  addText(section.querySelector('.section-body'), card.description, 'description-text');
  container.appendChild(section);
};

const renderKeywords = (card, container) => {
  const hasKeywords = Array.isArray(card.keywords) && card.keywords.length > 0;
  console.log('[renderKeywords] Has keywords?', hasKeywords, 'Keywords:', card.keywords);
  if (!hasKeywords) {
    return;
  }

  const section = createSection('Keywords');
  section.querySelector('.section-body').appendChild(createTagRow(card.keywords));
  container.appendChild(section);
};

const renderMeanings = (card, container) => {
  const hasUpright = Array.isArray(card.meanings_upright) && card.meanings_upright.length > 0;
  const hasReversed = Array.isArray(card.meanings_reversed) && card.meanings_reversed.length > 0;

  if (!hasUpright && !hasReversed) {
    return;
  }

  const section = createSection('Meanings');
  const body = section.querySelector('.section-body');

  if (hasUpright) {
    const heading = document.createElement('div');
    heading.className = 'section-title';
    heading.textContent = 'Upright';
    body.appendChild(heading);
    
    const tagRow = createTagRow(card.meanings_upright, 'tag-upright');
    tagRow.style.marginBottom = '1rem';
    body.appendChild(tagRow);
  }

  if (hasReversed) {
    const heading = document.createElement('div');
    heading.className = 'section-title';
    heading.textContent = 'Reversed';
    body.appendChild(heading);
    body.appendChild(createTagRow(card.meanings_reversed, 'tag-reversed'));
  }

  container.appendChild(section);
};

const renderVisualSymbols = (card, container) => {
  console.log('[renderVisualSymbols] Has visual_symbols?', !!card.visual_symbols, 'Value:', card.visual_symbols);
  if (!card.visual_symbols || typeof card.visual_symbols !== 'object') {
    return;
  }

  const entries = Object.entries(card.visual_symbols);
  console.log('[renderVisualSymbols] Entries count:', entries.length);
  if (entries.length === 0) {
    return;
  }

  const section = createSection('Visual Symbolism');
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

  section.querySelector('.section-body').appendChild(grid);
  container.appendChild(section);
};

const renderReadingSection = (card, container) => {
  const topics = [
    { title: 'Love & Relationships', icon: '💕', upright: card.love_upright, reversed: card.love_reversed },
    { title: 'Career & Work', icon: '💼', upright: card.career_upright, reversed: card.career_reversed },
    { title: 'Finances', icon: '💰', upright: card.finances_upright, reversed: card.finances_reversed },
    { title: 'Health & Wellness', icon: '🌿', upright: card.health_upright, reversed: card.health_reversed }
  ].filter((topic) => topic.upright || topic.reversed);

  console.log('[renderReadingSection] Topics with data:', topics.length);
  if (topics.length === 0) {
    console.log('[renderReadingSection] No reading topics found, returning');
    return;
  }

  const section = document.createElement('div');
  section.className = 'section-block';

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'In a Reading';
  section.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'reading-grid';

  topics.forEach((topic) => {
    const card = document.createElement('div');
    card.className = 'reading-card';

    const icon = document.createElement('div');
    icon.className = 'reading-card-icon';
    icon.textContent = topic.icon;
    card.appendChild(icon);

    const titleEl = document.createElement('div');
    titleEl.className = 'reading-card-title';
    titleEl.textContent = topic.title;
    card.appendChild(titleEl);

    if (topic.upright) {
      const uprightLabel = document.createElement('span');
      uprightLabel.className = 'reading-label label-upright';
      uprightLabel.textContent = 'Upright';
      card.appendChild(uprightLabel);

      const uprightText = document.createElement('p');
      uprightText.textContent = topic.upright;
      card.appendChild(uprightText);
    }

    if (topic.upright && topic.reversed) {
      card.appendChild(document.createElement('br'));
    }

    if (topic.reversed) {
      const reversedLabel = document.createElement('span');
      reversedLabel.className = 'reading-label label-reversed';
      reversedLabel.textContent = 'Reversed';
      card.appendChild(reversedLabel);

      const reversedText = document.createElement('p');
      reversedText.textContent = topic.reversed;
      card.appendChild(reversedText);
    }

    grid.appendChild(card);
  });

  section.appendChild(grid);
  container.appendChild(section);
};

const renderSimpleTextSections = (card, container) => {
  console.log('[renderSimpleTextSections] Has spirituality?', !!card.spirituality);
  console.log('[renderSimpleTextSections] Has numerology?', !!card.numerology);
  console.log('[renderSimpleTextSections] Has symbolism?', Array.isArray(card.symbolism) && card.symbolism.length > 0);
  
  if (card.spirituality) {
    const spirituality = createSection('Spiritual Significance');
    addText(spirituality.querySelector('.section-body'), card.spirituality);
    container.appendChild(spirituality);
  }

  if (card.numerology) {
    const numerology = createSection('Numerology');
    addText(numerology.querySelector('.section-body'), card.numerology);
    container.appendChild(numerology);
  }

  if (Array.isArray(card.symbolism) && card.symbolism.length > 0) {
    const symbolism = createSection('Core Symbolism');
    symbolism.querySelector('.section-body').appendChild(createTagRow(card.symbolism));
    container.appendChild(symbolism);
  }
};

const renderGuidance = (card, container) => {
  console.log('[renderGuidance] Has advice?', !!card.advice, 'Has warning?', !!card.warning);
  if (!card.advice && !card.warning) {
    return;
  }

  const section = createSection('Guidance');
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

  section.querySelector('.section-body').appendChild(grid);
  container.appendChild(section);
};

const renderAffirmation = (card, container) => {
  console.log('[renderAffirmation] Has affirmation?', !!card.affirmation);
  if (!card.affirmation) {
    return;
  }

  const section = document.createElement('div');
  section.className = 'section-block';

  const block = document.createElement('div');
  block.className = 'affirmation-block';

  const label = document.createElement('div');
  label.className = 'section-label';
  label.textContent = 'Affirmation';
  block.appendChild(label);

  const text = document.createElement('p');
  text.className = 'affirmation-text';
  text.textContent = `"${card.affirmation}"`;
  block.appendChild(text);

  section.appendChild(block);
  container.appendChild(section);
};

const renderCorrespondences = (card, container) => {
  const hasAny = (Array.isArray(card.colors) && card.colors.length > 0)
    || (Array.isArray(card.crystals) && card.crystals.length > 0)
    || (Array.isArray(card.herbs) && card.herbs.length > 0);

  console.log('[renderCorrespondences] Has colors?', Array.isArray(card.colors) && card.colors.length > 0);
  console.log('[renderCorrespondences] Has crystals?', Array.isArray(card.crystals) && card.crystals.length > 0);
  console.log('[renderCorrespondences] Has herbs?', Array.isArray(card.herbs) && card.herbs.length > 0);
  console.log('[renderCorrespondences] Has any?', hasAny);

  if (!hasAny) {
    return;
  }

  const colorMap = {
    yellow: '#f5e642',
    'light blue': '#87ceeb',
    'light_blue': '#87ceeb',
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

  const section = createSection('Correspondences');
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

  section.querySelector('.section-body').appendChild(grid);
  container.appendChild(section);
};

const renderRelatedCards = (card, allCards, container) => {
  if (!Array.isArray(card.related_cards) || card.related_cards.length === 0) {
    return;
  }

  const section = createSection('Related Cards');
  const row = document.createElement('div');
  row.className = 'related-row';

  card.related_cards.forEach((name) => {
    const match = allCards.find((candidate) => candidate.name === name);
    const link = document.createElement('a');
    link.className = 'related-chip';
    link.textContent = name;
    link.href = match ? `/cards/${match.slug}` : '#';
    row.appendChild(link);
  });

  section.querySelector('.section-body').appendChild(row);
  container.appendChild(section);
};

const renderOriginalMeaning = (card, container) => {
  if (!card.original_meaning) {
    return;
  }

  const section = createSection('Historical Meaning');
  const block = document.createElement('div');
  block.className = 'original-block';
  block.innerHTML = `<strong>Traditional Interpretation</strong>${card.original_meaning}`;
  section.querySelector('.section-body').appendChild(block);
  container.appendChild(section);
};

const renderAdditionalFields = (card, container) => {
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
    return;
  }

  const section = createSection('Additional Details');
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

  section.querySelector('.section-body').appendChild(grid);
  container.appendChild(section);
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
  const content = document.getElementById('detail-sections');

  console.log('[Card Detail] Slug:', slug);
  console.log('[Card Detail] Content element:', content);

  try {
    console.log('[Card Detail] Fetching cards from /cards...');
    const response = await fetch('/cards');
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const cards = await response.json();
    console.log('[Card Detail] Cards fetched:', cards.length, 'cards');
    console.log('[Card Detail] All slugs:', cards.map(c => c.slug));
    
    const card = cards.find((entry) => entry.slug === slug);

    if (!card) {
      console.error('[Card Detail] Card with slug', slug, 'not found');
      throw new Error(`Card with slug "${slug}" not found`);
    }

    console.log('[Card Detail] Card found:', card.name);
    console.log('[Card Detail] **FULL CARD OBJECT:**', JSON.stringify(card, null, 2));
    console.log('[Card Detail] Card.spirituality:', card.spirituality);
    console.log('[Card Detail] Card.advice:', card.advice);
    console.log('[Card Detail] Card.affirmation:', card.affirmation);
    console.log('[Card Detail] Card.colors:', card.colors);
    
    document.title = `Tarot Guide — ${card.name}`;
    content.innerHTML = '';

    renderHero(card);
    console.log('[Card Detail] After renderHero - detail-sections children:', content.children.length);
    
    renderImageAndFacts(card);
    console.log('[Card Detail] After renderImageAndFacts');
    
    renderDescription(card, content);
    console.log('[Card Detail] After renderDescription - detail-sections children:', content.children.length);
    
    renderKeywords(card, content);
    console.log('[Card Detail] After renderKeywords - detail-sections children:', content.children.length);
    
    renderMeanings(card, content);
    console.log('[Card Detail] After renderMeanings - detail-sections children:', content.children.length);
    
    renderVisualSymbols(card, content);
    console.log('[Card Detail] After renderVisualSymbols - detail-sections children:', content.children.length);
    
    renderReadingSection(card, content);
    console.log('[Card Detail] After renderReadingSection - detail-sections children:', content.children.length);
    
    renderSimpleTextSections(card, content);
    console.log('[Card Detail] After renderSimpleTextSections - detail-sections children:', content.children.length);
    
    renderGuidance(card, content);
    console.log('[Card Detail] After renderGuidance - detail-sections children:', content.children.length);
    
    renderAffirmation(card, content);
    console.log('[Card Detail] After renderAffirmation - detail-sections children:', content.children.length);
    
    renderCorrespondences(card, content);
    console.log('[Card Detail] After renderCorrespondences - detail-sections children:', content.children.length);
    
    renderRelatedCards(card, cards, content);
    console.log('[Card Detail] After renderRelatedCards - detail-sections children:', content.children.length);
    
    renderOriginalMeaning(card, content);
    console.log('[Card Detail] After renderOriginalMeaning - detail-sections children:', content.children.length);
    
    renderAdditionalFields(card, content);
    console.log('[Card Detail] After renderAdditionalFields - detail-sections children:', content.children.length);
    
    renderFooter(card, cards.length);
    console.log('[Card Detail] Card rendered successfully. Total sections:', content.children.length);
    console.log('[Card Detail] Content element height:', content.offsetHeight);
    console.log('[Card Detail] Content element scrollHeight:', content.scrollHeight);
  } catch (error) {
    console.error('[Card Detail] Error loading card:', error);
    content.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'detail-error';
    wrapper.innerHTML = `<h2>Card Not Found</h2><p>${error.message}</p><a href="/" role="button">Return Home</a>`;
    content.appendChild(wrapper);
  }
};

renderCard();