// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./ProdBaseHubScript.s.sol";
import {MTokenRegistry} from "../../src/modules/MTokenRegistry.sol";

contract ProdHubAddMToken is BaseHubScript {
    function run() public override {
        preProcess();
        string memory name = vm.envString("NAME");
        string memory symbol = vm.envString("SYMBOL");
        address spokeToken = vm.envAddress("ASSET_ADDRESS");
        uint32 assetChainId = uint32(vm.envUint("ASSET_CHAIN_ID"));

        mTokenRegistry = getContractAddressFromBroadcast("MTokenRegistry", "ProdHubDeployCoreProtocol.s.sol", chainId);
        vm.startBroadcast(contractsManager);
        MTokenRegistry(mTokenRegistry).createMToken(name, symbol, spokeToken, assetChainId);
        vm.stopBroadcast();
    }
}
