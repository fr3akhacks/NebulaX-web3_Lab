-- Connect to the database
\c nebulax;

-- Insert sample users
INSERT INTO users (username, address) VALUES
  ('alice', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'),
  ('bob', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0'),
  ('charlie', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E'),
  ('dave', '0x2546BcD3c84621e976D8185a91A922aE77ECEc30'),
  ('eve', '0xcd3B766CCDd6AE721141F452C550Ca635964ce71');

-- Insert sample tokens
INSERT INTO tokens (name, symbol, total_supply, decimals, contract_address, price) VALUES
  ('NebulaX Token', 'NBX', '1000000000000000000000000', 18, '0x5FbDB2315678afecb367f032d93F642f64180aa3', '0.1'),
  ('Security Token', 'SEC', '500000000000000000000000', 18, '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512', '0.05'),
  ('Venture Token', 'VEN', '100000000000000000000000', 18, '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0', '0.2');

-- Insert sample NFTs
INSERT INTO nfts (name, description, image, price, owner, token_id, metadata) VALUES
  ('Nebula Explorer #1', 'A unique space explorer from the NebulaX collection', '/images/nft-1.jpg', '1000000000000000000', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 1, '{"attributes": [{"trait_type": "Background", "value": "Deep Space"}, {"trait_type": "Suit", "value": "Platinum"}, {"trait_type": "Helmet", "value": "Classic"}]}'),
  ('Nebula Explorer #2', 'A rare space explorer from the NebulaX collection', '/images/nft-2.jpg', '2000000000000000000', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', 2, '{"attributes": [{"trait_type": "Background", "value": "Asteroid Field"}, {"trait_type": "Suit", "value": "Gold"}, {"trait_type": "Helmet", "value": "Futuristic"}]}'),
  ('Nebula Explorer #3', 'An epic space explorer from the NebulaX collection', '/images/nft-3.jpg', '3000000000000000000', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', 3, '{"attributes": [{"trait_type": "Background", "value": "Nebula Cloud"}, {"trait_type": "Suit", "value": "Diamond"}, {"trait_type": "Helmet", "value": "Advanced"}]}'),
  ('Nebula Explorer #4', 'A legendary space explorer from the NebulaX collection', '/images/nft-1.jpg', '5000000000000000000', '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', 4, '{"attributes": [{"trait_type": "Background", "value": "Black Hole"}, {"trait_type": "Suit", "value": "Obsidian"}, {"trait_type": "Helmet", "value": "Quantum"}]}'),
  ('Nebula Explorer #5', 'A mythic space explorer from the NebulaX collection', '/images/nft-2.jpg', '8000000000000000000', '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', 5, '{"attributes": [{"trait_type": "Background", "value": "Supernova"}, {"trait_type": "Suit", "value": "Cosmic"}, {"trait_type": "Helmet", "value": "Transcendent"}]}'),
  ('Nebula Explorer #6', 'An exclusive space explorer from the NebulaX collection', '/images/nft-3.jpg', '10000000000000000000', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', 6, '{"attributes": [{"trait_type": "Background", "value": "Galaxy Core"}, {"trait_type": "Suit", "value": "Celestial"}, {"trait_type": "Helmet", "value": "Divine"}]}');

-- Insert token balances
INSERT INTO token_balances (token_id, address, balance) VALUES
  (1, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', '100000000000000000000000'),
  (1, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '50000000000000000000000'),
  (1, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '25000000000000000000000'),
  (1, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', '15000000000000000000000'),
  (1, '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', '10000000000000000000000'),
  (2, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', '20000000000000000000000'),
  (2, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '30000000000000000000000'),
  (2, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '40000000000000000000000'),
  (2, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', '5000000000000000000000'),
  (2, '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', '5000000000000000000000'),
  (3, '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', '5000000000000000000000'),
  (3, '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '10000000000000000000000'),
  (3, '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '15000000000000000000000'),
  (3, '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', '30000000000000000000000'),
  (3, '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', '40000000000000000000000');

-- Insert user settings with sensitive information (for SQLi demo)
INSERT INTO user_settings (user_id, api_key, private_notes, secret_answer, notification_preferences) VALUES
  (1, 'ak_8d7f8s7d8f7s8df78sd7f8s7df8s7df8s7df', 'My private key backup is stored in my safety deposit box.', 'fluffy', '{"email": true, "sms": false, "push": true}'),
  (2, 'ak_j3k4j2k34jh2k3j4hk23j4hk23jh4k23j4', 'Important: Password for wallet backup is birthday+pet name', 'rover', '{"email": true, "sms": true, "push": false}'),
  (3, 'ak_234k2j34k2j3k4j23k4j2k34j2k34jh2kj3h4', 'Remember to move funds to cold storage by end of month', 'sunset', '{"email": false, "sms": true, "push": true}'),
  (4, 'ak_98sd9f8sd9f8sd9f8sd9f8sd98f', 'Seed phrase stored in password manager under "blockchain"', 'mountain', '{"email": false, "sms": false, "push": false}'),
  (5, 'ak_asjdoiajsoidjaoisjdoaisjdoiasjdo', 'Backup codes for 2FA printed and stored in desk drawer', 'bluesky', '{"email": true, "sms": true, "push": true}');

-- Insert sample transactions
INSERT INTO transactions (tx_hash, from_address, to_address, amount, token_id, tx_type, status, block_number) VALUES
  ('0x3a871eab23c79b600da88204a2e791f28509e00acf1d0da839c23d6f3d1d4b56', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '1000000000000000000', 1, 'transfer', 'confirmed', 12345),
  ('0x78f7a5863e6b95b3041e33456bc019dbcdade7abc9a7685a1f15bf7621ee85f6', '0xdD2FD4581271e230360230F9337D5c0430Bf44C0', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '2000000000000000000', 2, 'transfer', 'confirmed', 12346),
  ('0x9cd35a3b0847ed29935c5dbc441f75f7c6e9ec1e3958832e7f10c30e170a8b60', '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E', '0x2546BcD3c84621e976D8185a91A922aE77ECEc30', '5000000000000000000', 3, 'transfer', 'confirmed', 12347),
  ('0x34f7a5863e6b95b3041e33456bc019dbcdade7abc9a7685a1f15bf7621e2ff97', '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199', '0xcd3B766CCDd6AE721141F452C550Ca635964ce71', '500000000000000000', 1, 'transfer', 'confirmed', 12348); 