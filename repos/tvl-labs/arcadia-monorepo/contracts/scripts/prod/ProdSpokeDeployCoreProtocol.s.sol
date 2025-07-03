// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";
import {EventVerifier} from "../../src/event_system/EventVerifier.sol";
import {EventProver} from "../../src/event_system/EventProver.sol";
import {SpokePublisher} from "../../src/event_system/SpokePublisher.sol";
import {SpokeHandler} from "../../src/event_system/SpokeHandler.sol";
import {GasAmountOracle} from "../../src/event_system/GasAmountOracle.sol";
import {MockInterchainGasPaymaster} from "../../src/event_system/MockInterchainGasPaymaster.sol";

contract ProdSpokeDeployCoreProtocol is ProdBaseSpokeScript {
    function run() public override {
        preProcess();
        vm.startBroadcast(contractsManager);
        hubChainId = getHubChainId();
        hubEventVerifier = getHubEventVerifier();
        mailbox = getMailbox();
        igp = vm.envAddress("SPOKE_IGP");
        console.log("hubEventVerifier", hubEventVerifier);
        deployCore();

        // vm.startBroadcast(contractsManager);
        connectDependencies();
        vm.stopBroadcast();
    }

    function deployCore() internal {
        gasAmountOracle = address(new GasAmountOracle());
        eventPublisher = payable(address(new SpokePublisher(uint32(hubChainId))));
        eventHandler = address(new SpokeHandler(uint32(hubChainId)));
        eventVerifier = address(new EventVerifier(mailbox, eventHandler));
        eventProver = address(new EventProver(mailbox, hubEventVerifier, uint32(hubChainId), igp, gasAmountOracle));

        // GasAmountOracle(gasAmountOracle).transferOwnership(contractsManager);
        // SpokePublisher(eventPublisher).transferOwnership(contractsManager);
        // SpokeHandler(eventHandler).transferOwnership(contractsManager);
        // EventVerifier(payable(eventVerifier)).transferOwnership(contractsManager);
        // EventProver(eventProver).transferOwnership(contractsManager);
    }

    function connectDependencies() internal {
        SpokePublisher(eventPublisher).registerEventProver(uint32(hubChainId), eventProver);
        SpokeHandler(eventHandler).registerEventVerifier(eventVerifier);
        EventProver(eventProver).addEventPublisher(eventPublisher);
    }
}
