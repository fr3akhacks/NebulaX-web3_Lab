import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import Link from 'next/link';
import { shortenAddress } from '../lib/utils';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Dynamically import WalletMultiButton with { ssr: false } to prevent server-side rendering
const WalletMultiButton = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const Header: React.FC = () => {
  const { publicKey, connected, disconnect } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Set isMounted to true when component mounts
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // Update connection error
  useEffect(() => {
    if (!connected) {
      setConnectionError(null);
    }
  }, [connected]);

  // Placeholder for wallet button when not client-side mounted
  const WalletButtonPlaceholder = () => (
    <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105">
      Connect Wallet
    </button>
  );

  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center group">
              <div className="relative w-8 h-8 mr-2">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-80 group-hover:opacity-100 transition-opacity"></div>
                <div className="absolute inset-1 bg-gray-900 rounded-full flex items-center justify-center">
                  <span className="text-purple-400 font-bold text-lg">N</span>
                </div>
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                NebulaX
              </span>
            </Link>
            <nav className="hidden md:flex ml-10">
              <Link href="/" className="mr-6 text-gray-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-all">
                Home
              </Link>
              <Link href="/nfts" className="mr-6 text-gray-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-all">
                NFTs
              </Link>
              <Link href="/tokens" className="mr-6 text-gray-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-all">
                Tokens
              </Link>
              <Link href="/dashboard" className="mr-6 text-gray-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-all">
                Dashboard
              </Link>
              <Link href="/nft-notes" className="mr-6 text-gray-300 hover:text-white hover:underline decoration-blue-500 underline-offset-4 transition-all">
                NFT Notes
              </Link>
              <Link href="/search" className="mr-6 text-gray-300 hover:text-white hover:underline decoration-purple-500 underline-offset-4 transition-all">
                Search
              </Link>
              <Link href="/login" className="text-gray-300 hover:text-white hover:underline decoration-purple-500 underline-offset-4 transition-all">
                Login
              </Link>
            </nav>
          </div>

          <div className="hidden md:flex items-center">
            {isMounted && connected && publicKey ? (
              <div className="flex items-center bg-gray-800 bg-opacity-50 border border-gray-700 rounded-full overflow-hidden pr-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-2 px-4 mr-2">
                  {shortenAddress(publicKey.toString())}
                </div>
                <button
                  onClick={() => disconnect()}
                  className="text-sm text-gray-300 hover:text-white flex items-center"
                >
                  <span>Disconnect</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              isMounted ? (
                <WalletMultiButton className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105" />
              ) : (
                <WalletButtonPlaceholder />
              )
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-200 hover:text-white focus:outline-none"
            >
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M18.278 16.864a1 1 0 0 1-1.414 1.414l-4.829-4.828-4.828 4.828a1 1 0 0 1-1.414-1.414l4.828-4.829-4.828-4.828a1 1 0 0 1 1.414-1.414l4.829 4.828 4.828-4.828a1 1 0 1 1 1.414 1.414l-4.828 4.829 4.828 4.828z"
                  />
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M4 5h16a1 1 0 0 1 0 2H4a1 1 0 1 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2zm0 6h16a1 1 0 0 1 0 2H4a1 1 0 0 1 0-2z"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Connection error message */}
        {connectionError && (
          <div className="bg-red-900 border-l-4 border-red-500 text-white p-4 mb-4 rounded-r-md" role="alert">
            <p className="font-bold">Connection Error</p>
            <p>{connectionError}</p>
          </div>
        )}

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-gray-800">
            <nav className="flex flex-col">
              <Link href="/" 
                className="py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1">
                Home
              </Link>
              <Link href="/nfts" 
                className="py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1">
                NFTs
              </Link>
              <Link href="/tokens" 
                className="py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1">
                Tokens
              </Link>
              <Link href="/dashboard" 
                className="py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1">
                Dashboard
              </Link>
              <Link href="/nft-notes" 
                className="py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1">
                NFT Notes
              </Link>
              <Link href="/search" 
                className="py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1">
                Search
              </Link>
              <Link href="/login" 
                className="py-2 px-4 text-gray-300 hover:text-white hover:bg-gray-800 rounded-md mt-1">
                Login
              </Link>
            </nav>
            <div className="mt-4 pt-4 border-t border-gray-800">
              {isMounted && connected && publicKey ? (
                <div className="flex flex-col">
                  <div className="bg-gray-800 rounded-md px-4 py-2 mb-2 text-center">
                    <span className="text-sm text-gray-400">Connected as</span>
                    <span className="block text-white font-medium">{shortenAddress(publicKey.toString())}</span>
                  </div>
                  <button
                    onClick={() => disconnect()}
                    className="flex items-center justify-center bg-red-900 hover:bg-red-800 text-white py-2 px-4 rounded-md"
                  >
                    <span>Disconnect Wallet</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                isMounted ? (
                  <WalletMultiButton className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-4 rounded-md" />
                ) : (
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-4 rounded-md">
                    Connect Wallet
                  </button>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header; 