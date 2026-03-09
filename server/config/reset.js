import { pool } from './database.js';
import cardData from '../data/cards.js';

const createCardsTable = async () => {
    const createTableQuery = `
        DROP TABLE IF EXISTS cards;

        CREATE TABLE IF NOT EXISTS cards (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(255) NOT NULL,
            arcana VARCHAR(255) NOT NULL,
            suit VARCHAR(50),
            number INTEGER,
            display_order INTEGER NOT NULL,
            image TEXT NOT NULL,
            description TEXT,
            meanings_upright TEXT[] NOT NULL,
            meanings_reversed TEXT[] NOT NULL,
            keywords TEXT[],
            yes_maybe_no VARCHAR(50),
            element VARCHAR(50),
            astrology VARCHAR(255),
            numerology TEXT,
            symbolism TEXT[],
            original_meaning TEXT,
            visual_symbols JSONB,
            love_upright TEXT,
            love_reversed TEXT,
            career_upright TEXT,
            career_reversed TEXT,
            finances_upright TEXT,
            finances_reversed TEXT,
            health_upright TEXT,
            health_reversed TEXT,
            spirituality TEXT,
            advice TEXT,
            warning TEXT,
            affirmation TEXT,
            colors TEXT[],
            crystals TEXT[],
            herbs TEXT[],
            related_cards TEXT[]
        )
    `;

    try {
        await pool.query(createTableQuery);
        console.log('SUCCESS: Cards table created successfully');
    } catch (err) {
        console.error('ERROR: Error creating cards table', err);
    }
};

const seedCardsTable = async () => {
    // 1. Await the table creation first
    await createCardsTable();

    // 2. Iterate over the mock database and insert each row
    try {
        await Promise.all(cardData.map((card, index) => {
            const insertQuery = {
                text: 'INSERT INTO cards (slug, name, arcana, suit, number, display_order, image, description, meanings_upright, meanings_reversed, keywords, yes_maybe_no, element, astrology, numerology, symbolism, original_meaning, visual_symbols, love_upright, love_reversed, career_upright, career_reversed, finances_upright, finances_reversed, health_upright, health_reversed, spirituality, advice, warning, affirmation, colors, crystals, herbs, related_cards) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34)'
            };

            const values = [
                card.slug,
                card.name,
                card.arcana,
                card.suit || null,
                card.number,
                index,
                card.image,
                card.description,
                card.meanings_upright,
                card.meanings_reversed,
                card.keywords,
                card.yes_maybe_no,
                card.element,
                card.astrology,
                card.numerology,
                card.symbolism,
                card.original_meaning,
                card.visual_symbols,
                card.love_upright,
                card.love_reversed,
                card.career_upright,
                card.career_reversed,
                card.finances_upright,
                card.finances_reversed,
                card.health_upright,
                card.health_reversed,
                card.spirituality,
                card.advice,
                card.warning,
                card.affirmation,
                card.colors,
                card.crystals,
                card.herbs,
                card.related_cards
            ];

            return pool.query(insertQuery, values)
                .then((res) => {
                    console.log(`SUCCESS: ${card.name} added successfully`);
                })
                .catch((err) => {
                    console.error(`ERROR: Error inserting ${card.name}`, err);
                    throw err;
                });
        }));
        console.log('SUCCESS: All cards seeded successfully');
        await pool.end();
    } catch (err) {
        console.error('ERROR: Failed to seed cards table', err);
        await pool.end();
    }
};

seedCardsTable();