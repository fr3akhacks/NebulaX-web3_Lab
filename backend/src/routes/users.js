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

// Login endpoint with SQL Injection vulnerability
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // VULNERABLE: Direct SQL concatenation
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    // Log the query for debugging (and to make the vulnerability more obvious)
    console.log('Executing SQL query:', query);
    
    // Get database from app.locals
    const db = req.app.locals.db;
    
    try {
      const result = await db.query(query);
      
      if (result.rows.length > 0) {
        res.json({
          success: true,
          message: 'Login successful',
          user: result.rows[0]
        });
      } else {
        res.status(401).json({
          success: false,
          error: 'Invalid username or password'
        });
      }
    } catch (dbErr) {
      console.error('Database error during login:', dbErr);
      
      // For demonstration - if the SQL injection syntax is correct but DB fails,
      // simulate a successful login with admin account
      if (req.body.username && (req.body.username.includes("'") || req.body.username.includes("--"))) {
        console.log("SQL injection attempt detected, simulating successful exploit");
        res.json({
          success: true,
          message: 'SQL Injection successful!',
          user: {
            id: 1,
            username: 'admin',
            email: 'admin@example.com',
            is_admin: 1,
            exploited: true,
            originalQuery: query,
            error: dbErr.message
          }
        });
      } else {
        res.status(500).json({
          success: false,
          error: 'Database error: ' + dbErr.message
        });
      }
    }
  } catch (err) {
    console.error('Login route error:', err);
    res.status(500).json({
      success: false,
      error: 'Server error: ' + err.message
    });
  }
});

module.exports = router; 