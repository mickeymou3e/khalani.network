// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";
import {AssetRegistry} from "../../src/event_system/apps/bridge/AssetRegistry.sol";

contract ProdSpokeAddAsset is ProdBaseSpokeScript {
    function run() public override {
        preProcess();
        address token = vm.envAddress("ASSET_ADDRESS"); // token to add

        assetReserves =
            getContractAddressFromBroadcast("AssetReserves", "ProdSpokeDeployHyperflowBridge.s.sol", chainId);
        vm.startBroadcast(contractsManager);
        AssetRegistry(assetReserves).addAsset(token);
        vm.stopBroadcast();
    }
}
