const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  // Deploy ERC20 Token
  const initialSupply = ethers.utils.parseEther("1000000"); // 1 million tokens with 18 decimals
  const NebulaXToken = await ethers.getContractFactory("NebulaXToken");
  const token = await NebulaXToken.deploy(initialSupply);
  await token.deployed();
  
  console.log("NebulaXToken deployed to:", token.address);
  
  // Deploy NFT Collection
  const NebulaXNFT = await ethers.getContractFactory("NebulaXNFT");
  const nft = await NebulaXNFT.deploy();
  await nft.deployed();
  
  console.log("NebulaXNFT deployed to:", nft.address);
  
  // Mint sample NFTs
  const baseURI = "http://localhost:4000/api/nfts/metadata/";
  
  // Mint 6 NFTs to the deployer
  for (let i = 1; i <= 6; i++) {
    const price = ethers.utils.parseEther(`${i * 0.1}`); // Prices: 0.1, 0.2, 0.3, 0.4, 0.5, 0.6 ETH
    const tx = await nft.safeMint(deployer.address, `${baseURI}${i}`, price);
    await tx.wait();
    console.log(`Minted NFT #${i} with price ${ethers.utils.formatEther(price)} ETH`);
  }
  
  // Transfer some tokens to predefined addresses
  const addresses = [
    "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199", // alice
    "0xdD2FD4581271e230360230F9337D5c0430Bf44C0", // bob
    "0xbDA5747bFD65F08deb54cb465eB87D40e51B197E", // charlie
    "0x2546BcD3c84621e976D8185a91A922aE77ECEc30", // dave
    "0xcd3B766CCDd6AE721141F452C550Ca635964ce71"  // eve
  ];
  
  for (let i = 0; i < addresses.length; i++) {
    const amount = ethers.utils.parseEther(`${10000 * (5 - i)}`); // 50000, 40000, 30000, 20000, 10000
    await token.transfer(addresses[i], amount);
    console.log(`Transferred ${ethers.utils.formatEther(amount)} tokens to ${addresses[i]}`);
  }
  
  // Save contract addresses to a file for easier access
  const deploymentInfo = {
    NebulaXToken: token.address,
    NebulaXNFT: nft.address,
    deployer: deployer.address,
    chainId: (await ethers.provider.getNetwork()).chainId,
    timestamp: new Date().toISOString()
  };
  
  fs.writeFileSync(
    path.join(__dirname, "../deployment.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("Deployment information saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 