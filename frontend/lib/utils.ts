/**
 * Utility functions for the NebulaX frontend
 */

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

/**
 * Shortens an Solana address to a more readable format
 * e.g. AaBb...YyZz
 * 
 * @param address - The full Solana address
 * @param chars - Number of characters to show at start and end
 * @returns Shortened address string
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  if (address.length < 10) return address;
  
  const start = address.substring(0, chars);
  const end = address.substring(address.length - chars);
  
  return `${start}...${end}`;
}

/**
 * Format a large number with commas for better readability
 * 
 * @param num - Number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number | string): string {
  if (typeof num === 'string') {
    num = parseFloat(num);
  }
  
  return num.toLocaleString();
}

/**
 * Check if Phantom wallet is installed
 * 
 * @returns Boolean indicating if Phantom is available
 */
export function isPhantomInstalled(): boolean {
  const phantom = window?.phantom?.solana;
  return typeof phantom !== 'undefined';
}

/**
 * Format a number as currency
 * 
 * @param value Number to format
 * @param currency Currency code (default: USD)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(value);
}

/**
 * Format lamports value to SOL
 * 
 * @param lamports Amount in lamports
 * @param decimals Decimal places to show
 * @returns Formatted SOL value
 */
export function formatSOL(lamports: number | string, decimals = 4): string {
  if (!lamports) return '0 SOL';
  
  const value = typeof lamports === 'string' ? parseFloat(lamports) : lamports;
  // Convert lamports to SOL (1 SOL = 1 billion lamports)
  const sol = value / LAMPORTS_PER_SOL;
  return `${sol.toFixed(decimals)} SOL`;
}

/**
 * Clean and sanitize text input
 * 
 * @param input User input
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  if (!input) return '';
  return input.replace(/[<>]/g, '');
}