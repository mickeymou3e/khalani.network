// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {stdJson} from "forge-std/StdJson.sol";
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

// notes:
// 1. Change the event types struct hashes to be imported
// 2. Gas oracle should be deployed not as env var
// 3. Deps setup requires more steps
// 4. Need to also write function that executes after all deployment steps to make sure everything is wired up
// 5. Actual contracts need to be updated with new deposit event structure as well
contract DeploySpokeIntegrationOnHub is Script {
    address public solutionLib;
    address public intentBook;
    address public igp;
    address public eventPublisher;
    address public mTokenManager;
    address public mTokenRegistry;
    address public receiptManager;
    address public hubHandler;
    address public eventProver;
    address public hubPublisher;
    address public assetReserves;
    address public hubEventVerifier;
    address public mTokenAdapter;
    bytes32 public withdrawalEventType;
    bytes32 public depositEventType;
    bytes32 public withdrawalEventTypeHash =
        keccak256("MTokenWithdrawal(address token, uint256 amount, address withdrawer)");

    function run() external {
        address hubDeployer = vm.envAddress("HUB_DEPLOYER");
        uint256 hubDeployerKey = vm.envUint("HUB_DEPLOYER_KEY");

        address hubMailbox = vm.envAddress("HUB_MAILBOX");
        uint256 hubChainId = vm.envUint("HUB_CHAIN_ID");

        uint256 spokeChainId = vm.envUint("SPOKE_CHAIN_ID");
        //address gasOracle = vm.envAddress("GAS_ORACLE");

        vm.startBroadcast(hubDeployerKey);
        address spokeChainEventVerifier = getSpokeChainEventVerifierAddress();
        address gasOracle = getHubChainGasOracleAddress();
        address igp = getIgpAddress();
        address hubPublisher = getHubPublisherAddress();

        GasAmountOracle(gasOracle).setGasAmount(uint32(hubChainId), uint32(spokeChainId), 500000);

        eventProver = _deployEventProver(hubMailbox, igp, gasOracle, uint32(spokeChainId), spokeChainEventVerifier);
        HubPublisher(hubPublisher).registerEventProver(spokeChainId, eventProver);

        withdrawalEventType = keccak256(abi.encode(hubDeployer, withdrawalEventTypeHash));
        depositEventType = keccak256(abi.encode(hubDeployer, ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH));
        EventProver(eventProver).addEventPublisher(hubPublisher);
        vm.stopBroadcast();
        console.log("Hub chain integration contracts deployed:\n");
        console.log("EventProver: %s", eventProver);
    }

    function _deployEventProver(address mailbox, address igp, address gasOracle, uint256 spokeChainId, address verifier)
        internal
        returns (address _eventProver)
    {
        _eventProver = address(new EventProver(mailbox, verifier, uint32(spokeChainId), igp, gasOracle));
    }
}
