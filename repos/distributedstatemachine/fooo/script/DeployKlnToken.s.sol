pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "./lib/LibConfig.sol";

contract DeployKlnToken is Script {
    string[] tokens;
    function run() public {
        LibConfig.DeployConfig memory deployConfig = LibConfig.parseDeployConfigForChain(vm.envString("KHALANI"), vm);
        vm.createSelectFork(deployConfig.rpcUrl);
        tokens = LibConfig.readKlnSymbolList(vm);
        LibConfig.KlnToken[] memory klnTokens = new LibConfig.KlnToken[](tokens.length);
        // read tokens array from config
        for(uint i; i < tokens.length;) {
            klnTokens[i].symbol = tokens[i];
            vm.startBroadcast();
            klnTokens[i].token = address(new ERC20MintableBurnable(tokens[i], tokens[i]));
            vm.stopBroadcast();
            console.log("Deployed %s at %s on Khalani", klnTokens[i].symbol, klnTokens[i].token);
            unchecked {
                ++i;
            }
        }
        LibConfig.writeKlnTokenOut(klnTokens, vm);
    }
}