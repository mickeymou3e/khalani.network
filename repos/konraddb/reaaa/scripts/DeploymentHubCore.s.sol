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

// notes:
// 1. Change the event types struct hashes to be imported
// 2. Gas oracle should be deployed not as env var
// 3. Deps setup requires more steps
// 4. Need to also write function that executes after all deployment steps to make sure everything is wired up
// 5. Actual contracts need to be updated with new deposit event structure as well
contract DeploymentHubCore is Script {
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

        vm.startBroadcast(hubDeployerKey);

        solutionLib = _deploySolutionLib();
        intentBook = _deployIntentBook(solutionLib);
        igp = _deployIgp();
        hubPublisher = _deployHubPublisher();
        mTokenManager = _deployMTokenManager();
        mTokenRegistry = _deployMTokenRegistry(mTokenManager);
        receiptManager = _deployReceiptManager(intentBook, mTokenManager);

        hubHandler = _deployEventHandler();
        hubEventVerifier = _deployEventVerifier(hubMailbox, hubHandler);

        mTokenAdapter = address(new MTokenCrossChainAdapter(mTokenManager, hubPublisher, mTokenRegistry));

        withdrawalEventType = keccak256(abi.encode(hubDeployer, withdrawalEventTypeHash));
        depositEventType = keccak256(abi.encode(hubDeployer, ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH));
        _setupDeps(hubDeployer, hubPublisher, hubHandler, hubEventVerifier);
        vm.stopBroadcast();
        console.log("Hub chain contracts deployed:\n");
        console.log("IntentBook: %s", intentBook);
        console.log("MTokenManager: %s", mTokenManager);
        console.log("ReceiptManager: %s", receiptManager);
        console.log("MTokenRegistry: %s", mTokenRegistry);
        console.log("EventProver: %s", eventProver);
        console.log("EventVerifier: %s", hubEventVerifier);
        console.log("EventPublisher: %s", hubPublisher);
        console.log("EventHandler: %s", hubHandler);
        console.log("IGP: %s", igp);
    }

    function _setupDeps(address admin, address hubPublisher, address hubHandler, address hubEventVerifier) internal {
        _setupIntentBook(admin);
        _setupMTokenManager(admin);
        _registerBridgeApp();
        HubHandler(hubHandler).registerEventVerifier(hubEventVerifier);
    }

    function _deployHubPublisher() internal returns (address) {
        return address(new HubPublisher());
    }

    function _setupIntentBook(address admin) internal {
        IntentBook(intentBook).setReceiptManager(receiptManager);
        IntentBook(intentBook).setTokenManager(mTokenManager);
        IntentBook(intentBook).addPublisher(admin);
    }

    function _setupMTokenManager(address admin) internal {
        MTokenManager(mTokenManager).setReceiptManager(receiptManager);
        MTokenManager(mTokenManager).setIntentBook(intentBook);
        MTokenManager(mTokenManager).setTokenRegistry(mTokenRegistry);
        MTokenManager(mTokenManager).addAuthorizedMinter(intentBook);
        MTokenManager(mTokenManager).addAuthorizedMinter(mTokenAdapter);
        MTokenManager(mTokenManager).addAuthorizedLocker(admin);
        MTokenManager(mTokenManager).setWithdrawalHandler(mTokenAdapter);
    }

    function _registerBridgeApp() internal {
        HubPublisher(hubPublisher).registerEventOnProducer(mTokenAdapter, withdrawalEventType);
        HubHandler(hubHandler).registerEventTypeOnProcessor(mTokenAdapter, depositEventType);
    }

    function _deploySolutionLib() internal returns (address _solutionLib) {
        _solutionLib = address(new SolutionLib());
    }

    function _deployIntentBook(address solutionLib) internal returns (address _intentBook) {
        _intentBook = address(new IntentBook(solutionLib));
    }

    function _deployIgp() internal returns (address _igp) {
        _igp = address(new MockInterchainGasPaymaster());
    }

    function _deployEventPublisher() internal returns (address _eventPublisher) {
        _eventPublisher = address(new HubPublisher());
    }

    function _deployMTokenManager() internal returns (address _mTokenManager) {
        _mTokenManager = address(new MTokenManager());
    }

    function _deployMTokenRegistry(address _mTokenManager) internal returns (address _mTokenRegistry) {
        _mTokenRegistry = address(new MTokenRegistry(_mTokenManager));
    }

    function _deployReceiptManager(address _intentBook, address _mTokenManager)
        internal
        returns (address _receiptManager)
    {
        _receiptManager = address(new ReceiptManager(_intentBook, _mTokenManager));
    }

    function _deployEventHandler() internal returns (address) {
        return address(new HubHandler());
    }

    function _deployEventVerifier(address hubMailbox, address hubHandler) internal returns (address) {
        return address(new EventVerifier(hubMailbox, hubHandler));
    }
}
