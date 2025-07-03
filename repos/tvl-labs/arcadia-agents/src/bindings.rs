use ethers::prelude::*;

abigen!(
    AssetReserves,
    r#"[
        {
            "inputs": [
                {"internalType": "address", "name": "user", "type": "address"},
                {"internalType": "address", "name": "token", "type": "address"},
                {"internalType": "uint256", "name": "amount", "type": "uint256"}
            ],
            "name": "refundUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]"#
);

abigen!(
    MTokenManager,
    r#"[
        {
            "inputs": [
                {"internalType": "address", "name": "user", "type": "address"},
                {"internalType": "address", "name": "mToken", "type": "address"},
                {"internalType": "uint256", "name": "amount", "type": "uint256"}
            ],
            "name": "refundUser",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ]"#
);