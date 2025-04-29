const express = require('express');
const router = express.Router();

// Get all tokens
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.query('SELECT * FROM tokens ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching tokens:', error);
    res.status(500).json({ error: 'Failed to fetch tokens' });
  }
});

// Get a specific token by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const result = await db.query('SELECT * FROM tokens WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching token:', error);
    res.status(500).json({ error: 'Failed to fetch token' });
  }
});

// Get token balances for a specific address
router.get('/balances/:address', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { address } = req.params;
    const result = await db.query('SELECT * FROM token_balances WHERE address = $1', [address]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching token balances:', error);
    res.status(500).json({ error: 'Failed to fetch token balances' });
  }
});

// Create a new token
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { name, symbol, totalSupply, decimals, contractAddress } = req.body;
    
    // Validate required fields
    if (!name || !symbol || !totalSupply || !contractAddress) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await db.query(
      'INSERT INTO tokens (name, symbol, total_supply, decimals, contract_address) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, symbol, totalSupply, decimals || 18, contractAddress]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating token:', error);
    res.status(500).json({ error: 'Failed to create token' });
  }
});

// Update token price
router.put('/:id/price', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { price } = req.body;
    
    if (!price) {
      return res.status(400).json({ error: 'Price is required' });
    }
    
    const result = await db.query(
      'UPDATE tokens SET price = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
      [price, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Token not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating token price:', error);
    res.status(500).json({ error: 'Failed to update token price' });
  }
});

// Update token balance
router.put('/balances', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { tokenId, address, balance } = req.body;
    
    // Validate required fields
    if (!tokenId || !address || balance === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if balance entry exists
    const checkResult = await db.query(
      'SELECT * FROM token_balances WHERE token_id = $1 AND address = $2',
      [tokenId, address]
    );
    
    let result;
    if (checkResult.rows.length === 0) {
      // Create new balance entry
      result = await db.query(
        'INSERT INTO token_balances (token_id, address, balance) VALUES ($1, $2, $3) RETURNING *',
        [tokenId, address, balance]
      );
    } else {
      // Update existing balance
      result = await db.query(
        'UPDATE token_balances SET balance = $1, updated_at = NOW() WHERE token_id = $2 AND address = $3 RETURNING *',
        [balance, tokenId, address]
      );
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating token balance:', error);
    res.status(500).json({ error: 'Failed to update token balance' });
  }
});

module.exports = router; 