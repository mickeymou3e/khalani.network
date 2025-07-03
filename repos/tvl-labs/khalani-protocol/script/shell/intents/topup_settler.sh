export AWS_KMS_KEY_ID="alias/khalani-deployer"
export AWS_ACCESS_KEY_ID=""
export AWS_SECRET_ACCESS_KEY=""
export AWS_SESSION_TOKEN=""

echo "Topping up settler..."
forge script script/intents/TopupSettler.s.sol --aws true --sender 0x04b0bff8776d8cc0ef00489940afd9654c67e4c7 -vvvv --legacy
echo "Topped up settler"