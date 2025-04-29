# Troubleshooting Guide

This document provides solutions for common issues you might encounter when running the NebulaX Web3/Web2 Security Lab.

## Frontend Issues

### Application Won't Start

**Problem**: The frontend application fails to start or displays errors in the terminal.

**Solutions**:
1. Verify Node.js version (must be v16+):
   ```
   node -v
   ```

2. Reinstall dependencies:
   ```
   cd frontend
   rm -rf node_modules
   npm install
   ```

3. Check for port conflicts:
   ```
   # Check if port 3000 is already in use
   lsof -i :3000
   
   # If needed, kill the process
   kill -9 <PID>
   ```

4. Start in verbose mode:
   ```
   cd frontend
   npm run dev -- --verbose
   ```

### Images Not Loading

**Problem**: NFT or token images are not displaying in the application.

**Solutions**:
1. Verify the images exist in the correct location:
   ```
   ls -la frontend/public/images/
   ```

2. Manually download the images:
   ```
   cd frontend/public/images
   curl -s -o nft-1.jpg https://picsum.photos/seed/nebulax1/800/800
   curl -s -o nft-2.jpg https://picsum.photos/seed/nebulax2/800/800
   curl -s -o nft-3.jpg https://picsum.photos/seed/nebulax3/800/800
   curl -s -o token-nebx.png https://picsum.photos/seed/nebxtoken/200/200
   curl -s -o token-dust.png https://picsum.photos/seed/dusttoken/200/200
   ```

3. Check browser console for 404 errors and verify the paths in your code match the file locations.

## Backend Issues

### Backend Server Won't Start

**Problem**: The backend server fails to start or crashes after starting.

**Solutions**:
1. Check if the backend dependencies are installed:
   ```
   cd backend
   npm install
   ```

2. Verify port availability:
   ```
   # Check if port 4000 is already in use
   lsof -i :4000
   ```

3. Make sure the .env file exists:
   ```
   cd backend
   # Create .env if it doesn't exist
   cat > .env << EOF
   PORT=4000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=nebulax
   MINIO_ENDPOINT=localhost
   MINIO_PORT=9000
   MINIO_ACCESS_KEY=minio
   MINIO_SECRET_KEY=minio123
   EOF
   ```

4. Run with extra debugging:
   ```
   cd backend
   DEBUG=express:* npm run dev
   ```

### API Errors

**Problem**: Frontend shows errors when trying to access the backend API.

**Solutions**:
1. Check if the backend is running:
   ```
   curl http://localhost:4000/health
   ```

2. Look for CORS issues in the browser console and ensure the backend has proper CORS configuration.

3. Verify that the frontend is making requests to the correct API URL (http://localhost:4000).

4. Check for any network issues with your localhost configuration.

## Wallet Connection Issues

### Cannot Connect Wallet

**Problem**: Phantom wallet won't connect to the application.

**Solutions**:
1. Ensure Phantom extension is installed and unlocked.

2. Verify correct network settings:
   - Open Phantom settings
   - Check if you're on Devnet or your custom RPC

3. Reset the connection:
   - In Phantom, go to Settings → Connected Apps
   - Disconnect from the NebulaX application
   - Refresh the page and try again

4. Check browser console for connection errors.

### Wallet Shows No Balance

**Problem**: Your connected wallet shows zero SOL balance.

**Solutions**:
1. For Devnet:
   - Use Phantom's "Request Airdrop" feature
   - Or use Solana CLI: `solana airdrop 1 <wallet-address> --url devnet`

2. For local validator:
   - Ensure the validator is running
   - Import one of the pre-funded test accounts

3. Check that you're on the correct network.

## Vulnerability Testing Issues

### SQL Injection Not Working

**Problem**: When attempting SQL injection on /api/submitMemo, it doesn't produce expected results.

**Solutions**:
1. Verify backend is running:
   ```
   curl http://localhost:4000/health
   ```

2. Check you're using proper HTTP method (POST) and content type (application/json).

3. Use a tool like curl or Postman for more controlled testing:
   ```
   curl -X POST http://localhost:4000/api/submitMemo \
     -H "Content-Type: application/json" \
     -d '{"nftId": 1, "memo": "'\''; SELECT * FROM users; --"}'
   ```

4. Look at backend server console for SQL query output and errors.

### SSRF Testing Issues

**Problem**: SSRF vulnerability on /api/fetchPrice is not responding as expected.

**Solutions**:
1. Start with a simple test to verify the endpoint works:
   ```
   curl "http://localhost:4000/api/fetchPrice?url=http://localhost:4000/health"
   ```

2. Check the backend logs for error messages.

3. Try different URL-encoded payloads if direct ones don't work.

4. Ensure any services you're trying to reach with SSRF are actually running.

## Token and NFT Display Issues

### Tokens Not Showing

**Problem**: The tokens page is empty or doesn't display expected tokens.

**Solutions**:
1. Verify wallet connection status.

2. Check browser console for API errors.

3. If using mock data, ensure the mock data is properly defined in the component.

4. Try refreshing the page or reconnecting your wallet.

### NFTs Not Displaying

**Problem**: NFTs are not showing in the NFT gallery.

**Solutions**:
1. Verify that the image files exist in `frontend/public/images/`.

2. Check browser console for image loading errors.

3. Ensure the NFT component is correctly mapping the data.

4. Try clearing your browser cache and reloading.

## For Further Assistance

If you're still experiencing issues:

1. Check the browser console (F12) for detailed error messages.

2. Look for specific error messages in the terminal where you started the application.

3. Verify file permissions if running on Linux/Mac:
   ```
   chmod -R 755 frontend/public/images
   ```

4. As a last resort, try a fresh installation:
   ```
   git clone https://github.com/yourusername/NebulaX-web3_Lab.git
   cd NebulaX-web3_Lab
   ./setup.sh
   ``` 