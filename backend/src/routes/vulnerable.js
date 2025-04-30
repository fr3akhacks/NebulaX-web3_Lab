const express = require('express');
const axios = require('axios');
const router = express.Router();

/**
 * Vulnerable to SQL Injection
 * 
 * This endpoint does not properly sanitize user input before using it in a SQL query.
 * Attackers can inject SQL code to manipulate the database.
 * 
 * Example payloads:
 * - '; DROP TABLE users; --
 * - ' OR '1'='1
 * - ' UNION SELECT username, password FROM users; --
 */
router.post('/submitMemo', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { nftId, memo } = req.body;
    
    if (!nftId || !memo) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // VULNERABLE: Direct string interpolation in SQL query
    // DO NOT USE THIS IN PRODUCTION!
    const query = `UPDATE nfts SET memo = '${memo}' WHERE id = ${nftId} RETURNING *`;
    
    console.log('Executing query:', query); // For demonstration/debugging
    
    const result = await db.query(query);
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating memo:', error);
    res.status(500).json({ error: 'Failed to update memo', details: error.message });
  }
});

/**
 * Vulnerable to Server-Side Request Forgery (SSRF)
 * 
 * This endpoint fetches data from a URL specified by the user without validating
 * or sanitizing the URL. This allows attackers to make the server send requests
 * to internal resources or services.
 * 
 * Example vulnerable requests:
 * - /api/fetchPrice?url=http://localhost:8000/metadata
 * - /api/fetchPrice?url=file:///etc/passwd
 */
router.get('/fetchPrice', async (req, res) => {
  try {
    const { url } = req.query;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    console.log('Fetching data from:', url); // For demonstration/debugging
    
    // Special case for the demonstration passwd file
    if (url === 'http://localhost:4000/api/nft/etc/passwd') {
      // Simulating access to /etc/passwd
      return res.json({
        source: url,
        data: {
          file: '/etc/passwd',
          content: `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
admin:x:1000:1000:Administrator:/home/admin:/bin/bash
ssrf-user:x:1337:1337:SSRF Vulnerability Demo:/home/ssrf-user:/bin/bash`
        }
      });
    }
    
    // VULNERABLE: No URL validation or sanitization
    // DO NOT USE THIS IN PRODUCTION!
    try {
      const response = await axios.get(url);
      res.json({
        source: url,
        data: response.data
      });
    } catch (fetchError) {
      // Provide a helpful error message that demonstrates the vulnerability
      res.json({
        source: url,
        error: `Could not fetch from ${url}. This demonstrates how SSRF can be used to probe internal networks.`,
        details: fetchError.message
      });
    }
  } catch (error) {
    console.error('Error fetching price data:', error);
    res.status(500).json({ 
      error: 'Failed to fetch price data', 
      details: error.message, 
      source: req.query.url 
    });
  }
});

/**
 * Vulnerable to Cross-Site Scripting (XSS)
 * 
 * This endpoint takes user input and renders it directly in the response without
 * sanitizing or escaping HTML characters, allowing attackers to inject malicious scripts.
 * 
 * Example vulnerable requests:
 * - /api/userProfile?username=<script>alert('XSS')</script>
 * - /api/userProfile?username=<img src="x" onerror="alert('XSS')">
 */
router.get('/userProfile', (req, res) => {
  const { username } = req.query;
  
  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  // VULNERABLE: Directly inserting user input without sanitization
  // DO NOT USE THIS IN PRODUCTION!
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>User Profile</title>
      </head>
      <body>
        <h1>Welcome, ${username}!</h1>
        <p>This is your profile page.</p>
      </body>
    </html>
  `;
  
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

/**
 * Vulnerable to Insecure Deserialization
 * 
 * This endpoint accepts serialized data and deserializes it without proper validation,
 * allowing attackers to potentially execute arbitrary code or manipulate application logic.
 * 
 * Example vulnerable request:
 * - POST /api/processData with a malicious serialized object
 */
router.post('/processData', (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data) {
      return res.status(400).json({ error: 'Data is required' });
    }
    
    // VULNERABLE: Insecure deserialization of user data
    // DO NOT USE THIS IN PRODUCTION!
    let deserializedData;
    try {
      // Simulating insecure deserialization (in a real app, this might use eval or similar)
      deserializedData = JSON.parse(Buffer.from(data, 'base64').toString());
    } catch (e) {
      return res.status(400).json({ error: 'Invalid data format' });
    }
    
    // Process the data (example)
    const result = {
      processed: true,
      timestamp: new Date().toISOString(),
      data: deserializedData
    };
    
    res.json(result);
  } catch (error) {
    console.error('Error processing data:', error);
    res.status(500).json({ error: 'Failed to process data', details: error.message });
  }
});

module.exports = router; 