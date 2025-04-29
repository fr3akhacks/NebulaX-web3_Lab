# Phantom Wallet Setup Guide

This guide will help you set up the Phantom wallet to work with the NebulaX Solana Security Lab.

## Installing Phantom Wallet

1. Visit [Phantom.app](https://phantom.app/) and install the extension for your browser (Chrome, Brave, Firefox, or Edge).
2. Once installed, open the extension and either create a new wallet or import an existing one.
3. Make sure to securely back up your recovery phrase if creating a new wallet.

## Configuring Network Settings

For the NebulaX lab, you'll need to connect to either the Solana Devnet or a local Solana validator:

### Option 1: Connect to Devnet (Recommended for beginners)

1. Click on the gear icon (Settings) in the Phantom wallet
2. Select "Change Network"
3. Choose "Devnet" from the list of networks
4. The wallet interface should now display "Devnet" at the top

### Option 2: Connect to Local Validator (Advanced)

If you're running a local Solana validator:

1. Click on the gear icon (Settings) in the Phantom wallet
2. Select "Change Network"
3. Choose "Custom RPC"
4. Enter the following details:
   - Network Name: `NebulaX Local`
   - RPC URL: `http://localhost:8899`
   - WSS URL: `ws://localhost:8900`
5. Click "Save"
6. The wallet should now show your custom network name at the top

## Importing Test Accounts

The NebulaX lab comes with pre-configured test accounts that you can import:

1. Click on the Phantom logo at the top of the wallet
2. Select "Add/Connect Wallet"
3. Choose "Import Private Key"
4. Enter one of the following private keys:
   - Alice: `[58,37,74,222,195,190,94,82,24,211,123,2,98,44,226,66,197,118,92,77,85,104,75,243,9,146,168,248,252,39,156,192]`
   - Bob: `[64,186,125,95,54,205,115,101,68,54,178,14,137,183,252,240,206,127,132,106,114,46,122,70,156,175,113,54,214,65,216,64]`
   - Charlie: `[80,209,127,112,182,210,225,186,37,173,192,103,99,106,232,39,30,21,160,228,134,64,132,65,222,173,125,76,148,66,99,86]`

## Connecting to the NebulaX Application

1. Go to the NebulaX application at http://localhost:3000
2. Click on the "Connect Wallet" button
3. Select Phantom from the list of wallets
4. Approve the connection request in the Phantom wallet popup

## Troubleshooting Connection Issues

If you're having trouble connecting your wallet:

1. **Wallet Not Appearing**: Make sure the Phantom extension is installed and unlocked
2. **Connection Errors**: 
   - Verify you're on the correct network (Devnet or your local validator)
   - Try refreshing the page and reconnecting
   - Check that your local validator is running (if using a local setup)
3. **Empty Balance**: 
   - On Devnet, you can airdrop SOL to your wallet using the Phantom interface
   - For local validators, ensure the test accounts have been funded

## Adding SPL Tokens to Your Wallet

To see SPL tokens in your Phantom wallet:

1. Click on "Tokens" in your Phantom wallet
2. Click "Add Token"
3. Select "Custom Token"
4. Enter the token address (for NebulaX tokens, this will be visible in the application interface)
5. Click "Add"

## Handling Multiple Accounts

If you want to test multiple accounts:

1. Create or import multiple wallets in Phantom
2. Use the account switcher at the top of the Phantom interface to switch between accounts
3. Re-connect to the NebulaX application after switching accounts

## Security Considerations

- The private keys provided in this lab are for testing only and should never be used on Mainnet
- Never share your actual wallet recovery phrase or private keys with anyone
- For educational purposes, the lab contains intentional vulnerabilities - keep this in mind when interacting with the application

For additional help, please refer to the [Phantom Support Documentation](https://help.phantom.app/). 