import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Layout from '../../components/Layout';
import { shortenAddress } from '../../lib/utils';

// Dashboard component
export default function Dashboard() {
  const { publicKey, connected } = useWallet();
  const [solBalance, setSolBalance] = useState('0');
  const [nftCount, setNftCount] = useState(0);
  const [tokenBalances, setTokenBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only fetch data after component has mounted on client
    if (!isMounted) return;
    
    const fetchData = async () => {
      if (connected && publicKey) {
        try {
          setLoading(true);
          
          // In a real app, we would fetch the SOL balance from an RPC
          setSolBalance((Math.random() * 10).toFixed(4));
          
          // Try to get NFT count and token balances from API
          try {
            const [nftResponse, tokenResponse] = await Promise.all([
              fetch(`/api/nfts/owner/${publicKey.toString()}`).then(res => res.json()).catch(() => []),
              fetch(`/api/tokens/balances/${publicKey.toString()}`).then(res => res.json()).catch(() => [])
            ]);
            
            setNftCount(nftResponse?.length || 0);
            setTokenBalances(tokenResponse || []);
          } catch (error) {
            console.error('API error:', error);
            // Set mock data if API fails
            setNftCount(Math.floor(Math.random() * 3) + 1);
            setTokenBalances([
              { name: 'NebulaX Token', symbol: 'NEBX', balance: '100', decimals: 9 },
              { name: 'Stardust', symbol: 'DUST', balance: '50', decimals: 9 },
              { name: 'NebulaX Governance', symbol: 'NXG', balance: '75', decimals: 9 }
            ]);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [publicKey, connected, isMounted]);

  // Show a loading state until client-side rendering completes
  if (!isMounted) {
    return (
      <div className="flex justify-center my-12">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-400">Initializing wallet connection...</p>
        </div>
      </div>
    );
  }

  if (!connected || !publicKey) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-amber-800 border-l-4 border-amber-500 text-white p-6 mb-6 w-full max-w-lg rounded-md shadow-lg" role="alert">
          <p className="font-bold text-xl mb-2">Not Connected</p>
          <p className="text-amber-100">Please connect your wallet to view your dashboard.</p>
          <div className="mt-4">
            <a href="/" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700">
              Go to Home Page
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg p-6 shadow-lg">
        <h1 className="text-3xl font-bold mb-2 text-white">Your Dashboard</h1>
        <p className="text-blue-200">View your assets and account information</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center my-12">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-400">Loading your data...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Account Info */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg col-span-3">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Account Information</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Address:</span>
                  <span className="font-mono text-sm text-white bg-gray-700 px-3 py-1 rounded-md">
                    {publicKey.toString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">SOL Balance:</span>
                  <span className="font-medium text-white bg-blue-900 px-3 py-1 rounded-md">
                    {solBalance} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">NFTs Owned:</span>
                  <span className="font-medium text-white bg-purple-900 px-3 py-1 rounded-md">
                    {nftCount}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Token Balances */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg col-span-3">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Token Balances</h2>
              {tokenBalances.length > 0 ? (
                <div className="space-y-4">
                  {tokenBalances.map((token, index) => (
                    <div key={index} className="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
                      <span className="flex items-center">
                        <span className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mr-3 font-bold text-white">
                          {token.symbol?.substring(0, 1)}
                        </span>
                        <div>
                          <div className="text-white font-medium">{token.name || `Token #${index + 1}`}</div>
                          <div className="text-gray-400 text-sm">{token.symbol}</div>
                        </div>
                      </span>
                      <span className="font-medium text-white bg-gray-800 px-3 py-1 rounded-md">
                        {parseFloat(token.balance).toLocaleString()} {token.symbol}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-700 rounded-lg p-8 text-center">
                  <p className="text-gray-400">No token balances found.</p>
                  <p className="text-gray-500 text-sm mt-2">Tokens will appear here once you have them in your wallet.</p>
                </div>
              )}
            </div>
            
            {/* Activity */}
            <div className="bg-gray-800 rounded-lg p-6 shadow-lg col-span-3">
              <h2 className="text-xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Recent Activity</h2>
              <div className="bg-gray-700 rounded-lg p-8 text-center">
                <p className="text-gray-400">Transaction history coming soon...</p>
                <p className="text-gray-500 text-sm mt-2">Your recent transactions will appear here.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 