pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/Tokens/ERC20MintableBurnableDecimal.sol";
import "./lib/LibConfig.sol";

contract DeployMirrorToken is Script {

    string remoteChain;
    string khalaniChain;
    string remoteRPC;
    string khalaniRPC;

    function run() public {
        remoteChain = vm.envString("REMOTE");
        khalaniChain = vm.envString("KHALANI");
        LibConfig.DeployConfig memory deployConfig = LibConfig.parseDeployConfigForChain(remoteChain, vm);
        LibConfig.DeployConfig memory khalaniConfig = LibConfig.parseDeployConfigForChain(khalaniChain, vm);
        address [] memory tokens = deployConfig.tokens;
        address [] memory mirrorTokens = new address[](tokens.length);
        string [] memory symbols = new string[](tokens.length);
        uint [] memory decimalsArray = new uint[](tokens.length);
        remoteRPC = deployConfig.rpcUrl;
        khalaniRPC = khalaniConfig.rpcUrl;
        uint256 remote = vm.createFork(remoteRPC);
        uint khalani = vm.createFork(khalaniRPC);
        for (uint i; i <tokens.length; ) {
            address token = tokens[i];
            vm.selectFork(remote);
            string memory nameSuffix = string.concat('/', remoteChain);
            string memory name = string.concat(ERC20(token).name(), nameSuffix);
            string memory symbolSuffix = string.concat('.', remoteChain);
            string memory symbol = string.concat(ERC20(token).symbol(), symbolSuffix);
            uint8 decimals = ERC20(token).decimals();
            console.log("Deploying mirror token for %s: %s %s to axon", token, name, symbol);
            vm.selectFork(khalani);
            vm.startBroadcast();
            address mirrorToken = address(new ERC20MintableBurnableDecimal(name, symbol, decimals));
            vm.stopBroadcast();
            mirrorTokens[i] = mirrorToken;
            symbols[i] = symbol;
            decimalsArray[i] = decimals;
            unchecked {
                ++i;
            }
        }
        LibConfig.writeMirrorTokenOut(tokens, mirrorTokens, symbols, decimalsArray, remoteChain, deployConfig.chainId, vm);
    }
}