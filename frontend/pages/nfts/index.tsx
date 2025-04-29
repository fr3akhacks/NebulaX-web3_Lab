import React, { useState, useEffect } from 'react';
import { useWeb3React } from '@web3-react/core';
import axios from 'axios';
import NFTCard from '../../components/NFTCard';

// Simple Loading component
const Loading = () => (
  <div className="flex flex-col items-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    <p className="mt-4 text-gray-400">Loading NFTs...</p>
  </div>
);

interface NFT {
  id: number;
  name: string;
  description: string;
  image: string;
  contractAddress: string;
  tokenId: string;
  mint: string;
  owner?: string;
  attributes?: Array<{
    trait_type: string;
    value: string;
  }>;
}

// Mock NFT data to display when API fails
const mockNFTs: NFT[] = [
  {
    id: 1,
    name: "Cosmic Voyager #1",
    description: "A journey through the stars and beyond, representing the pioneering spirit of space exploration.",
    image: "https://picsum.photos/seed/nebula1/800/800",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "1",
    mint: "5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAQmNTe1xjA6ZVC",
  },
  {
    id: 2,
    name: "Digital Oasis #2",
    description: "An immersive digital landscape where technology and nature coexist in perfect harmony.",
    image: "https://picsum.photos/seed/oasis2/800/800",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "2",
    mint: "7nYSMJUJAfnYzCoC8nCJxhd8YFytJh6Q1s53H3ViHVXW",
  },
  {
    id: 3,
    name: "Quantum Fragment #3",
    description: "A visualization of quantum computing principles, capturing the essence of parallel realities.",
    image: "https://picsum.photos/seed/quantum3/800/800",
    contractAddress: "0x1234567890abcdef1234567890abcdef12345678",
    tokenId: "3",
    mint: "2jk5arXjVKYJYCa4vVYgkGZCLBKpMm9JjWPvDvs7DHjA",
  }
];

const FEATURED_NFTS = [
  {
    id: 1,
    name: 'NebulaX Genesis',
    image: '/images/nft-1.jpg',
    description: 'The first NFT in the NebulaX collection'
  },
  {
    id: 2,
    name: 'Cosmic Explorer',
    image: '/images/nft-2.jpg',
    description: 'Navigate the cosmos with this exclusive NFT'
  }
];

const NFTsPage: React.FC = () => {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { account, active } = useWeb3React();

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/nfts');
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // If the API returns an empty array, use mock data
        if (data.length === 0) {
          console.log('API returned empty data, using mock NFTs');
          setNfts(mockNFTs);
        } else {
          setNfts(data);
        }
      } catch (err) {
        console.error('Error fetching NFTs:', err);
        setError('Failed to load NFTs. Using default showcase.');
        // Fallback to mock data on error
        setNfts(mockNFTs);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 md:px-0">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Explore NFT Collection
      </h1>
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center py-4">
          <p className="text-yellow-600 dark:text-yellow-400 mb-4">{error}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nfts.map((nft) => (
              <NFTCard key={nft.id} nft={nft} />
            ))}
          </div>
        </div>
      ) : nfts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            No NFTs found. Check back later for new additions.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nfts.map((nft) => (
            <NFTCard key={nft.id} nft={nft} />
          ))}
        </div>
      )}
    </div>
  );
};

export default NFTsPage; 