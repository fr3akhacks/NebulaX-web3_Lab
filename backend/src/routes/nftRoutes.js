const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs').promises;

// Simple logging function instead of using the logger module
const log = {
  info: (msg, data) => console.log(`[INFO] ${msg}`, data || ''),
  error: (msg, data) => console.error(`[ERROR] ${msg}`, data || '')
};

// Special test route to verify the router is working
router.get('/test', (req, res) => {
  console.log("Test route called successfully");
  res.send("Router is working correctly");
});

// Special route for demonstration purposes - SPECIFIC ROUTE NEEDS TO BE FIRST
router.get('/etc/passwd', (req, res) => {
  console.log("====== DIRECTLY SERVING /etc/passwd content ======");
  
  const passwdContent = `root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
admin:x:1000:1000:Administrator:/home/admin:/bin/bash
ssrf-user:x:1337:1337:SSRF Vulnerability Demo:/home/ssrf-user:/bin/bash`;

  console.log("About to send passwd content with Content-Type: text/plain");
  res.set('Content-Type', 'text/plain');
  res.send(passwdContent);
  console.log("Passwd content served successfully");
});

// Serve dummy sensitive files directly - this should come AFTER specific routes
router.get('/etc/:filename', async (req, res) => {
    try {
        const { filename } = req.params;
        const allowedFiles = ['passwd', 'shadow'];
        
        if (!allowedFiles.includes(filename)) {
            return res.status(404).json({ error: 'File not found' });
        }

        // Don't use this route for passwd since we have a specific route for it
        if (filename === 'passwd') {
            console.log("Redirecting from parameterized route to specific route");
            return res.redirect('/api/nft/etc/passwd');
        }

        // Fix the path to correctly point to the dummy-files folder
        const filePath = path.join(__dirname, '../dummy-files/etc', filename);
        console.log('Trying to access file at path:', filePath);
        
        try {
            const content = await fs.readFile(filePath, 'utf8');
            
            // Return raw file content
            res.set('Content-Type', 'text/plain');
            res.send(content);
            
            log.info(`Served dummy file: ${filename}`);
        } catch (readError) {
            console.error('File read error:', readError);
            res.status(500).json({ error: 'Failed to read file', details: readError.message });
        }
    } catch (error) {
        log.error('Error serving file:', { error: error.message, filename: req.params.filename });
        res.status(500).json({ error: 'Failed to serve file' });
    }
});

// Vulnerable SSRF endpoint - simplified version
router.get('/metadata', async (req, res) => {
    try {
        const { url } = req.query;
        
        if (!url) {
            return res.status(400).json({ error: 'URL parameter is required' });
        }

        console.log(`Fetching NFT metadata from URL: ${url}`);
        
        try {
            // Vulnerable: No URL validation
            const response = await fetch(url);
            const data = await response.text();
            
            res.json({
                success: true,
                source: url,
                data: data
            });
        } catch (fetchError) {
            console.error('Fetch error:', fetchError);
            res.status(500).json({ 
                error: 'Failed to fetch from URL', 
                details: fetchError.message,
                url: url
            });
        }
    } catch (error) {
        console.error('Error in metadata endpoint:', error);
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
});

module.exports = router; 