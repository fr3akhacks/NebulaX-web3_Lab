import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import TokenCard from '../../components/TokenCard';

interface Token {
  id: number;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  contractAddress: string;
  mint: string; // Solana token mint address
  price?: string;
}

interface TokenBalance {
  tokenId: number;
  address: string;
  balance: string;
}

// Mock data to display while API is not functioning
const mockTokens: Token[] = [
  {
    id: 1,
    name: "NebulaX Governance",
    symbol: "NXG",
    totalSupply: "1000000000000000000000000",
    decimals: 18,
    contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
    mint: "So11111111111111111111111111111111111111112", // Example Solana token mint
    price: "2.45"
  },
  {
    id: 2,
    name: "NebulaX Utility",
    symbol: "NXU",
    totalSupply: "500000000000000000000000",
    decimals: 18,
    contractAddress: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", // Example Solana token mint (USDC)
    price: "0.85"
  },
  {
    id: 3,
    name: "NebulaX Reward",
    symbol: "NXR",
    totalSupply: "750000000000000000000000",
    decimals: 18,
    contractAddress: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
    mint: "AGFEad2et2ZJif9jaGpdMixQqvW5i81aBdvKe7PHNfz3", // Example Solana token mint
    price: "1.20"
  }
];

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [balances, setBalances] = useState<TokenBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const { account, active } = useWeb3React();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Try to get data from API first
        try {
          const [tokensResponse, balancesResponse] = await Promise.all([
            axios.get('/api/tokens'),
            account ? axios.get(`/api/tokens/balances/${account}`) : Promise.resolve({ data: [] })
          ]);
          
          // If we have actual data, use it
          if (tokensResponse.data && tokensResponse.data.length > 0) {
            setTokens(tokensResponse.data);
            setBalances(balancesResponse.data);
          } else {
            // Otherwise fall back to mock data
            setTokens(mockTokens);
            // Create mock balances for the connected account
            if (account) {
              const mockBalances = mockTokens.map(token => ({
                tokenId: token.id,
                address: account,
                balance: (Math.floor(Math.random() * 1000) * 1e18).toString()
              }));
              setBalances(mockBalances);
            }
          }
        } catch (error) {
          console.error("API error, using mock data:", error);
          // Use mock data on API error
          setTokens(mockTokens);
          // Create mock balances for the connected account
          if (account) {
            const mockBalances = mockTokens.map(token => ({
              tokenId: token.id,
              address: account,
              balance: (Math.floor(Math.random() * 1000) * 1e18).toString()
            }));
            setBalances(mockBalances);
          }
        }
      } catch (error) {
        console.error('Error setting up token data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [account]);

  const getBalanceForToken = (tokenId: number) => {
    const tokenBalance = balances.find(b => b.tokenId === tokenId);
    return tokenBalance ? tokenBalance.balance : '0';
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Token Dashboard</h1>
      
      {!active && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p>Connect your wallet to view your token balances.</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <TokenCard 
              key={token.id}
              token={token}
              balance={getBalanceForToken(token.id)}
              showBalance={active}
            />
          ))}
          
          {tokens.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No tokens found in the network.
            </div>
          )}
        </div>
      )}
    </div>
  );
} 