pub mod common;
// pub mod contracts;
pub mod conversion;
pub mod events;
pub mod intents;
pub mod receipt;
pub mod refinement;
pub mod sol_types;
pub mod solution;
pub mod swap;
pub mod ws;

pub use intents::*;
pub use refinement::*;
pub use sol_types::{eip712_domain, eip712_intent_hash};
pub use solution::*;
pub use ws::*;

// EIP712:
// Domain: name, version, chainId
// type hash = Type Hash of the intent struct hash(address, uint256, uint256, address, sig, ...)
// struct hash = Hash of the actual intent struct
// EIP712 hash = keccak256(abi.encodePacked(domain, struct hash))
// sig = sign(EIP712 hash)
// Intent and signed intent (for off-chain code)
// on-chain: publishIntent(intent, v, r, s)
//           commitSolution(solution, v, r, s)

// pub fn eip712_domain() -> Eip712Domain {
//     eip712_domain! {
//         name: "KhalaniIntent".to_string(),
//         version: "1.0.0".to_string(),
//         verifying_contract: "0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0".parse().unwrap(),
//     }
// }

// pub fn eip712_intent_hash(intent: &sol_types::Intent) -> B256 {
//     let domain = eip712_domain();
//     intent.eip712_signing_hash(&domain)
// }

// pub fn eip712_solution_hash(solution: &sol_types::Solution) -> B256 {
//     let domain = eip712_domain();
//     solution.eip712_signing_hash(&domain)
// }
