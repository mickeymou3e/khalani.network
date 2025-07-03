// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./BaseHubScript.s.sol";
import {HubHandler} from "../src/event_system/HubHandler.sol";
import {HubPublisher} from "../src/event_system/HubPublisher.sol";
import {ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH} from "../src/types/Events.sol";

contract HubBridgeEventRegistration is BaseHubScript {
    function run() public override {
        preProcess();
        eventHandler = getContractAddressFromBroadcast("HubHandler", "HubDeployCoreProtocol.s.sol", chainId);
        address adapter =
            getContractAddressFromBroadcast("MTokenCrossChainAdapter", "HubDeployHyperFlowBridge.s.sol", chainId);
        spokeChainId = getSpokeChainId();
        address reserves =
            getContractAddressFromBroadcast("AssetReserves", "SpokeDeployHyperFlowBridge.s.sol", spokeChainId);
        bytes32 depositType = keccak256(abi.encode(reserves, ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH));

        vm.startBroadcast(contractsManagerKey);
        HubHandler(eventHandler).registerEventType(adapter, depositType);
        vm.stopBroadcast();
    }
}
