// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {BaseSpokeScript} from "./BaseSpokeScript.s.sol";
import {AssetRegistry} from "../src/event_system/apps/bridge/AssetRegistry.sol";

contract SpokeAddAsset is BaseSpokeScript {
    function run() public override {
        preProcess();
        address token = vm.envAddress("ASSET_ADDRESS"); // token to add

        assetReserves = getContractAddressFromBroadcast("AssetReserves", "SpokeDeployHyperFlowBridge.s.sol", chainId);
        vm.startBroadcast(contractsManagerKey);
        AssetRegistry(assetReserves).addAsset(token);
        vm.stopBroadcast();
    }
}
