// Supplementary card data to fill in gaps from API
const cardDataSupplement = {
  '2-the-high-priestess': {
    'description': 'A serene woman sits between two pillars — one black (Boaz) and one white (Jachin) — before a veil decorated with pomegranates. She wears a blue robe and a horned diadem with a globe, holding a scroll labeled \'TORA.\' A crescent moon rests at her feet.',
    'keywords': ['intuition', 'mystery', 'inner wisdom', 'the unconscious'],
    'astrology': 'Moon',
    'numerology': '2 — duality, balance, partnership, receptivity, and the union of opposites',
    'number': 2,
    'visual_symbols': {
      'pillars_b_and_j': 'Boaz (strength) and Jachin (establishment) — duality, the threshold between worlds',
      'veil_of_pomegranates': 'The barrier between the conscious and subconscious, fertility and sacred feminine knowledge',
      'scroll_tora': 'The Torah / divine law — hidden and esoteric knowledge, partly concealed',
      'crescent_moon': 'Cycles, feminine power, intuition, and the subconscious',
      'blue_robe': 'Knowledge flowing like water, spiritual wisdom',
      'cross_on_chest': 'Balance of the four elements, spiritual grounding'
    },
    'love_upright': 'Trust your intuition about a partner or potential relationship. Hidden depths are waiting to be explored. Patience in love.',
    'love_reversed': 'Secrets in a relationship. Ignoring red flags or gut feelings. Emotional withdrawal from a partner.',
    'career_upright': 'Trust your instincts at work. Hidden information may soon come to light. A mentor or guide may appear.',
    'career_reversed': 'Office politics or hidden agendas. Information being withheld. Ignoring professional intuition.',
    'finances_upright': 'Trust your gut with financial decisions. Not all information is on the surface — do deeper research before investing.',
    'finances_reversed': 'Hidden financial information. Poor decisions from ignoring intuition. Lack of financial clarity.',
    'health_upright': 'Listen to what your body is telling you. Intuitive healing. Pay attention to dreams and subconscious signals about health.',
    'health_reversed': 'Ignoring health intuitions. Repressed emotions manifesting physically. Seek a second medical opinion.',
    'spirituality': 'Deep connection to the divine feminine and the subconscious mind. Meditation, dreamwork, and developing psychic abilities. The veil between worlds is thin.',
    'advice': 'Be still and listen. The answers you seek are within you. Trust your inner voice above external noise.',
    'warning': 'Not everything as it seems. Secrets may be hiding beneath the surface. Be patient — clarity will come.',
    'affirmation': 'I trust my inner wisdom and honor the mysteries that unfold in divine timing.',
    'colors': ['blue', 'white', 'silver', 'black'],
    'crystals': ['moonstone', 'labradorite', 'lapis lazuli'],
    'herbs': ['mugwort', 'jasmine', 'white willow'],
    'related_cards': ['The Moon', 'The Magician', 'Queen of Cups']
  }
};

const supplementCardData = (cards) => {
  return cards.map(card => {
    if (cardDataSupplement[card.slug]) {
      return { ...card, ...cardDataSupplement[card.slug] };
    }
    return card;
  });
};
