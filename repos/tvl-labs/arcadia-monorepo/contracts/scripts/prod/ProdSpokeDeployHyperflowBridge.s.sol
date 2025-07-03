// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";
import {SpokePublisher} from "../../src/event_system/SpokePublisher.sol";
import {SpokeHandler} from "../../src/event_system/SpokeHandler.sol";
import {ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH} from "../../src/types/Events.sol";
import {AssetReserves} from "../../src/event_system/apps/bridge/AssetReserves.sol";

contract ProdSpokeDeployHyperFlowBridge is ProdBaseSpokeScript {
    function run() public override {
        preProcess();

        address spokePublisher =
            getContractAddressFromBroadcast("SpokePublisher", "ProdSpokeDeployCoreProtocol.s.sol", chainId);

        eventPublisher =
            payable(getContractAddressFromBroadcast("SpokePublisher", "ProdSpokeDeployCoreProtocol.s.sol", chainId));
        eventHandler = getContractAddressFromBroadcast("SpokeHandler", "ProdSpokeDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManager);
        bytes32 salt = keccak256(abi.encodePacked("AssetReserves", chainId));
        AssetReserves reserves = new AssetReserves{salt: salt}(contractsManager, eventPublisher, eventHandler, PERMIT2);

        SpokePublisher(payable(spokePublisher)).addProducer(address(reserves));
        bytes32 depositType = keccak256(abi.encode(reserves, ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH));
        SpokePublisher(payable(spokePublisher)).registerEventOnProducer(address(reserves), depositType);
        vm.stopBroadcast();
    }
}
