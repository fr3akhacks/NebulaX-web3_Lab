const express = require('express');
const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const result = await db.query('SELECT id, username, address, created_at FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get a specific user by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const result = await db.query('SELECT id, username, address, created_at FROM users WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Get a user by wallet address
router.get('/address/:address', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { address } = req.params;
    const result = await db.query('SELECT id, username, address, created_at FROM users WHERE address = $1', [address]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching user by address:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Create a new user
router.post('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { username, address } = req.body;
    
    // Validate required fields
    if (!username || !address) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Check if user with this address already exists
    const checkResult = await db.query('SELECT * FROM users WHERE address = $1', [address]);
    
    if (checkResult.rows.length > 0) {
      return res.status(409).json({ error: 'User with this address already exists' });
    }
    
    const result = await db.query(
      'INSERT INTO users (username, address) VALUES ($1, $2) RETURNING id, username, address, created_at',
      [username, address]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }
    
    const result = await db.query(
      'UPDATE users SET username = $1, updated_at = NOW() WHERE id = $2 RETURNING id, username, address, created_at',
      [username, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Get user's NFTs
router.get('/:id/nfts', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    
    // First verify user exists
    const userCheck = await db.query('SELECT address FROM users WHERE id = $1', [id]);
    
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userAddress = userCheck.rows[0].address;
    
    // Get NFTs owned by this user
    const result = await db.query('SELECT * FROM nfts WHERE owner = $1', [userAddress]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user NFTs:', error);
    res.status(500).json({ error: 'Failed to fetch user NFTs' });
  }
});

module.exports = router; 