// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";
import {EventProver} from "../../src/event_system/EventProver.sol";
import {EventVerifier} from "../../src/event_system/EventVerifier.sol";

contract ProdSpokeConnectRemoteProver is ProdBaseSpokeScript {
    function run() public override {
        preProcess();
        hubChainId = getHubChainId();
        address hubEventProver = vm.envAddress("EVENT_PROVER");
        eventVerifier = getContractAddressFromBroadcast("EventVerifier", "ProdSpokeDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManager);
        EventVerifier(payable(eventVerifier)).addRemoteProver(hubEventProver);
        vm.stopBroadcast();
    }
}
