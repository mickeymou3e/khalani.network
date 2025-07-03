// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IntentBook} from "../src/hub/IntentBook.sol";
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import {ReceiptManager} from "../src/hub/ReceiptManager.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {HubPublisher} from "../src/event_system/HubPublisher.sol";
import {HubHandler} from "../src/event_system/HubHandler.sol";
import {SolutionLib} from "../src/libraries/SolutionLib.sol";
import {MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH} from "../src/types/Events.sol";
import {EventVerifier} from "../src/event_system/EventVerifier.sol";
import {MockInterchainGasPaymaster} from "../src/event_system/MockInterchainGasPaymaster.sol";
import {GasAmountOracle} from "../src/event_system/GasAmountOracle.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {BaseHubScript} from "./BaseHubScript.s.sol";
import {RolesLib} from "../src/libraries/RolesLib.sol";
import {AccessManager} from "@oz5/contracts/access/manager/AccessManager.sol";

contract HubDeployCoreProtocol is BaseHubScript {
    function run() public override {
        preProcess();
        manager = getContractAddressFromBroadcast("AccessManager", "DeployPermissions.s.sol", chainId);
        console.log("manager", manager);
        vm.startBroadcast(deployerKey);
        deploy();
        vm.stopBroadcast();

        vm.startBroadcast(roleAdminKey);
        setupPermissions();
        vm.stopBroadcast();

        vm.startBroadcast(contractsManagerKey);
        (bool membership, uint32 delay) =
            AccessManager(manager).hasRole(RolesLib.CONTRACTS_MANAGER_ROLE, contractsManager);

        connectDependencies();
        vm.stopBroadcast();
    }

    function deploy() internal {
        // address igpAddr = vm.envAddress("HUB_IGP");
        address igpAddr = address(new MockInterchainGasPaymaster());
        _deployCore(igpAddr);
    }

    function _deployCore(address igpAddr) internal {
        address mailbox = getMailbox();
        console.log("mailbox", mailbox);

        intentBook = address(new IntentBook(address(new SolutionLib()), manager));
        console.log("intentBook", intentBook);

        mTokenManager = address(new MTokenManager(manager));
        console.log("mTokenManager", mTokenManager);

        mTokenRegistry = address(new MTokenRegistry(mTokenManager, manager));
        console.log("mTokenRegistry", mTokenRegistry);

        receiptManager = address(new ReceiptManager(intentBook, mTokenManager, manager));
        console.log("receiptManager", receiptManager);

        address eventPublisherAddr = address(new HubPublisher());
        eventPublisher = payable(eventPublisherAddr);
        console.log("eventPublisher", eventPublisherAddr);
        HubPublisher(eventPublisher).transferOwnership(contractsManager);

        eventHandler = address(new HubHandler());
        console.log("eventHandler", eventHandler);
        HubHandler(eventHandler).transferOwnership(contractsManager);

        EventVerifier _eventVerifier = new EventVerifier(mailbox, eventHandler);
        console.log("eventVerifier", address(_eventVerifier));
        eventVerifier = payable(address(_eventVerifier));
        _eventVerifier.transferOwnership(contractsManager);

        igp = igpAddr;
        console.log("igp", igp);

        gasAmountOracle = address(new GasAmountOracle());
        console.log("gasAmountOracle", gasAmountOracle);
        GasAmountOracle(gasAmountOracle).transferOwnership(contractsManager);
    }

    function connectDependencies() internal {
        HubHandler(eventHandler).registerEventVerifier(eventVerifier);

        IntentBook(intentBook).setTokenManager(mTokenManager);
        IntentBook(intentBook).addPublisher(medusa);
        IntentBook(intentBook).setReceiptManager(receiptManager);

        MTokenManager(mTokenManager).setReceiptManager(receiptManager);
        MTokenManager(mTokenManager).setIntentBook(intentBook);
        MTokenManager(mTokenManager).setTokenRegistry(mTokenRegistry);
    }

    function setupPermissions() internal {
        console.log("Setting up permissions");
        setTargetFunctionsForMTokenRegistry();
        console.log("MTokenRegistry done");
        setTargetFunctionsForMTokenManager();
        setTargetFunctionsForIntentBook();
    }

    function setTargetFunctionsForMTokenRegistry() internal {
        console.log("inside setTargetFunctionsForMTokenRegistry");

        MTokenRegistry mTokenRegistryContract = MTokenRegistry(mTokenRegistry);
        AccessManager accessManager = AccessManager(manager);
        bytes4[] memory mTokenRegistrySelectors = new bytes4[](4);
        mTokenRegistrySelectors[0] = mTokenRegistryContract.createMToken.selector;
        mTokenRegistrySelectors[1] = mTokenRegistryContract.pauseMToken.selector;
        mTokenRegistrySelectors[2] = mTokenRegistryContract.unpauseMToken.selector;
        mTokenRegistrySelectors[3] = mTokenRegistryContract.destroyMToken.selector;
        console.log("mTokenRegistrySelectors created");
        accessManager.setTargetFunctionRole(mTokenRegistry, mTokenRegistrySelectors, RolesLib.CONTRACTS_MANAGER_ROLE);
    }

    function setTargetFunctionsForMTokenManager() internal {
        MTokenManager mTokenManager = MTokenManager(mTokenManager);
        AccessManager accessManager = AccessManager(manager);
        bytes4[] memory mTokenManagerSelectors = new bytes4[](5);
        bytes4[] memory mTokenManagerWithdrawSelectors = new bytes4[](4);
        bytes4[] memory mtokenMinterSelectors = new bytes4[](4);

        mTokenManagerSelectors[0] = mTokenManager.setIntentBook.selector;
        mTokenManagerSelectors[1] = mTokenManager.setReceiptManager.selector;
        mTokenManagerSelectors[2] = mTokenManager.setTokenRegistry.selector;
        mTokenManagerSelectors[3] = mTokenManager.setWithdrawalHandler.selector;

        mTokenManagerWithdrawSelectors[0] = mTokenManager.withdrawMToken.selector;
        mTokenManagerWithdrawSelectors[1] = mTokenManager.withdrawIntentBalance.selector;

        mtokenMinterSelectors[0] = mTokenManager.mintMToken.selector;
        accessManager.setTargetFunctionRole(
            address(mTokenManager), mTokenManagerSelectors, RolesLib.CONTRACTS_MANAGER_ROLE
        );

        accessManager.setTargetFunctionRole(
            address(mTokenManager), mTokenManagerWithdrawSelectors, RolesLib.MTOKEN_REMOTE_WITHDRAWER_ROLE
        );

        accessManager.setTargetFunctionRole(address(mTokenManager), mtokenMinterSelectors, RolesLib.MTOKEN_MINTER_ROLE);
    }

    function setTargetFunctionsForIntentBook() internal {
        IntentBook intentBook = IntentBook(intentBook);
        AccessManager accessManager = AccessManager(manager);
        bytes4[] memory intentBookUpdaterSelectors = new bytes4[](4);
        bytes4[] memory intentBookPublisherSelectors = new bytes4[](4);
        bytes4[] memory intentBookSelectors = new bytes4[](5);
        bytes4[] memory intentBookCancellerSelectors = new bytes4[](2);

        intentBookUpdaterSelectors[0] = intentBook.lockIntent.selector;
        intentBookUpdaterSelectors[1] = intentBook.solve.selector;

        intentBookPublisherSelectors[0] = intentBook.publishIntent.selector;

        intentBookSelectors[0] = intentBook.setReceiptManager.selector;
        intentBookSelectors[1] = intentBook.setTokenManager.selector;
        intentBookSelectors[2] = intentBook.setMinimumFillPercentage.selector;
        intentBookSelectors[3] = intentBook.setMaxLockDuration.selector;
        intentBookSelectors[4] = intentBook.addPublisher.selector;

        intentBookCancellerSelectors[0] = intentBook.cancelIntent.selector;
        intentBookCancellerSelectors[1] = intentBook.cancelIntentForAuthor.selector;

        accessManager.setTargetFunctionRole(address(intentBook), intentBookSelectors, RolesLib.CONTRACTS_MANAGER_ROLE);

        accessManager.setTargetFunctionRole(
            address(intentBook), intentBookPublisherSelectors, RolesLib.INTENT_PUBLISHER_ROLE
        );

        accessManager.setTargetFunctionRole(
            address(intentBook), intentBookUpdaterSelectors, RolesLib.INTENT_UPDATER_ROLE
        );

        accessManager.setTargetFunctionRole(
            address(intentBook), intentBookCancellerSelectors, RolesLib.INTENT_CANCELLER_ROLE
        );
    }
}
