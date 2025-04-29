/**
 * Shorten an Ethereum address for display
 * 
 * @param address Full Ethereum address
 * @param chars Number of characters to show at start and end
 * @returns Shortened address
 */
export function shortenAddress(address: string, chars = 4): string {
  if (!address) return '';
  return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`;
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
 * Format Ethereum value to ETH
 * 
 * @param wei Amount in wei
 * @param decimals Decimal places to show
 * @returns Formatted ETH value
 */
export function formatEther(wei: string, decimals = 4): string {
  if (!wei) return '0 ETH';
  
  // Convert wei to ethers (1 ether = 10^18 wei)
  const ether = parseFloat(wei) / 1e18;
  return `${ether.toFixed(decimals)} ETH`;
} 