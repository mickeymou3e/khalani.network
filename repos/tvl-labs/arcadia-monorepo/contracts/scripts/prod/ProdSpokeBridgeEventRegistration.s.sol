// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";
import {SpokeHandler} from "../../src/event_system/SpokeHandler.sol";
import {SpokePublisher} from "../../src/event_system/SpokePublisher.sol";
import {MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH} from "../../src/types/Events.sol";

contract ProdSpokeBridgeEventRegistration is ProdBaseSpokeScript {
    function run() public override {
        preProcess();

        address spokeHandler =
            getContractAddressFromBroadcast("SpokeHandler", "ProdSpokeDeployCoreProtocol.s.sol", chainId);
        address reserves =
            getContractAddressFromBroadcast("AssetReserves", "ProdSpokeDeployHyperFlowBridge.s.sol", chainId);
        hubChainId = getHubChainId();
        address adapter =
            getContractAddressFromBroadcast("MTokenCrossChainAdapter", "ProdHubDeployHyperFlowBridge.s.sol", hubChainId);
        bytes32 withdrawalType = keccak256(abi.encode(adapter, MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH));

        vm.startBroadcast(contractsManager);
        SpokeHandler(spokeHandler).registerEventType(reserves, withdrawalType);
        vm.stopBroadcast();
    }
}
