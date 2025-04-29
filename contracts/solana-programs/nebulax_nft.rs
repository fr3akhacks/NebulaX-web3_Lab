use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    program_pack::{Pack, IsInitialized},
    sysvar::{rent::Rent, Sysvar},
};
use metaplex_token_metadata::{
    state::{Metadata, Creator},
    instruction::{create_metadata_accounts_v3, update_metadata_accounts_v2},
};
use spl_token::{
    state::{Account as TokenAccount, Mint},
    instruction::{initialize_mint, mint_to},
};
use spl_associated_token_account::instruction::create_associated_token_account;
use std::convert::TryInto;

// Define program ID (will be set during deployment)
solana_program::declare_id!("nebNFTKFZw7eLJ5xRE1K45AnGJRpzT1kprLfgbLTnfT");

// Program instructions enum
#[derive(Clone, Debug, PartialEq)]
pub enum NebulaXNFTInstruction {
    // Initialize the NFT collection
    InitializeCollection {
        // Collection name
        name: String,
        // Collection symbol
        symbol: String,
        // Collection URI (containing metadata)
        uri: String,
    },
    // Mint a new NFT
    MintNFT {
        // NFT name
        name: String,
        // NFT description
        description: String,
        // NFT URI (containing metadata and image)
        uri: String,
        // Royalty basis points (e.g. 250 = 2.5%)
        royalty_basis_points: u16,
    },
    // Transfer NFT ownership
    TransferNFT {
        // NFT mint address
        mint: Pubkey,
        // New owner
        new_owner: Pubkey,
    },
    // Burn an NFT
    BurnNFT {
        // NFT mint address
        mint: Pubkey,
    },
}

// State struct for the collection
#[derive(Clone, Debug, Default, PartialEq)]
pub struct CollectionState {
    pub is_initialized: bool,
    pub admin: Pubkey,
    pub collection_mint: Pubkey,
    pub total_supply: u32,
}

impl IsInitialized for CollectionState {
    fn is_initialized(&self) -> bool {
        self.is_initialized
    }
}

// Program entry point
entrypoint!(process_instruction);

// Program logic
pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let instruction = NebulaXNFTInstruction::unpack(instruction_data)?;

    match instruction {
        NebulaXNFTInstruction::InitializeCollection { name, symbol, uri } => {
            msg!("Instruction: Initialize Collection");
            process_initialize_collection(program_id, accounts, name, symbol, uri)
        },
        NebulaXNFTInstruction::MintNFT { name, description, uri, royalty_basis_points } => {
            msg!("Instruction: Mint NFT");
            process_mint_nft(program_id, accounts, name, description, uri, royalty_basis_points)
        },
        NebulaXNFTInstruction::TransferNFT { mint, new_owner } => {
            msg!("Instruction: Transfer NFT");
            process_transfer_nft(program_id, accounts, mint, new_owner)
        },
        NebulaXNFTInstruction::BurnNFT { mint } => {
            msg!("Instruction: Burn NFT");
            process_burn_nft(program_id, accounts, mint)
        },
    }
}

