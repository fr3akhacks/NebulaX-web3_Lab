// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title NebulaXNFT
 * @dev ERC721 token for the NebulaX security lab
 */
contract NebulaXNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    
    // Mapping from token ID to price in ETH
    mapping(uint256 => uint256) public tokenPrices;
    
    // Mapping from token ID to memo text
    mapping(uint256 => string) public tokenMemos;
    
    // Event emitted when a token is listed for sale
    event TokenListed(uint256 indexed tokenId, uint256 price);
    
    // Event emitted when a token memo is updated
    event MemoUpdated(uint256 indexed tokenId, string memo);
    
    constructor() ERC721("NebulaX Explorer", "NEBX") {}
    
    /**
     * @dev Mints a new token and assigns it to the given address
     * @param to The address to receive the minted token
     * @param uri The token URI for metadata
     * @param price The initial price of the token in wei
     * @return The ID of the newly minted token
     */
    function safeMint(address to, string memory uri, uint256 price) public onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        tokenPrices[tokenId] = price;
        
        emit TokenListed(tokenId, price);
        
        return tokenId;
    }
    
    /**
     * @dev Sets the price for a token
     * @param tokenId The ID of the token
     * @param price The price of the token in wei
     */
    function setTokenPrice(uint256 tokenId, uint256 price) public {
        require(_exists(tokenId), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Not the token owner");
        
        tokenPrices[tokenId] = price;
        emit TokenListed(tokenId, price);
    }
    
    /**
     * @dev Sets a memo for a token
     * @param tokenId The ID of the token
     * @param memo The memo text
     */
    function setTokenMemo(uint256 tokenId, string memory memo) public {
        require(_exists(tokenId), "Token does not exist");
        
        // Intentional vulnerability: No ownerOf check allowing anyone to set a memo
        tokenMemos[tokenId] = memo;
        emit MemoUpdated(tokenId, memo);
    }
    
    /**
     * @dev Buys a token by paying its price
     * @param tokenId The ID of the token to buy
     */
    function buyToken(uint256 tokenId) public payable {
        require(_exists(tokenId), "Token does not exist");
        address owner = ownerOf(tokenId);
        require(owner != msg.sender, "Already owns this token");
        require(msg.value >= tokenPrices[tokenId], "Insufficient payment");
        
        address payable seller = payable(owner);
        seller.transfer(msg.value);
        
        _transfer(owner, msg.sender, tokenId);
    }
    
    /**
     * @dev Returns the current token counter value
     */
    function getTokenCounter() public view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    /**
     * @dev Intentional vulnerability: Direct fund transfer to arbitrary address
     * @param recipient The address to receive the funds
     * @param amount The amount to send
     */
    function emergencyWithdraw(address payable recipient, uint256 amount) public {
        // Vulnerability: No access control
        recipient.transfer(amount);
    }
    
    // Required overrides for inherited contracts
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }
    
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
    
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
} 