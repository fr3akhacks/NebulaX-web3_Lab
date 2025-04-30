# NebulaX Web3 Lab

![Uploading image.png…]()


A hybrid Web2/Web3 security lab for learning and practicing real-world vulnerabilities in a safe, local environment.

---

## Table of Contents

- [Installation](#installation)
- [Running the Lab](#running-the-lab)
- [Vulnerabilities & Exploitation](#vulnerabilities--exploitation)
  - [1. Reflected XSS](#1-reflected-xss)
  - [2. Stored XSS](#2-stored-xss)
  - [3. Server-Side Request Forgery (SSRF)](#3-server-side-request-forgery-ssrf)
  - [4. SQL Injection (Login)](#4-sql-injection-login)
  - [Other Vulnerabilities](#other-vulnerabilities)
- [Troubleshooting](#troubleshooting)
- [Security Best Practices](#security-best-practices)
- [Disclaimer](#disclaimer)

---

## Installation

```bash
chmod +x install.sh
./install.sh
```
- This will install Docker and Docker Compose (if needed) and build all required images.

---

## Running the Lab

```bash
chmod +x run.sh
./run.sh
```
- This will start all services using Docker Compose.
- Access the web application at: [http://localhost:3000](http://localhost:3000)

---

## Vulnerabilities & Exploitation

### 1. Reflected XSS

**Where:**  
XSS Demo page (`/xss-demo`)

**How to Exploit:**
1. Go to the XSS Demo page at: http://localhost:3000/xss-demo
2. Note that basic XSS payload does not work: 
   ```html
   <script>alert('XSS')</script>
   ```
3. Try the following payload to access cookies:
   ```html
   <img src="x" onerror="alert(document.cookie)">
   ```
4. This will display the session cookie which could be exfiltrated to an attacker's server.

---

### 2. Stored XSS

**Where:**  
Search page (`/search`)

**How to Exploit:**
1. Go to the Search page at: http://localhost:3000/search
2. Enter the following XSS payload:
   ```html
   <img src="x" onerror="alert(document.cookie)">
   ```
3. Submit the search.
4. This payload will be stored in recent searches, and whenever someone visits the search page or views recent searches, their cookies will be exposed.
5. This is more dangerous than reflected XSS as it affects all visitors, not just those who click a malicious link.

---

### 3. Server-Side Request Forgery (SSRF)

**Where:**  
Price Checker page (`/price-checker`)

**How to Exploit:**
1. Go to the Price Checker page at: http://localhost:3000/price-checker
2. Click "Show Advanced Options" to reveal the custom URL input.
3. Enter the following URL:
   ```
   http://localhost:4000/api/nft/etc/passwd
   ```
4. Click "Get Price"
5. The server will make a request to the internal endpoint and return the contents of the passwd file, which includes sensitive user information.
6. This vulnerability could be used to access internal services, scan the network, read local files, or exfiltrate sensitive data.

---

### 4. SQL Injection (Login)

**Where:**  
Login page (`/login`)

**How to Exploit:**
1. Go to the Login page at: http://localhost:3000/login
2. Enter the following in the username field:
   ```
   admin' --
   ```
3. Enter anything in the password field (it will be ignored due to the SQL comment).
4. Click "Login"
5. You'll be logged in as the admin user without knowing the password.
6. This SQL injection works because:
   - The `--` is a SQL comment that ignores the rest of the query
   - The query becomes `SELECT * FROM users WHERE username = 'admin' --' AND password = '...'`
   - Only the username part is checked, bypassing password verification

---

### Other Vulnerabilities

- **Unrestricted Wallet Actions:** Call smart contract functions from unauthorized wallets.
- **Transaction Approval Phishing:** UI does not clearly show transaction details before signing.
- **Unchecked Fund Transfer (Web3):** Emergency withdraw function in NFT program has no access control.

---

## Troubleshooting

- **Frontend/Backend won't start:** Check Docker is running, reinstall dependencies, check for port conflicts.
- **Vulnerability not working:** Ensure all services are running properly. Check browser console for errors.
- **Docker issues:** Try stopping all containers and rebuilding with `docker-compose up --build`.

---

## Security Best Practices

- Sanitize and validate all user input.
- Use parameterized queries for database operations.
- Implement proper authentication and authorization.
- Use Content Security Policy (CSP) to mitigate XSS.
- Validate and sanitize URLs for SSRF prevention.

---

## Disclaimer

**This project is for educational purposes only. Do not use in production.** 

The vulnerabilities demonstrated are intentionally included for learning about web security concepts. Using these techniques on systems without explicit permission is illegal and unethical.

## Overview

NebulaX Web3 Lab is a full-stack decentralized application that demonstrates the integration of blockchain technology with web applications. The project includes features for displaying NFTs and tokens, connecting to Solana wallets, and interacting with blockchain data.

## Features

- 🔗 Solana wallet integration
- 🖼️ NFT gallery and details
- 💰 Token listing and management
- 📱 Responsive design for all devices
- 🔄 Real-time data updates

## Project Structure

- `frontend/`: Next.js-based frontend application
- `backend/`: Express.js-based backend API
- `contracts/`: Smart contracts for the web3 functionality

## Featured Security Vulnerabilities

This project intentionally includes several security vulnerabilities for educational purposes:

1. **SQL Injection (SQLi)**: Multiple endpoints are vulnerable to SQL injection attacks, allowing unauthorized data access and manipulation
2. **Cross-Site Scripting (XSS)**: User input is rendered without proper sanitization, allowing JavaScript code execution
3. **Insecure Direct Object References**: The application allows accessing resources without proper authorization

## Vulnerability Guides

For educational purposes, the application includes comprehensive guides for understanding and exploiting these vulnerabilities:

- SQL Injection guide: `docs/sql_injection_guide.md`
- Complete vulnerability guide: `docs/vulnerability_guide.md`

## SQL Injection Vulnerabilities

For educational purposes, the application includes intentional SQL injection vulnerabilities in:

- The NFT Notes search functionality
- The user login system
- The memo creation endpoint

### Exploitation Guide

A comprehensive guide for exploiting these vulnerabilities can be found in `docs/sql_injection_guide.md`.

## Getting Started

### Prerequisites

- Node.js 16+
- npm or yarn
- SQLite (for the backend database)

### Starting the Backend

```bash
cd backend
npm install
npm run dev
```

The backend will run on http://localhost:3001

### Starting the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on http://localhost:3000

## WARNING

This application contains intentional security vulnerabilities for educational purposes. DO NOT:

1. Use any real credentials with this application
2. Deploy this application to a production environment
3. Use the vulnerable code patterns in real projects

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Solana ecosystem and documentation
- React and Next.js communities
- All contributors who have helped with the project

---

Created with ❤️ by the NebulaX Team 
