/**
 * Script to generate placeholder NFT images
 * 
 * Run with: node frontend/scripts/generate-nft-images.js
 * 
 * Requires canvas package: npm install canvas
 */

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Configuration
const imageWidth = 800;
const imageHeight = 800;
const outputDir = path.join(__dirname, '../public/images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// NFT themes and colors
const nftThemes = [
  {
    name: "Cosmic Voyager",
    colors: ['#0B0B45', '#1A1A6C', '#2929B0', '#4A4AD7', '#7373FF'],
    patternType: 'space'
  },
  {
    name: "Digital Oasis",
    colors: ['#004D40', '#00695C', '#00796B', '#00897B', '#009688'],
    patternType: 'landscape'
  },
  {
    name: "Quantum Fragment",
    colors: ['#4A148C', '#6A1B9A', '#7B1FA2', '#8E24AA', '#9C27B0'],
    patternType: 'quantum'
  }
];

// Draw space-themed pattern
function drawSpacePattern(ctx, width, height, colors) {
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 0, height);
  gradient.addColorStop(0, colors[0]);
  gradient.addColorStop(1, colors[1]);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Stars
  for (let i = 0; i < 200; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 2;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  // Planet
  const planetX = width * 0.7;
  const planetY = height * 0.3;
  const planetRadius = width * 0.15;
  
  const planetGradient = ctx.createRadialGradient(
    planetX, planetY, 0,
    planetX, planetY, planetRadius
  );
  planetGradient.addColorStop(0, colors[3]);
  planetGradient.addColorStop(1, colors[2]);
  
  ctx.beginPath();
  ctx.arc(planetX, planetY, planetRadius, 0, Math.PI * 2);
  ctx.fillStyle = planetGradient;
  ctx.fill();
}

// Draw landscape-themed pattern
function drawLandscapePattern(ctx, width, height, colors) {
  // Sky gradient
  const skyGradient = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGradient.addColorStop(0, colors[4]);
  skyGradient.addColorStop(1, colors[3]);
  ctx.fillStyle = skyGradient;
  ctx.fillRect(0, 0, width, height * 0.6);
  
  // Ground
  ctx.fillStyle = colors[1];
  ctx.fillRect(0, height * 0.6, width, height * 0.4);
  
  // Sun
  const sunX = width * 0.8;
  const sunY = height * 0.2;
  const sunRadius = width * 0.1;
  
  const sunGradient = ctx.createRadialGradient(
    sunX, sunY, 0,
    sunX, sunY, sunRadius
  );
  sunGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
  sunGradient.addColorStop(1, 'rgba(255, 255, 255, 0.1)');
  
  ctx.beginPath();
  ctx.arc(sunX, sunY, sunRadius, 0, Math.PI * 2);
  ctx.fillStyle = sunGradient;
  ctx.fill();
  
  // Trees/structures
  for (let i = 0; i < 5; i++) {
    const x = width * (0.1 + i * 0.2);
    const y = height * 0.6;
    const treeHeight = height * (0.1 + Math.random() * 0.2);
    
    ctx.fillStyle = colors[0];
    ctx.fillRect(x - 10, y - treeHeight, 20, treeHeight);
    
    ctx.beginPath();
    ctx.arc(x, y - treeHeight - 15, 30, 0, Math.PI * 2);
    ctx.fillStyle = colors[2];
    ctx.fill();
  }
}

// Draw quantum-themed pattern
function drawQuantumPattern(ctx, width, height, colors) {
  // Background
  ctx.fillStyle = colors[0];
  ctx.fillRect(0, 0, width, height);
  
  // Quantum circuit lines
  ctx.strokeStyle = colors[4];
  ctx.lineWidth = 3;
  
  for (let i = 0; i < 8; i++) {
    const y = height * (0.2 + i * 0.1);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  
  // Quantum gates
  for (let i = 0; i < 12; i++) {
    const x = width * (0.1 + (i % 4) * 0.2);
    const y = height * (0.2 + Math.floor(i / 4) * 0.25);
    const size = width * 0.06;
    
    ctx.fillStyle = colors[i % colors.length];
    ctx.fillRect(x - size/2, y - size/2, size, size);
    
    // Add connection lines
    if (i > 0 && i % 4 !== 0) {
      ctx.beginPath();
      ctx.moveTo(x - size/2, y);
      ctx.lineTo(x - size/2 - width * 0.1, y);
      ctx.stroke();
    }
  }
  
  // Particle effects
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const radius = Math.random() * 5 + 2;
    
    const glow = ctx.createRadialGradient(
      x, y, 0,
      x, y, radius
    );
    glow.addColorStop(0, colors[Math.floor(Math.random() * colors.length)]);
    glow.addColorStop(1, 'transparent');
    
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = glow;
    ctx.fill();
  }
}

// Generate images
for (let i = 0; i < nftThemes.length; i++) {
  const theme = nftThemes[i];
  const canvas = createCanvas(imageWidth, imageHeight);
  const ctx = canvas.getContext('2d');
  
  // Draw pattern based on theme
  switch (theme.patternType) {
    case 'space':
      drawSpacePattern(ctx, imageWidth, imageHeight, theme.colors);
      break;
    case 'landscape':
      drawLandscapePattern(ctx, imageWidth, imageHeight, theme.colors);
      break;
    case 'quantum':
      drawQuantumPattern(ctx, imageWidth, imageHeight, theme.colors);
      break;
  }
  
  // Add NFT number
  ctx.font = 'bold 60px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 10;
  ctx.fillText(`#${i + 1}`, imageWidth / 2, imageHeight - 80);
  
  // Add theme name
  ctx.font = 'bold 70px Arial';
  ctx.fillText(theme.name, imageWidth / 2, 80);
  
  // Save the image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(outputDir, `nft-${i + 1}.jpg`), buffer);
  console.log(`Generated: nft-${i + 1}.jpg`);
}

console.log('NFT image generation complete!');
