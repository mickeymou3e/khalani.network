// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {IntentBook} from "../src/hub/IntentBook.sol";
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import {ReceiptManager} from "../src/hub/ReceiptManager.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {EventProver} from "../src/common/EventProver.sol";
import {EventVerifier} from "../src/common/EventVerifier.sol";
import {AIPEventPublisher} from "../";
import {AIPEventHandler} from "../src/common/AIPEventHandler.sol";
import {Mailbox} from "@hyperlane-xyz/core/contracts/Mailbox.sol";
import {MockInterchainGasPaymaster} from "../test/MockInterchainGasPaymaster.sol";
import {IInterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";
import {SolutionLib} from "../src/libraries/SolutionLib.sol";
import {console} from "forge-std/console.sol";

import {GasPriceOracle} from "../src/common/GasPriceOracle.sol";
import {InterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/hooks/igp/InterchainGasPaymaster.sol";
import {SignatureLib} from "../src/libraries/SignatureLib.sol";
import {SolutionLib} from "../src/libraries/SolutionLib.sol";

// Type imports
import "../src/types/Intent.sol";
import "../src/types/Events.sol";
import {Receipt as ReceiptStruct} from "../src/types/Receipt.sol";

// Hub chain imports
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import "../src/hub/MToken.sol";

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

// Event system bridge app imports
import "../src/event_system/apps/bridge/AssetRegistry.sol";
import "../src/event_system/apps/bridge/AssetReserves.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";

contract Deployment2 is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address deployer = vm.envAddress("MEDUSA_ADDRESS");

        vm.startBroadcast(deployerPrivateKey);

        address solutionLib = _deploySolutionLib();
        address intentBook = _deployIntentBook(solutionLib);
        address mailbox = _deployMailBox();
        address igp = _deployIgp();
        address eventProver = _deployEventProver(mailbox, igp);
        address eventPublisher = _deployerEventPublisher(eventProver);
        address mTokenManager = deployMTokenManager(eventPublisher);
        address mTokenRegistry = deployMTokenRegistry(mTokenManager);
        address receiptManager = deployReceiptManager(intentBook, mTokenManager);
        address eventHandler = deployAIPEventHandler(mTokenManager, receiptManager, isArcadia);

        IntentBook(intentBook).setReceiptManager(receiptManager);
        IntentBook(intentBook).setTokenManager(mTokenManager);
        IntentBook(intentBook).addPublisher(deployer);
        MTokenManager(mTokenManager).setReceiptManager(receiptManager);
        MTokenManager(mTokenManager).setIntentBook(intentBook);
        MTokenManager(mTokenManager).setTokenRegistry(mTokenRegistry);
        MTokenManager(mTokenManager).addAuthorizedMinter(intentBook);
        EventProver(eventProver).addEventPublisher(eventPublisher);
        vm.stopBroadcast();
        console.log("Deployment complete. Addresses:\n");
        console.log("IntentBook: %s", intentBook);
        console.log("MTokenManager: %s", mTokenManager);
        console.log("ReceiptManager: %s", receiptManager);
        console.log("MTokenRegistry: %s", mTokenRegistry);
        console.log("EventProver: %s", eventProver);
        console.log("EventPublisher: %s", eventPublisher);
        console.log("IGP: %s", igp);
    }

    function _deploySolutionLib() internal returns (address _solutionLib) {
        _solutionLib = address(new SolutionLib());
    }

    function _deployIntentBook(address solutionLib) internal returns (address _intentBook) {
        _intentBook = address(new IntentBook(solutionLib));
    }

    function _deployMailBox() internal returns (address _mailbox) {
        _mailbox = address(new Mailbox(uint32(block.chainid)));
    }

    function _deployIgp() internal returns (address _igp) {
        _igp = address(new MockInterchainGasPaymaster());
    }

    function _deployEventProver(address mailbox, address igp) internal returns (address _eventProver) {
        _eventProver = address(new EventProver(mailbox, address(0), 31337, igp));
    }

    function _deployerEventPublisher(address eventProver) internal returns (address _eventPublisher) {
        _eventPublisher = address(new AIPEventPublisher(eventProver));
    }

    function deployMTokenManager(address _aipEventPublisher) internal returns (address _mTokenManager) {
        _mTokenManager = address(new MTokenManager(_aipEventPublisher));
    }

    function deployMTokenRegistry(address _mTokenManager) internal returns (address _mTokenRegistry) {
        _mTokenRegistry = address(new MTokenRegistry(_mTokenManager));
    }

    function deployReceiptManager(address _intentBook, address _mTokenManager)
        internal
        returns (address _receiptManager)
    {
        _receiptManager = address(new ReceiptManager(_intentBook, _mTokenManager));
    }
}
