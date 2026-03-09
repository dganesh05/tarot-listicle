import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import CardsController from '../controllers/cards.js'; // Import the controller

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

router.get('/data/search', CardsController.searchCards);
router.get('/data', CardsController.getCards);
router.get('/data/:slug', CardsController.getCardBySlug);

router.get('/', (req, res) => {
    res.status(200).json({ message: "Welcome to the Tarot API" });
});

router.get('/:slug', (req, res) => {
    res.status(200).sendFile(path.resolve(__dirname, '../../client/public/card.html'));
});

export default router;