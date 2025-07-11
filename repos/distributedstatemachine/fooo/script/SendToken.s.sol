pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "./lib/LibConfig.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/InterchainMessaging/facets/Bridge/RemoteBridge.sol";
import "../src/LiquidityReserves/remote/AssetReserves.sol";
import "../src/InterchainMessaging/gasPayment/IGasPayMaster.sol";

contract SendTokens is Script {
    LibConfig.RemoteContracts remoteContracts;
    LibConfig.KhalaniContracts khalaniContracts;
    LibConfig.DeployConfig deployConfig;
    function run() public {
        string memory remote = vm.envString("REMOTE");
        string memory khalani = vm.envString("KHALANI");
        remoteContracts = LibConfig.readRemoteAddress(remote, vm);
        khalaniContracts = LibConfig.readKhalaniAddress(khalani, vm);
        deployConfig = LibConfig.parseDeployConfigForChain(remote, vm);
        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();
        Token[] memory tokens = new Token[](deployConfig.tokens.length);
        for(uint i = 0; i < deployConfig.tokens.length; i++) {
            AssetReserves(remoteContracts.assetReserves).addWhiteListedAsset(deployConfig.tokens[i]);
            uint8 decimals = ERC20(deployConfig.tokens[i]).decimals();
            uint256 amount = 450000 * (10 ** decimals);
            ERC20MintableBurnable asset = ERC20MintableBurnable(deployConfig.tokens[i]);
            asset.mint(msg.sender, amount);
            asset.approve(remoteContracts.assetReserves, amount);
            tokens[i] = Token(deployConfig.tokens[i], amount);
        }
        uint val = IGasPayMaster(remoteContracts.hyperlaneIGP).quoteSend(uint32(khalaniContracts.chainId),tokens.length);
        console.log("gas quote : %s", val);
        RemoteBridgeFacet(remoteContracts.diamondProxy).send{value : val}(
            khalaniContracts.chainId,
            tokens,
            "",
            false,
            msg.sender,
            ""
        );
        vm.stopBroadcast();
    }
}