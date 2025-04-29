import { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import axios from 'axios';
import { ethers } from 'ethers';

interface Token {
  id: number;
  name: string;
  symbol: string;
  totalSupply: string;
  decimals: number;
  contractAddress: string;
  price?: string;
  created_at: string;
  updated_at: string;
}

interface TokenBalance {
  tokenId: number;
  address: string;
  balance: string;
}

export default function TokenDetail() {
  const [token, setToken] = useState<Token | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = router.query;
  const { account, active, library } = useWeb3React();

  useEffect(() => {
    const fetchTokenData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const tokenResponse = await axios.get(`/api/tokens/${id}`);
        setToken(tokenResponse.data);
        
        if (account) {
          const balanceResponse = await axios.get(`/api/tokens/balances/${account}`);
          const userBalance = balanceResponse.data.find((b: TokenBalance) => b.tokenId === Number(id));
          if (userBalance) {
            setBalance(userBalance.balance);
          }
        }
      } catch (err) {
        console.error('Error fetching token data:', err);
        setError('Failed to load token information. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokenData();
  }, [id, account]);

  const formatBalance = (balance: string, decimals: number) => {
    return ethers.utils.formatUnits(balance || '0', decimals);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p>{error || 'Token not found'}</p>
          <button 
            onClick={() => router.push('/tokens')}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Back to Tokens
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        onClick={() => router.push('/tokens')}
        className="mb-6 flex items-center text-blue-600 hover:text-blue-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Tokens
      </button>

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-white">{token.name}</h1>
            <span className="bg-white text-indigo-600 rounded-full px-4 py-1 text-sm font-bold">
              {token.symbol}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Token Information</h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Total Supply:</span>
                  <span className="font-medium">{formatBalance(token.totalSupply, token.decimals)} {token.symbol}</span>
                </div>
                {token.price && (
                  <div className="flex justify-between border-b pb-2">
                    <span className="text-gray-600">Current Price:</span>
                    <span className="font-medium">${token.price}</span>
                  </div>
                )}
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Decimals:</span>
                  <span className="font-medium">{token.decimals}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Contract Address:</span>
                  <span className="font-medium text-sm break-all">{token.contractAddress}</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4">Your Balance</h2>
              {active ? (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                  <p className="text-3xl font-bold text-indigo-600 mb-1">{formatBalance(balance, token.decimals)}</p>
                  <p className="text-gray-600">{token.symbol}</p>
                </div>
              ) : (
                <div className="bg-yellow-100 p-4 rounded-lg">
                  <p className="text-yellow-800">Connect your wallet to view your token balance.</p>
                </div>
              )}

              <div className="mt-6 space-y-4">
                <button 
                  className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  disabled={!active}
                >
                  Transfer Tokens
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            <div className="text-gray-500 text-center py-8">
              Transaction history feature coming soon.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 