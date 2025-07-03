// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {BaseHubScript} from "./BaseHubScript.s.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";

contract HubAddMToken is BaseHubScript {
    function run() public override {
        preProcess();
        string memory name = vm.envString("NAME");
        string memory symbol = vm.envString("SYMBOL");
        address spokeToken = vm.envAddress("ASSET_ADDRESS");
        uint32 assetChainId = uint32(vm.envUint("ASSET_CHAIN_ID"));

        mTokenRegistry = getContractAddressFromBroadcast("MTokenRegistry", "HubDeployCoreProtocol.s.sol", chainId);
        vm.startBroadcast(contractsManagerKey);
        MTokenRegistry(mTokenRegistry).createMToken(name, symbol, spokeToken, assetChainId);
        vm.stopBroadcast();
    }
}
