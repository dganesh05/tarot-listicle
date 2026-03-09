import { pool } from '../config/database.js';

// GET all cards
const getCards = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM cards ORDER BY display_order ASC');
        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

// GET a specific card by its slug
const getCardBySlug = async (req, res) => {
    try {
        const selectQuery = `SELECT * FROM cards WHERE slug = $1`;
        const slug = req.params.slug;
        const results = await pool.query(selectQuery, [slug]);

        // If the query returns a row, send it. Otherwise, send a 404.
        if (results.rows.length > 0) {
            res.status(200).json(results.rows[0]);
        } else {
            res.status(404).json({ message: "Card not found" });
        }
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

const searchCards = async (req, res) => {
    const rawAttr = (req.query.attr || '').toString().trim().toLowerCase();
    const q = (req.query.q || '').toString().trim();

    if (!q) {
        return res.status(200).json([]);
    }

    // Accept both old and new attr labels from the client.
    const attrAliases = {
        suit_or_arcana: 'suit_or_arcana',
        'suit/arcana': 'suit_or_arcana',
        arcana: 'arcana',
        suit: 'suit',
        name: 'name',
        element: 'element',
        yes_maybe_no: 'yes_maybe_no',
        astrology: 'astrology',
        number: 'number',
        keywords: 'keywords',
        colors: 'colors',
        crystals: 'crystals',
        herbs: 'herbs'
    };

    const normalizedAttr = attrAliases[rawAttr];

    if (!normalizedAttr) {
        return res.status(400).json({ error: 'Invalid search attribute' });
    }

    const searchableColumns = {
        name: 'name',
        arcana: 'arcana',
        suit: 'suit',
        element: 'element',
        yes_maybe_no: 'yes_maybe_no',
        astrology: 'astrology',
        number: 'number'
    };

    const arrayColumns = ['keywords', 'colors', 'crystals', 'herbs'];

    try {
        const searchTerm = `%${q}%`;

        if (normalizedAttr === 'suit_or_arcana') {
            const results = await pool.query(
                `SELECT * FROM cards
                 WHERE arcana ILIKE $1 OR suit ILIKE $1
                 ORDER BY display_order ASC`,
                [searchTerm]
            );

            if (results.rows.length === 0) {
                return res.status(404).json({ message: "No cards found" });
            }
            return res.status(200).json(results.rows);
        }

        // Handle array columns with special query
        if (arrayColumns.includes(normalizedAttr)) {
            const results = await pool.query(
                `SELECT * FROM cards 
                 WHERE EXISTS (
                     SELECT 1 FROM unnest(${normalizedAttr}) AS elem 
                     WHERE elem ILIKE $1
                 ) 
                 ORDER BY display_order ASC`,
                [searchTerm]
            );

            if (results.rows.length === 0) {
                return res.status(404).json({ message: "No cards found" });
            }
            return res.status(200).json(results.rows);
        }

        const column = searchableColumns[normalizedAttr];
        const results = await pool.query(
            `SELECT * FROM cards WHERE ${column} ILIKE $1 ORDER BY display_order ASC`,
            [searchTerm]
        );

        if (results.rows.length === 0) {
            return res.status(404).json({ message: "No cards found" });
        }

        res.status(200).json(results.rows);
    } catch (error) {
        res.status(409).json({ error: error.message });
    }
};

export default {
    getCards,
    getCardBySlug,
    searchCards
};