// Instruction data parsing
impl NebulaXNFTInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        
        match tag {
            0 => {
                // Initialize Collection
                // Format: | tag (1) | name_len (1) | name (var) | symbol_len (1) | symbol (var) | uri_len (2) | uri (var) |
                let mut offset = 0;
                
                // Parse name
                let name_len = rest.get(offset).ok_or(ProgramError::InvalidInstructionData)? as usize;
                offset += 1;
                let name_end = offset + name_len;
                if name_end > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let name = String::from_utf8(rest[offset..name_end].to_vec())
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                offset = name_end;
                
                // Parse symbol
                let symbol_len = rest.get(offset).ok_or(ProgramError::InvalidInstructionData)? as usize;
                offset += 1;
                let symbol_end = offset + symbol_len;
                if symbol_end > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let symbol = String::from_utf8(rest[offset..symbol_end].to_vec())
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                offset = symbol_end;
                
                // Parse URI
                if offset + 2 > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let uri_len = u16::from_le_bytes([
                    *rest.get(offset).ok_or(ProgramError::InvalidInstructionData)?,
                    *rest.get(offset + 1).ok_or(ProgramError::InvalidInstructionData)?,
                ]) as usize;
                offset += 2;
                let uri_end = offset + uri_len;
                if uri_end > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let uri = String::from_utf8(rest[offset..uri_end].to_vec())
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                
                Ok(Self::InitializeCollection { name, symbol, uri })
            },
            1 => {
                // Mint NFT
                // Format: | tag (1) | name_len (1) | name (var) | desc_len (2) | desc (var) | uri_len (2) | uri (var) | royalty_basis_points (2) |
                let mut offset = 0;
                
                // Parse name
                let name_len = rest.get(offset).ok_or(ProgramError::InvalidInstructionData)? as usize;
                offset += 1;
                let name_end = offset + name_len;
                if name_end > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let name = String::from_utf8(rest[offset..name_end].to_vec())
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                offset = name_end;
                
                // Parse description
                if offset + 2 > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let desc_len = u16::from_le_bytes([
                    *rest.get(offset).ok_or(ProgramError::InvalidInstructionData)?,
                    *rest.get(offset + 1).ok_or(ProgramError::InvalidInstructionData)?,
                ]) as usize;
                offset += 2;
                let desc_end = offset + desc_len;
                if desc_end > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let description = String::from_utf8(rest[offset..desc_end].to_vec())
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                offset = desc_end;
                
                // Parse URI
                if offset + 2 > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let uri_len = u16::from_le_bytes([
                    *rest.get(offset).ok_or(ProgramError::InvalidInstructionData)?,
                    *rest.get(offset + 1).ok_or(ProgramError::InvalidInstructionData)?,
                ]) as usize;
                offset += 2;
                let uri_end = offset + uri_len;
                if uri_end > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let uri = String::from_utf8(rest[offset..uri_end].to_vec())
                    .map_err(|_| ProgramError::InvalidInstructionData)?;
                offset = uri_end;
                
                // Parse royalty basis points
                if offset + 2 > rest.len() {
                    return Err(ProgramError::InvalidInstructionData);
                }
                let royalty_basis_points = u16::from_le_bytes([
                    *rest.get(offset).ok_or(ProgramError::InvalidInstructionData)?,
                    *rest.get(offset + 1).ok_or(ProgramError::InvalidInstructionData)?,
                ]);
                
                Ok(Self::MintNFT {
                    name,
                    description,
                    uri,
                    royalty_basis_points,
                })
            },
            2 => {
                // Transfer NFT
                // Format: | tag (1) | mint (32) | new_owner (32) |
                if rest.len() < 64 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                
                let mint = Pubkey::new(&rest[..32]);
                let new_owner = Pubkey::new(&rest[32..64]);
                
                Ok(Self::TransferNFT { mint, new_owner })
            },
            3 => {
                // Burn NFT
                // Format: | tag (1) | mint (32) |
                if rest.len() < 32 {
                    return Err(ProgramError::InvalidInstructionData);
                }
                
                let mint = Pubkey::new(&rest[..32]);
                
                Ok(Self::BurnNFT { mint })
            },
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}

// Process the initialize collection instruction
pub fn process_initialize_collection(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: String,
    symbol: String,
    uri: String,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let admin_account = next_account_info(account_info_iter)?;
    let collection_state_account = next_account_info(account_info_iter)?;
    let collection_mint_account = next_account_info(account_info_iter)?;
    let collection_metadata_account = next_account_info(account_info_iter)?;
    let collection_edition_account = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let metadata_program = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    let rent_account = next_account_info(account_info_iter)?;
    
    // Verify admin is signer
    if !admin_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Initialize collection state
    let mut collection_state = CollectionState::default();
    collection_state.is_initialized = true;
    collection_state.admin = *admin_account.key;
    collection_state.collection_mint = *collection_mint_account.key;
    collection_state.total_supply = 0;
    
    // Initialize collection SPL token mint (should be initialized through CPI)
    // Simplified for this example
    
    // Create collection metadata (should be done through CPI)
    // The actual implementation would use Metaplex's create_metadata_accounts_v3 instruction
    
    msg!("NebulaX NFT collection initialized: {}", name);
    Ok(())
}

