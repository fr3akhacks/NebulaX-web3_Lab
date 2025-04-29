import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

// Configure wallet adapters for Solana
export const getSolanaWallets = () => {
  return [
    new PhantomWalletAdapter(),
    new SolflareWalletAdapter()
  ];
};

// Configure connection to local Solana network
export const SOLANA_NETWORK_CONFIG = {
  endpoint: 'http://localhost:8899',
  wsEndpoint: 'ws://localhost:8900',
  network: WalletAdapterNetwork.Devnet, // Using Devnet as type, though we're connecting to local
}; 