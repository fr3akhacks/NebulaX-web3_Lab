import React from 'react';
import Link from 'next/link';
import { shortenAddress } from '../lib/utils';

interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  mint: string; // Solana NFT mint address
  tokenId: string;
  owner?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

interface NFTCardProps {
  nft: NFT;
  isOwned?: boolean;
}

const NFTCard: React.FC<NFTCardProps> = ({ nft, isOwned = false }) => {
  const { id, name, description, image } = nft;
  
  return (
    <div className="card overflow-hidden border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full h-60">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {isOwned && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
            Owned
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">{name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm h-12 overflow-hidden mb-4">
          {description}
        </p>
        
        <div className="flex justify-between items-center">
          <span className="text-primary-600 dark:text-primary-400 font-semibold">
            {shortenAddress(nft.mint)}
          </span>
          <Link
            href={`/nfts/${id}`}
            className="btn-primary py-1 px-3 text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NFTCard; 