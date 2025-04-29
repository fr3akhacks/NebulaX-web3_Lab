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
use spl_token::{
    state::{Account as TokenAccount},
    instruction::{burn, mint_to, transfer},
};
use std::convert::TryInto;

// Define program ID (will be set during deployment)
solana_program::declare_id!("nebTkKfLwGjZGjNW1K45XhyGJR1o1T1e4YrLfgbLTNX");

// Program instructions enum
#[derive(Clone, Debug, PartialEq)]
pub enum NebulaXInstruction {
    // Initialize the token program with admin authority
    Initialize {
        // Initial supply amount
        initial_supply: u64,
    },
    // Mint tokens to a target account
    MintTo {
        // Amount to mint
        amount: u64,
    },
    // Add an address to the blacklist
    Blacklist {
        // Address to blacklist
        target: Pubkey,
    },
    // Remove an address from the blacklist
    Unblacklist {
        // Address to unblacklist
        target: Pubkey,
    },
    // Vulnerability: Emergency unblacklist function with no authentication
    EmergencyUnblacklist {
        // Address to unblacklist
        target: Pubkey,
    },
}

// State struct for the blacklist
#[derive(Clone, Debug, Default, PartialEq)]
pub struct BlacklistState {
    pub is_initialized: bool,
    pub admin: Pubkey,
    // Blacklist is implemented as a PDA with the user's pubkey as a seed
}

impl IsInitialized for BlacklistState {
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
    let instruction = NebulaXInstruction::unpack(instruction_data)?;

    match instruction {
        NebulaXInstruction::Initialize { initial_supply } => {
            msg!("Instruction: Initialize");
            process_initialize(program_id, accounts, initial_supply)
        },
        NebulaXInstruction::MintTo { amount } => {
            msg!("Instruction: MintTo");
            process_mint_to(program_id, accounts, amount)
        },
        NebulaXInstruction::Blacklist { target } => {
            msg!("Instruction: Blacklist");
            process_blacklist(program_id, accounts, target)
        },
        NebulaXInstruction::Unblacklist { target } => {
            msg!("Instruction: Unblacklist");
            process_unblacklist(program_id, accounts, target)
        },
        NebulaXInstruction::EmergencyUnblacklist { target } => {
            msg!("Instruction: EmergencyUnblacklist");
            // Intentional vulnerability: No authority check
            process_emergency_unblacklist(program_id, accounts, target)
        },
    }
}

// Instruction data parsing
impl NebulaXInstruction {
    pub fn unpack(input: &[u8]) -> Result<Self, ProgramError> {
        let (&tag, rest) = input.split_first().ok_or(ProgramError::InvalidInstructionData)?;
        
        match tag {
            0 => {
                if rest.len() >= 8 {
                    let initial_supply = rest
                        .get(..8)
                        .and_then(|slice| slice.try_into().ok())
                        .map(u64::from_le_bytes)
                        .ok_or(ProgramError::InvalidInstructionData)?;
                    
                    Ok(Self::Initialize { initial_supply })
                } else {
                    Err(ProgramError::InvalidInstructionData)
                }
            },
            1 => {
                if rest.len() >= 8 {
                    let amount = rest
                        .get(..8)
                        .and_then(|slice| slice.try_into().ok())
                        .map(u64::from_le_bytes)
                        .ok_or(ProgramError::InvalidInstructionData)?;
                    
                    Ok(Self::MintTo { amount })
                } else {
                    Err(ProgramError::InvalidInstructionData)
                }
            },
            2 => {
                if rest.len() >= 32 {
                    let target = rest
                        .get(..32)
                        .and_then(|slice| slice.try_into().ok())
                        .map(Pubkey::new)
                        .ok_or(ProgramError::InvalidInstructionData)?;
                    
                    Ok(Self::Blacklist { target })
                } else {
                    Err(ProgramError::InvalidInstructionData)
                }
            },
            3 => {
                if rest.len() >= 32 {
                    let target = rest
                        .get(..32)
                        .and_then(|slice| slice.try_into().ok())
                        .map(Pubkey::new)
                        .ok_or(ProgramError::InvalidInstructionData)?;
                    
                    Ok(Self::Unblacklist { target })
                } else {
                    Err(ProgramError::InvalidInstructionData)
                }
            },
            4 => {
                if rest.len() >= 32 {
                    let target = rest
                        .get(..32)
                        .and_then(|slice| slice.try_into().ok())
                        .map(Pubkey::new)
                        .ok_or(ProgramError::InvalidInstructionData)?;
                    
                    Ok(Self::EmergencyUnblacklist { target })
                } else {
                    Err(ProgramError::InvalidInstructionData)
                }
            },
            _ => Err(ProgramError::InvalidInstructionData),
        }
    }
}

