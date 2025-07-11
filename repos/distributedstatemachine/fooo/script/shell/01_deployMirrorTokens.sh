export REMOTE=godwokentestnet
export KHALANI=khalanitestnet



echo "Starting forge script..."
forge script script/DeployMirrorToken.s.sol --broadcast --verify --aws true --legacy --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7 --verifier blockscout --verifier-url https://block-explorer.testnet.khalani.network/api -vvvv
echo "Forge script completed"
