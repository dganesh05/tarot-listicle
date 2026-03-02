import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cardData from '../data/cards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/', (req, res) => {
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

  res.status(200).json(normalizedCards);
});

router.get('/:slug', (req, res) => {
  res.status(200).sendFile(path.resolve(__dirname, '../../client/public/card.html'));
});


export default router;