// Process the initialize instruction
pub fn process_initialize(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    initial_supply: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let admin_account = next_account_info(account_info_iter)?;
    let blacklist_state_account = next_account_info(account_info_iter)?;
    let token_mint_account = next_account_info(account_info_iter)?;
    let admin_token_account = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    let rent_account = next_account_info(account_info_iter)?;
    
    // Verify admin is signer
    if !admin_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Initialize blacklist state
    let mut blacklist_state = BlacklistState::default();
    blacklist_state.is_initialized = true;
    blacklist_state.admin = *admin_account.key;
    
    // Initialize SPL token mint account
    // (In a real implementation, this would include additional setup code)
    
    // Mint initial tokens to admin
    mint_to(
        token_program.key,
        token_mint_account.key,
        admin_token_account.key,
        admin_account.key,
        &[],
        initial_supply,
    )?;
    
    msg!("NebulaX token initialized with supply: {}", initial_supply);
    Ok(())
}

// Process the mint instruction
pub fn process_mint_to(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    amount: u64,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let admin_account = next_account_info(account_info_iter)?;
    let blacklist_state_account = next_account_info(account_info_iter)?;
    let token_mint_account = next_account_info(account_info_iter)?;
    let target_account = next_account_info(account_info_iter)?;
    let token_program = next_account_info(account_info_iter)?;
    
    // Verify admin is signer
    if !admin_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify admin authority
    let blacklist_state = BlacklistState::unpack(&blacklist_state_account.data.borrow())?;
    if blacklist_state.admin != *admin_account.key {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // Check target not blacklisted
    // (In production, we would check a blacklist PDA exists)
    
    // Mint tokens to target
    mint_to(
        token_program.key,
        token_mint_account.key,
        target_account.key,
        admin_account.key,
        &[],
        amount,
    )?;
    
    msg!("Minted {} tokens to {}", amount, target_account.key);
    Ok(())
}

// Process blacklist instruction
pub fn process_blacklist(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    target: Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let admin_account = next_account_info(account_info_iter)?;
    let blacklist_state_account = next_account_info(account_info_iter)?;
    let blacklist_entry_account = next_account_info(account_info_iter)?;
    let system_program = next_account_info(account_info_iter)?;
    
    // Verify admin is signer
    if !admin_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify admin authority
    let blacklist_state = BlacklistState::unpack(&blacklist_state_account.data.borrow())?;
    if blacklist_state.admin != *admin_account.key {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // In a real implementation, we would create a PDA for the blacklisted address
    // For simplicity, we just log the action here
    msg!("Address {} has been blacklisted", target);
    Ok(())
}

// Process unblacklist instruction
pub fn process_unblacklist(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    target: Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let admin_account = next_account_info(account_info_iter)?;
    let blacklist_state_account = next_account_info(account_info_iter)?;
    let blacklist_entry_account = next_account_info(account_info_iter)?;
    
    // Verify admin is signer
    if !admin_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // Verify admin authority
    let blacklist_state = BlacklistState::unpack(&blacklist_state_account.data.borrow())?;
    if blacklist_state.admin != *admin_account.key {
        return Err(ProgramError::InvalidAccountData);
    }
    
    // In a real implementation, we would close the PDA for the blacklisted address
    // For simplicity, we just log the action here
    msg!("Address {} has been removed from blacklist", target);
    Ok(())
}

// Process emergency unblacklist instruction - VULNERABLE FUNCTION
pub fn process_emergency_unblacklist(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    target: Pubkey,
) -> ProgramResult {
    let account_info_iter = &mut accounts.iter();
    let caller_account = next_account_info(account_info_iter)?;
    let blacklist_entry_account = next_account_info(account_info_iter)?;
    
    // Verify caller is signer
    if !caller_account.is_signer {
        return Err(ProgramError::MissingRequiredSignature);
    }
    
    // VULNERABILITY: No check if caller is admin!
    // Anyone can unblacklist addresses in an emergency
    
    // In a real implementation, we would close the PDA for the blacklisted address
    // For simplicity, we just log the action here
    msg!("EMERGENCY: Address {} has been removed from blacklist by {}", 
         target, caller_account.key);
    Ok(())
}

// Implementation of Pack for BlacklistState for serialization
impl Pack for BlacklistState {
    const LEN: usize = 33; // 1 byte for is_initialized + 32 bytes for admin pubkey
    
    fn unpack_from_slice(src: &[u8]) -> Result<Self, ProgramError> {
        if src.len() < Self::LEN {
            return Err(ProgramError::InvalidAccountData);
        }
        
        let is_initialized = src[0] != 0;
        let admin = Pubkey::new_from_array(
            *array_ref![src, 1, 32]
        );
        
        Ok(BlacklistState {
            is_initialized,
            admin,
        })
    }
    
    fn pack_into_slice(&self, dst: &mut [u8]) {
        dst[0] = self.is_initialized as u8;
        dst[1..33].copy_from_slice(self.admin.as_ref());
    }
} 