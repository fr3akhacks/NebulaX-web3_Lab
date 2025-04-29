import { InjectedConnector } from '@web3-react/injected-connector';

// Connector for MetaMask and other injected wallets
export const injected = new InjectedConnector({
  supportedChainIds: [1, 3, 4, 5, 42, 56, 97, 1337, 31337], // Support standard networks plus local
}); 