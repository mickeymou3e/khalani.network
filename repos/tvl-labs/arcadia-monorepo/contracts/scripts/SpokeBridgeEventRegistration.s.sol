// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseSpokeScript} from "./BaseSpokeScript.s.sol";
import {SpokeHandler} from "../src/event_system/SpokeHandler.sol";
import {SpokePublisher} from "../src/event_system/SpokePublisher.sol";
import {MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH} from "../src/types/Events.sol";

contract SpokeBridgeEventRegistration is BaseSpokeScript {
    function run() public override {
        preProcess();

        address spokeHandler = getContractAddressFromBroadcast("SpokeHandler", "SpokeDeployCoreProtocol.s.sol", chainId);
        address reserves = getContractAddressFromBroadcast("AssetReserves", "SpokeDeployHyperFlowBridge.s.sol", chainId);
        hubChainId = getHubChainId();
        address adapter =
            getContractAddressFromBroadcast("MTokenCrossChainAdapter", "HubDeployHyperFlowBridge.s.sol", hubChainId);
        bytes32 withdrawalType = keccak256(abi.encode(adapter, MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH));

        vm.startBroadcast(contractsManagerKey);
        SpokeHandler(spokeHandler).registerEventType(reserves, withdrawalType);
        vm.stopBroadcast();
    }
}
