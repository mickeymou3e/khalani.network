export SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com; 
export FUJI_RPC_URL=https://avalanche-fuji-c-chain.publicnode.com;

# Set the private key as an environment variable
export MATCHMAKER_PRIVATE_KEY=
export SETTLER_PRIVATE_KEY=
export SPOKE_CHAIN_CALLER_PRIVATE_KEY=


echo "Runing Spoke Chain Caller..."
RUST_LOG="debug,hyper=info" cargo run --bin spoke-chain-caller -- --config-file ~/khalani-solver/config/config.json --private-key $SPOKE_CHAIN_CALLER_PRIVATE_KEY