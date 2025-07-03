export SEPOLIA_RPC_URL=https://ethereum-sepolia.publicnode.com; 
export FUJI_RPC_URL=https://avalanche-fuji-c-chain.publicnode.com;

# Set the private key as an environment variable
export MATCHMAKER_PRIVATE_KEY=
export SETTLER_PRIVATE_KEY=
export SPOKE_CHAIN_CALLER_PRIVATE_KEY=


echo "Runing Intentbook-matchmaker..."
RUST_LOG="debug,hyper=info" cargo run --bin intentbook-matchmaker -- --config-file ~/khalani-solver/config/config.json --private-key $MATCHMAKER_PRIVATE_KEY