// Process the mint NFT instruction
pub fn process_mint_nft(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    name: String,
    description: String,
    uri: String,
    royalty_basis_points: u16,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let admin_account = next_account_info(account_info_iter)?;
    let collection_state_account = next_account_info(account_info_iter)?;
    let collection_mint_account = next_account_info(account_info_iter)?;
    let nft_mint_account = next_account_info(account_info_iter)?;
    let nft_metadata_account = next_account_info(account_info_iter)?;
    let nft_edition_account = next_account_info(account_info_iter)?;
    let destination_account = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let metadata_program = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    let rent_account = next_account_info(account_info_iter)?;
    
    // Verify admin is signer
    if !admin_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify admin authority
    let mut collection_state = CollectionState::unpack(&collection_state_account.data.borrow())?;
    if collection_state.admin != *admin_account.key {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Initialize NFT mint (should be done through CPI)
    // Create NFT metadata (should be done through CPI)
    // Mint token to destination (should be done through CPI)
    
    // Update collection state
    collection_state.total_supply += 1;
    
    msg!("NFT minted: {}", name);
    Ok(())
}

// Process the transfer NFT instruction
pub fn process_transfer_nft(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    mint: Pubkey,
    new_owner: Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let owner_account = next_account_info(account_info_iter)?;
    let source_account = next_account_info(account_info_iter)?;
    let destination_account = next_account_info(account_info_iter)?;
    let mint_account = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let associated_token_program = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    let rent_account = next_account_info(account_info_iter)?;
    
    // Verify owner is signer
    if !owner_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify the mint is correct
    if mint != *mint_account.key {
        return Err(ProgramError::InvalidArgument);
    }
    
    // Transfer NFT (should be done through CPI to token program)
    
    msg!("NFT transferred to {}", new_owner);
    Ok(())
}

// Process the burn NFT instruction
pub fn process_burn_nft(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    mint: Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let owner_account = next_account_info(account_info_iter)?;
    let token_account = next_account_info(account_info_iter)?;
    let mint_account = next_account_info(account_info_iter)?;
    let metadata_account = next_account_info(account_info_iter)?;
    let edition_account = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let metadata_program = next_account_info(account_info_iter)?;
    
    // Verify owner is signer
    if !owner_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify the mint is correct
    if mint != *mint_account.key {
        return Err(ProgramError::InvalidArgument);
    }
    
    // Burn NFT (should be done through CPI)
    
    msg!("NFT burned: {}", mint);
    Ok(())
}

// Implementation of Pack for CollectionState for serialization
impl Pack for CollectionState {
    const LEN: usize = 69; // 1 + 32 + 32 + 4
    
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        if src.len() < Self::LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        
        let mut offset = 0;
        
        let is_initialized = src[offset] != 0;
        offset += 1;
        
        let admin = Pubkey::new_from_array(
            *array_ref![src, offset, 32]
        );
        offset += 32;
        
        let collection_mint = Pubkey::new_from_array(
            *array_ref![src, offset, 32]
        );
        offset += 32;
        
        let total_supply = u32::from_le_bytes(
            *array_ref![src, offset, 4]
        );
        
        Ok(CollectionState {
            is_initialized,
            admin,
            collection_mint,
            total_supply,
        })
    }
    
    fn pack_into_slice(&self, dst: &mut [u8]) {
        let mut offset = 0;
        
        dst[offset] = self.is_initialized as u8;
        offset += 1;
        
        dst[offset..offset+32].copy_from_slice(self.admin.as_ref());
        offset += 32;
        
        dst[offset..offset+32].copy_from_slice(self.collection_mint.as_ref());
        offset += 32;
        
        dst[offset..offset+4].copy_from_slice(&self.total_supply.to_le_bytes());
    }
} 