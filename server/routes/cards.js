import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cardData from '../data/cards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
  console.log('[API] /cards endpoint called');
  console.log('[API] Total cards:', cardData.length);
  console.log('[API] Card 2 (High Priestess) keys:', cardData[2] ? Object.keys(cardData[2]) : 'NOT FOUND');
  console.log('[API] Card 2 has description?', cardData[2]?.description ? 'YES' : 'NO');
  console.log('[API] Card 2 has spirituality?', cardData[2]?.spirituality ? 'YES' : 'NO');
  console.log('[API] Card 2 spirituality value:', cardData[2]?.spirituality);
  
  const normalizedCards = cardData.map((card) => {
    if (!card.image) {
      return card;
    }

    const fileName = card.image.split('/').pop();
    return {
      ...card,
      image: `/images/${fileName}`,
    };
  });

  console.log('[API] After normalization - Card 2 has spirituality?', normalizedCards[2]?.spirituality ? 'YES' : 'NO');
  res.status(200).json(normalizedCards);
});

router.get('/:slug', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../../client/public/card.html'));
});


export default router;