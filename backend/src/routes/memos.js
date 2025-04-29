const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./memos.db', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to SQLite database');
    // Create memos table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS memos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      content TEXT NOT NULL,
      wallet_address TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);
  }
});

// Get all memos
router.get('/', (req, res) => {
  db.all('SELECT * FROM memos ORDER BY created_at DESC', [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch memos' });
    }
    res.json(rows);
  });
});

// Get memos by wallet address
router.get('/wallet/:address', (req, res) => {
  const { address } = req.params;
  db.all('SELECT * FROM memos WHERE wallet_address = ? ORDER BY created_at DESC', [address], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch memos' });
    }
    res.json(rows);
  });
});

// Create a new memo
router.post('/', (req, res) => {
  const { content, wallet_address } = req.body;
  
  if (!content || !wallet_address) {
    return res.status(400).json({ error: 'Content and wallet address are required' });
  }

  db.run('INSERT INTO memos (content, wallet_address) VALUES (?, ?)', 
    [content, wallet_address], 
    function(err) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Failed to create memo' });
      }
      
      // Return the created memo
      db.get('SELECT * FROM memos WHERE id = ?', [this.lastID], (err, row) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Failed to fetch created memo' });
        }
        res.status(201).json(row);
      });
    }
  );
});

// Delete a memo
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM memos WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to delete memo' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Memo not found' });
    }
    res.json({ message: 'Memo deleted successfully' });
  });
});

// Intentionally vulnerable route - SQL Injection example
// WARNING: This route is intentionally vulnerable for educational purposes
router.get('/search', (req, res) => {
  const { query } = req.query;
  
  if (!query) {
    return res.status(400).json({ error: 'Search query is required' });
  }

  // WARNING: This is vulnerable to SQL injection
  const sql = `SELECT * FROM memos WHERE content LIKE '%${query}%'`;
  
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to search memos' });
    }
    res.json(rows);
  });
});

module.exports = router; 