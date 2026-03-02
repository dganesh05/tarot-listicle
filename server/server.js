import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cardsRouter from './routes/cards.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static files from client/dist (production build) or client/public (development)
app.use('/public', express.static(path.resolve(__dirname, '../client/dist')));
app.use('/scripts', express.static(path.resolve(__dirname, '../client/public/scripts')));
app.use('/images', express.static(path.resolve(__dirname, '../client/public/images/cards')));

app.use('/cards', cardsRouter);

app.get('/', (req, res) => {
  res.status(200).send('<h1 style="text-align: center; margin-top: 50px;">Tarot API</h1>');
});

app.use((req, res) => {
  res.status(404).sendFile(path.resolve(__dirname, '../client/public/404.html'));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});