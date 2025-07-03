// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
// Event system interfacesimports
import "../src/event_system/interfaces/IEventProver.sol";
import "../src/event_system/interfaces/IEventVerifier.sol";
import "../src/event_system/interfaces/IEventProcessor.sol";
import "../src/event_system/interfaces/IEventPublisher.sol";
import "../src/event_system/interfaces/IEventHandler.sol";
import "../src/event_system/interfaces/IEventProducer.sol";

// Event system imports
import {EventProver} from "../src/event_system/EventProver.sol";
import {EventVerifier} from "../src/event_system/EventVerifier.sol";
import {HubHandler} from "../src/event_system/HubHandler.sol";
import {SpokeHandler} from "../src/event_system/SpokeHandler.sol";
import {HubPublisher} from "../src/event_system/HubPublisher.sol";
import {SpokePublisher} from "../src/event_system/SpokePublisher.sol";
import {GasAmountOracle} from "../src/common/GasAmountOracle.sol";

// Event system bridge app imports
import "../src/event_system/apps/bridge/AssetRegistry.sol";
import "../src/event_system/apps/bridge/AssetReserves.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH, ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH} from "../src/types/Events.sol";

// System core
import {IntentBook} from "../src/hub/IntentBook.sol";
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import {ReceiptManager} from "../src/hub/ReceiptManager.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {MockInterchainGasPaymaster} from "../test/MockInterchainGasPaymaster.sol";
import {SolutionLib} from "../src/libraries/SolutionLib.sol";

bytes32 constant DEPOSIT_EVENT_ID = keccak256("DEPOSIT_EVENT");
bytes32 constant WITHDRAWAL_EVENT_ID = keccak256("WITHDRAWAL_EVENT_ID");

contract HealthCheck is Script {
    function run() external {
        // address hubDeployer = vm.envAddress("HUB_DEPLOYER");
        // uint256 hubDeployerKey = vm.envUint("HUB_DEPLOYER_KEY");

        // address hubMailbox = vm.envAddress("HUB_MAILBOX");
        // uint256 hubChainId = vm.envUint("HUB_CHAIN_ID");
        // uint256 spokeChainId = vm.envUint("SPOKE_CHAIN_ID");
        // address intentBook = vm.envAddress("INTENT_BOOK");
        // address receiptManager = vm.envAddress("RECEIPT_MANAGER");
        // address mTokenManager = vm.envAddress("MTOKEN_MANAGER");
        // address mTokenRegistry = vm.envAddress("MTOKEN_REGISTRY");
        // address assetReserves = vm.envAddress("ASSET_RESERVES");
        // address spokePublisher = vm.envAddress("SPOKE_PUBLISHER");
        // address spokeHandler = vm.envAddress("SPOKE_HANDLER");
        // address spokeEventVerifier = vm.envAddress("SPOKE_CHAIN_EVENT_VERIFIER");
        // address hubPublisher = vm.envAddress("HUB_PUBLISHER");
        // address hubHandler = vm.envAddress("HUB_HANDLER");
        // address hubEventProver = vm.envAddress("HUB_CHAIN_EVENT_PROVER");
        // address hubEventVerifier = vm.envAddress("HUB_CHAIN_EVENT_VERIFIER");
        // address spokeEventProver = vm.envAddress("SPOKE_CHAIN_EVENT_PROVER");
    }
}
