const express = require('express');
const router = express.Router();

// Get all NFTs
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.query('SELECT * FROM nfts ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch NFTs' });
  }
});

// Get a specific NFT by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const result = await db.query('SELECT * FROM nfts WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching NFT:', error);
    res.status(500).json({ error: 'Failed to fetch NFT' });
  }
});

// Create a new NFT
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, description, image, price, owner } = req.body;
    
    // Validate required fields
    if (!name || !image || !price || !owner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await db.query(
      'INSERT INTO nfts (name, description, image, price, owner) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, image, price, owner]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating NFT:', error);
    res.status(500).json({ error: 'Failed to create NFT' });
  }
});

// Update an NFT
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { name, description, image, price, owner } = req.body;
    
    // Validate required fields
    if (!name || !image || !price || !owner) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await db.query(
      'UPDATE nfts SET name = $1, description = $2, image = $3, price = $4, owner = $5 WHERE id = $6 RETURNING *',
      [name, description, image, price, owner, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating NFT:', error);
    res.status(500).json({ error: 'Failed to update NFT' });
  }
});

// Delete an NFT
router.delete('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    const result = await db.query('DELETE FROM nfts WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'NFT not found' });
    }
    
    res.json({ message: 'NFT deleted successfully' });
  } catch (error) {
    console.error('Error deleting NFT:', error);
    res.status(500).json({ error: 'Failed to delete NFT' });
  }
});

module.exports = router; 