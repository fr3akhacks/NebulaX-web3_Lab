# NebulaX Web3 Lab

A web3 application showcasing NFTs, tokens, and intentional security vulnerabilities for educational purposes.

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