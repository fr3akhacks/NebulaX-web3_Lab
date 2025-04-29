-- Create database if it doesn't exist
CREATE DATABASE nebulax;

-- Connect to the database
\c nebulax;

-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) NOT NULL,
  address VARCHAR(42) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- NFTs table
CREATE TABLE nfts (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255) NOT NULL,
  price VARCHAR(100) NOT NULL,
  owner VARCHAR(42) NOT NULL,
  memo TEXT,
  token_id INTEGER,
  metadata JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Tokens table
CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(20) NOT NULL,
  total_supply VARCHAR(100) NOT NULL,
  decimals INTEGER NOT NULL DEFAULT 18,
  contract_address VARCHAR(42) NOT NULL UNIQUE,
  price VARCHAR(100),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

-- Token balances table
CREATE TABLE token_balances (
  id SERIAL PRIMARY KEY,
  token_id INTEGER NOT NULL REFERENCES tokens(id),
  address VARCHAR(42) NOT NULL,
  balance VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  UNIQUE(token_id, address)
);

-- Transactions table
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(66) NOT NULL UNIQUE,
  from_address VARCHAR(42) NOT NULL,
  to_address VARCHAR(42) NOT NULL,
  amount VARCHAR(100) NOT NULL,
  token_id INTEGER REFERENCES tokens(id),
  nft_id INTEGER REFERENCES nfts(id),
  tx_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  block_number INTEGER,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- User settings table with sensitive information (for SQLi demo)
CREATE TABLE user_settings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  api_key VARCHAR(64),
  private_notes TEXT,
  secret_answer VARCHAR(255),
  notification_preferences JSONB,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
); 