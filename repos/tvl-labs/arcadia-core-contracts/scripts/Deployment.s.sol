// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {IntentBook} from "../src/hub/IntentBook.sol";
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import {ReceiptManager} from "../src/hub/ReceiptManager.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {EventProver} from "../src/common/EventProver.sol";
import {EventVerifier} from "../src/common/EventVerifier.sol";
import {AIPEventPublisher} from "../src/common/AIPEventPublisher.sol";
import {AIPEventHandler} from "../src/common/AIPEventHandler.sol";
import {Mailbox} from "@hyperlane-xyz/core/contracts/Mailbox.sol";
import {MockInterchainGasPaymaster} from "../test/MockInterchainGasPaymaster.sol";
import {IInterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";
import {SolutionLib} from "../src/libraries/SolutionLib.sol";
import {console} from "forge-std/console.sol";

contract Deployment is Script {
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

        IntentBook(intentBook).setReceiptManager(receiptManager);
        IntentBook(intentBook).setTokenManager(mTokenManager);
        IntentBook(intentBook).addPublisher(deployer);
        MTokenManager(mTokenManager).setReceiptManager(receiptManager);
        MTokenManager(mTokenManager).setIntentBook(intentBook);
        MTokenManager(mTokenManager).setTokenRegistry(mTokenRegistry);
        MTokenManager(mTokenManager).addAuthorizedMinter(intentBook);
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

// DEPLOYER_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 forge script ./scripts/Deployment.s.sol --rpc-url http://127.0.0.1:8545 --broadcast
