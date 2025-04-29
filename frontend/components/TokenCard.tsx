import React from 'react';
import { useRouter } from 'next/router';
import { formatSOL } from '../lib/utils';

interface TokenCardProps {
  token: {
    id: number;
    name: string;
    symbol: string;
    totalSupply: string;
    decimals: number;
    mint: string; // Solana token mint address
    price?: string;
  };
  balance?: string;
  showBalance?: boolean;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, balance = '0', showBalance = false }) => {
  const router = useRouter();

  const formatBalance = (amount: string, decimals: number) => {
    // Convert to proper format considering decimals
    const value = parseFloat(amount || '0') / Math.pow(10, decimals);
    return value.toFixed(decimals);
  };

  // Generate a token symbol background color based on the token name
  const getTokenColor = (name: string) => {
    const colors = [
      'from-blue-600 to-purple-600',
      'from-purple-600 to-pink-600',
      'from-red-600 to-orange-600',
      'from-green-600 to-teal-600',
      'from-yellow-600 to-amber-600'
    ];
    
    // Simple hash function to pick a color
    const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="token-card">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{token.name}</h2>
          <span className="token-symbol">
            {token.symbol}
          </span>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="token-detail-row">
            <span className="text-gray-600 dark:text-gray-400">Total Supply:</span>
            <span className="font-medium text-gray-800 dark:text-white">{formatBalance(token.totalSupply, token.decimals)}</span>
          </div>
          
          {token.price && (
            <div className="token-detail-row">
              <span className="text-gray-600 dark:text-gray-400">Price:</span>
              <span className="font-medium text-gray-800 dark:text-white">${token.price}</span>
            </div>
          )}
          
          {showBalance && (
            <div className="token-detail-row">
              <span className="text-gray-600 dark:text-gray-400">Your Balance:</span>
              <span className="font-medium text-gray-800 dark:text-white">{formatBalance(balance, token.decimals)}</span>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <button 
            onClick={() => router.push(`/tokens/${token.id}`)}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-md w-full transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-3 border-t border-gray-200 dark:border-gray-600">
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          <span className="font-medium">Mint:</span> {token.mint}
        </p>
      </div>
    </div>
  );
};

export default TokenCard; 