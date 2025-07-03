// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IntentBook} from "../../src/hub/IntentBook.sol";
import {MTokenManager} from "../../src/hub/MTokenManager.sol";
import {ReceiptManager} from "../../src/hub/ReceiptManager.sol";
import {MTokenRegistry} from "../../src/modules/MTokenRegistry.sol";
import {MTokenCrossChainAdapter} from "../../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {HubPublisher} from "../../src/event_system/HubPublisher.sol";
import {HubHandler} from "../../src/event_system/HubHandler.sol";
import {SolutionLib} from "../../src/libraries/SolutionLib.sol";
import {MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH} from "../../src/types/Events.sol";
import {EventVerifier} from "../../src/event_system/EventVerifier.sol";
import {MockInterchainGasPaymaster} from "../../src/event_system/MockInterchainGasPaymaster.sol";
import {GasAmountOracle} from "../../src/event_system/GasAmountOracle.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {ProdBaseScript, DeploymentInfoSource} from "./ProdBaseScript.s.sol";
import {ProdBaseHubScript} from "./ProdBaseHubScript.s.sol";

contract HubDeployCoreProtocol is ProdBaseHubScript {
    function run() public override {
        preProcess();

        vm.startBroadcast(manager);
        loadAddresses();
        configure();

        vm.stopBroadcast();
    }

    function loadAddresses() internal {
        intentBook = getContractAddressFromBroadcast("IntentBook", "ProdHubDeployCoreProtocol.s.sol", chainId);
        mTokenManager = getContractAddressFromBroadcast("MTokenManager", "ProdHubDeployCoreProtocol.s.sol", chainId);
        mTokenRegistry = getContractAddressFromBroadcast("MTokenRegistry", "ProdHubDeployCoreProtocol.s.sol", chainId);
        receiptManager = getContractAddressFromBroadcast("ReceiptManager", "ProdHubDeployCoreProtocol.s.sol", chainId);
        eventPublisher =
            payable(getContractAddressFromBroadcast("HubPublisher", "ProdHubDeployCoreProtocol.s.sol", chainId));
        eventHandler = getContractAddressFromBroadcast("HubHandler", "ProdHubDeployCoreProtocol.s.sol", chainId);
        eventVerifier = getContractAddressFromBroadcast("EventVerifier", "ProdHubDeployCoreProtocol.s.sol", chainId);
        // igp = getContractAddressFromBroadcast("MockInterchainGasPaymaster", "ProdHubDeployCoreProtocol.s.sol", chainId);
        // gasAmountOracle = getContractAddressFromBroadcast("GasAmountOracle", "ProdHubDeployCoreProtocol.s.sol", chainId);
    }

    function configure() internal {
        HubHandler(eventHandler).registerEventVerifier(eventVerifier);

        IntentBook(intentBook).setReceiptManager(receiptManager);
        IntentBook(intentBook).setTokenManager(mTokenManager);
        IntentBook(intentBook).addPublisher(medusa);
        IntentBook(intentBook).addSolver(medusa);

        MTokenManager(mTokenManager).setReceiptManager(receiptManager);
        MTokenManager(mTokenManager).setIntentBook(intentBook);
        MTokenManager(mTokenManager).setTokenRegistry(mTokenRegistry);
        MTokenManager(mTokenManager).addAuthorizedMinter(intentBook);
        MTokenManager(mTokenManager).addAuthorizedMinter(receiptManager);
        MTokenManager(mTokenManager).addAuthorizedMinter(medusa);
        MTokenManager(mTokenManager).addAuthorizedLocker(medusa);
    }
}
