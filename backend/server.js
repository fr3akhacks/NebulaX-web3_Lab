const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const axios = require('axios').default;

// Create Express app
const app = express();
const PORT = 4000;

// Middleware
app.use(cors()); // Add CORS support for frontend requests
app.use(express.json());

// Define the public directory path
const publicDir = path.join(__dirname, 'public');

// Log server configuration
console.log(`Checking public directory: ${publicDir}`);
if (fs.existsSync(publicDir)) {
  console.log('Public directory exists!');
  fs.readdirSync(publicDir).forEach(file => {
    console.log(`- ${file}`);
  });
  
  // Check etc directory
  const etcDir = path.join(publicDir, 'etc');
  if (fs.existsSync(etcDir)) {
    console.log('etc directory exists!');
    fs.readdirSync(etcDir).forEach(file => {
      console.log(`- etc/${file}`);
    });
  } else {
    console.log('etc directory NOT found');
  }
} else {
  console.log('Public directory NOT found!');
}

// Serve static files from the public directory
app.use(express.static(publicDir));

// Add basic API endpoint for the frontend health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend server is running' });
});

// Mock NFT data for the frontend
app.get('/api/nfts', (req, res) => {
  res.json({
    nfts: [
      { id: 1, name: 'Cosmic Explorer #123', image: 'https://picsum.photos/300/300?random=1', price: 0.5 },
      { id: 2, name: 'Astral Guardian #456', image: 'https://picsum.photos/300/300?random=2', price: 1.2 },
      { id: 3, name: 'Digital Nomad #789', image: 'https://picsum.photos/300/300?random=3', price: 0.8 }
    ]
  });
});

// SSRF vulnerability endpoint for the price checker
app.get('/api/fetchPrice', async (req, res) => {
  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required' });
  }
  
  console.log(`Fetching price data from URL: ${url}`);
  
  try {
    // Intentional SSRF vulnerability - no URL validation
    let data;
    
    if (url.startsWith('file://')) {
      // Handle file:// URLs by reading from the filesystem
      const filePath = url.replace('file://', '');
      console.log(`Reading local file: ${filePath}`);
      
      try {
        data = fs.readFileSync(filePath, 'utf8');
        return res.json({ 
          success: true, 
          source: url,
          data: data
        });
      } catch (fileError) {
        return res.status(500).json({ 
          error: `Failed to read file: ${fileError.message}`,
          source: url
        });
      }
    }
    
    // Handle http(s) URLs
    const response = await axios.get(url);
    
    res.json({ 
      success: true, 
      source: url,
      data: response.data
    });
  } catch (error) {
    console.error(`Error fetching from ${url}:`, error.message);
    res.status(500).json({ 
      error: `Failed to fetch data from ${url}: ${error.message}`,
      source: url
    });
  }
});

// Mock user data for the frontend
app.post('/api/users/login', (req, res) => {
  // Accept any login for demo purposes
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: 1,
      username: req.body.username || 'demo',
      email: 'demo@example.com',
      address: '0x123abc...'
    }
  });
});

// Direct access to passwd file
app.get('/etc/passwd', (req, res) => {
  const passwdPath = path.join(publicDir, 'etc', 'passwd');
  
  if (fs.existsSync(passwdPath)) {
    console.log(`Serving passwd file from: ${passwdPath}`);
    res.sendFile(passwdPath);
  } else {
    console.log(`passwd file not found at: ${passwdPath}`);
    res.status(404).send('passwd file not found');
  }
});

// Root endpoint to show available files
app.get('/', (req, res) => {
  res.json({ 
    message: 'NebulaX Backend Server',
    publicFiles: [
      '/secret.txt',
      '/etc/passwd'
    ],
    apiEndpoints: [
      '/api/health',
      '/api/nfts',
      '/api/fetchPrice?url=http://example.com', // <- New SSRF endpoint
      '/api/users/login'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Files accessible at:`);
  console.log(`- http://localhost:${PORT}/secret.txt`);
  console.log(`- http://localhost:${PORT}/etc/passwd`);
  console.log(`SSRF vulnerability at: http://localhost:${PORT}/api/fetchPrice?url=http://localhost:4000/secret.txt`);
}); 