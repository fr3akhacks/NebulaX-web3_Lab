const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const db = new sqlite3.Database(':memory:'); // Using in-memory database for demo

// Create table
db.run(`CREATE TABLE IF NOT EXISTS memos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nftId INTEGER NOT NULL,
  memo TEXT NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// Create users table with sensitive information
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0
)`);

// Insert some sample data
db.run(`INSERT INTO memos (nftId, memo) VALUES 
  (1, 'First edition NFT - very rare!'),
  (2, 'Limited cosmic series'),
  (3, 'Special anniversary edition')`);

// Insert some sample users with sensitive data
db.run(`INSERT INTO users (username, password, email, is_admin) VALUES 
  ('admin', 'admin123!', 'admin@nebulax.io', 1),
  ('john', 'pass123', 'john@example.com', 0),
  ('alice', 'secure456', 'alice@example.com', 0)`);

// Log database initialization
console.log('SQLite database initialized with sample data');
console.log('Users table created with 3 sample users');
console.log('Memos table created with 3 sample memos');

// Intentionally vulnerable to SQL injection through direct string interpolation
router.get('/submitMemo', (req, res) => {
  const searchTerm = req.query.search || '';
  // Vulnerable: Direct string interpolation in SQL query
  const query = `SELECT * FROM memos WHERE memo LIKE '%${searchTerm}%'`;
  
  console.log("Executing SQL query:", query); // Log the query for easier exploitation
  
  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    res.json(rows);
  });
});

// Vulnerable login endpoint
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Highly vulnerable: SQL injection in login
  const query = `SELECT id, username, email, is_admin FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  console.log("Executing login query:", query); // Log the query for easier exploitation
  
  db.get(query, (err, user) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database error occurred' });
    }
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    res.json({ 
      user,
      message: 'Login successful' 
    });
  });
});

router.post('/submitMemo', (req, res) => {
  const { nftId, memo } = req.body;
  
  if (!nftId || !memo) {
    return res.status(400).json({ error: 'NFT ID and memo are required' });
  }

  // Also vulnerable: Direct string interpolation
  const query = `INSERT INTO memos (nftId, memo) VALUES (${nftId}, '${memo}')`;
  
  console.log("Executing insert query:", query); // Log the query for easier exploitation
  
  db.run(query, function(err) {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Failed to save memo' });
    }
    res.json({ 
      id: this.lastID,
      message: 'Memo saved successfully' 
    });
  });
});

module.exports = router; 