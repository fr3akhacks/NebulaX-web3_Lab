// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title NebulaXToken
 * @dev ERC20 token for the NebulaX security lab
 */
contract NebulaXToken is ERC20, ERC20Burnable, Ownable {
    mapping(address => bool) public blacklisted;
    
    event AddedToBlacklist(address indexed account);
    event RemovedFromBlacklist(address indexed account);
    
    constructor(uint256 initialSupply) ERC20("NebulaX Token", "NBX") {
        _mint(msg.sender, initialSupply);
    }
    
    /**
     * @dev Creates `amount` new tokens and assigns them to `account`.
     * @param account The address to receive the minted tokens
     * @param amount The amount of tokens to mint
     */
    function mint(address account, uint256 amount) public onlyOwner {
        _mint(account, amount);
    }
    
    /**
     * @dev Blacklists an address, preventing it from transferring tokens
     * @param account The address to blacklist
     */
    function blacklistAddress(address account) public onlyOwner {
        blacklisted[account] = true;
        emit AddedToBlacklist(account);
    }
    
    /**
     * @dev Removes an address from the blacklist
     * @param account The address to remove from blacklist
     */
    function unblacklistAddress(address account) public onlyOwner {
        blacklisted[account] = false;
        emit RemovedFromBlacklist(account);
    }
    
    /**
     * @dev Intentional security vulnerability: 
     * Function to whitelist an address called by anyone
     * This should only be callable by the owner but the onlyOwner modifier is missing
     */
    function emergencyRemoveFromBlacklist(address account) public {
        // Vulnerability: Missing access control
        blacklisted[account] = false;
        emit RemovedFromBlacklist(account);
    }
    
    /**
     * @dev Override the transfer function to check for blacklisted addresses
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        require(!blacklisted[from], "NebulaXToken: sender is blacklisted");
        require(!blacklisted[to], "NebulaXToken: recipient is blacklisted");
        super._beforeTokenTransfer(from, to, amount);
    }
} 