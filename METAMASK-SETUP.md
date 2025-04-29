# Phantom Wallet Setup Guide for NebulaX

This guide provides detailed instructions on how to configure Phantom wallet to work with the NebulaX local Solana validator environment.

## Installing Phantom Wallet

If you don't already have Phantom wallet installed:

1. Go to the [Phantom website](https://phantom.app/download) or search for Phantom in your browser's extension store
2. Install the extension for your browser (Chrome, Firefox, Brave, Edge)
3. Once installed, click on the Phantom icon in your browser's extension bar
4. Follow the instructions to create a new wallet or import an existing one
5. Make sure to securely store your recovery phrase

## Configuring the NebulaX Local Network

To connect to the local Solana validator running in the NebulaX environment:

1. Open Phantom by clicking on the extension icon in your browser
2. Click on the settings gear icon in the bottom-right corner
3. Click "Developer Settings" near the bottom
4. Click "Change Network" and select "Custom RPC"
5. Fill in the network details:
   - **Network Name**: `NebulaX Local`
   - **RPC URL**: `http://localhost:8899`
   - **WebSocket URL**: `ws://localhost:8900`
6. Click "Save"

You should now see "NebulaX Local" as your selected network, and you can use it to connect to your local Solana validator.

![Phantom Network Configuration](https://i.imgur.com/example-image.png)

## Importing Test Accounts

The NebulaX environment comes with pre-configured test accounts that have SOL and tokens already allocated:

1. In Phantom, click on the account name at the top
2. Select "Add/Connect Wallet"
3. Choose "Import Private Key"
4. Enter one of these private keys:
   - Alice: `[58,37,74,222,195,190,94,82,24,211,123,2,98,44,226,66,197,118,92,77,85,104,75,243,9,146,168,248,252,39,156,192]`
   - Bob: `[64,186,125,95,54,205,115,101,68,54,178,14,137,183,252,240,206,127,132,106,114,46,122,70,156,175,113,54,214,65,216,64]`
   - Charlie: `[80,209,127,112,182,210,225,186,37,173,192,103,99,106,232,39,30,21,160,228,134,64,132,65,222,173,125,76,148,66,99,86]`
   - Dave: `[94,186,32,144,112,132,119,52,185,95,94,33,134,117,248,46,183,247,232,142,165,152,156,95,53,152,31,73,130,199,11,196]`
   - Eve: `[196,185,234,116,174,119,151,140,98,88,34,108,241,39,204,215,101,232,79,46,95,75,12,20,203,196,75,33,136,109,120,236]`
5. Click "Import"

The imported account should now show a balance of SOL when connected to the NebulaX Local network.

## Connecting to the NebulaX Application

Once you've configured the network and imported an account:

1. Make sure you're on the "NebulaX Local" network in Phantom
2. Go to the NebulaX application at http://localhost:3000
3. Click "Connect Wallet" in the application
4. Phantom will prompt you to connect your account - select the account you want to use
5. Click "Connect" to approve the connection

Your wallet address should now appear in the app, and you'll be able to interact with the NFTs and tokens.

## Troubleshooting Connection Issues

If you experience issues connecting your wallet:

1. **Make sure the local Solana validator is running**
   - Check that you've run `./setup.sh` and all services are active
   - Verify with `docker-compose ps` that the blockchain service is running

2. **Check the network configuration**
   - Ensure you've entered the correct RPC URL and WebSocket URL
   - Try removing and re-adding the network if issues persist

3. **Browser issues**
   - Clear your browser cache and reload the page
   - Try disabling other extensions that might interfere with Phantom

4. **Reset Phantom connection**
   - In Phantom, go to Settings > Connected Apps
   - Find and remove the connection to the NebulaX application
   - Try connecting again

5. **Connection timeout**
   - If you get timeout errors, make sure all NebulaX services are running properly
   - Check `docker-compose logs blockchain` for any errors in the Solana validator service

## Advanced Troubleshooting

### Issues with Alice's Account or Other Test Accounts

If you've imported Alice's account but still can't connect:

1. **Try a different test account**
   - Import Bob's or Charlie's account instead to see if the issue is specific to Alice's account

2. **Check for Phantom permissions**
   - Click on the Phantom icon
   - Go to "Settings" > "Connected Apps"
   - Ensure localhost is not already listed, or if it is, remove it and try connecting again

3. **Manual Connection via Phantom**
   - Instead of using the app's "Connect Wallet" button, try connecting directly from Phantom:
     - Click on the Phantom icon
     - Make sure you're on the NebulaX Local network
     - Select the account you want to use
     - Go to Connected Apps
     - Connect to the current site

4. **Check for Phantom Popup Blockers**
   - Make sure your browser isn't blocking the Phantom popup
   - Look for popup blocker icons in the address bar when you click "Connect Wallet"

### Network Detection Problems

If Phantom isn't connecting to your local Solana validator:

1. **Verify the validator is accessible**
   - Open a new terminal window
   - Run: `curl -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"getVersion","params":[],"id":1}' http://localhost:8899`
   - You should get a response with the Solana version information

2. **Try alternative network settings**
   - Make sure you have entered the correct WebSocket URL (ws://localhost:8900)
   - If you can't add a custom RPC, try using Solana Devnet temporarily to test if Phantom works

3. **Restart the validator service**
   - Stop the services: `./stop.sh`
   - Start them again: `./setup.sh`
   - Check the logs for any errors: `docker-compose logs blockchain`

4. **Reset Phantom State**
   - In Phantom, go to Settings > Preferences > Advanced
   - Use the "Reset Account" option with caution (this clears connection history)

5. **Try a different browser**
   - Phantom might work differently in different browsers
   - Install Phantom in another browser and try the setup process again

6. **Use Console Logs for Debugging**
   - Open browser developer tools (F12)
   - Check the console for any errors when clicking "Connect Wallet"
   - Look for messages starting with "Phantom" or "Solana"

## Using Multiple Accounts for Testing

For certain security tests, you might want to use multiple accounts:

1. Import multiple test accounts from the list above
2. Use the account selector in Phantom to switch between accounts
3. Each account will have its own connection to the application

Remember to reconnect to the app after switching accounts by clicking on the wallet icon and selecting "Connect". 