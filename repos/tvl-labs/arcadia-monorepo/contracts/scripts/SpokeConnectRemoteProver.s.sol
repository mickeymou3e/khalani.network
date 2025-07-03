// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseSpokeScript} from "./BaseSpokeScript.s.sol";
import {EventProver} from "../src/event_system/EventProver.sol";
import {EventVerifier} from "../src/event_system/EventVerifier.sol";

contract SpokeConnectRemoteProver is BaseSpokeScript {
    function run() public override {
        preProcess();
        hubChainId = getHubChainId();
        address hubEventProver =
            getContractAddressFromBroadcast("EventProver", "HubConnectProverToVerifier.s.sol", hubChainId);
        eventVerifier = getContractAddressFromBroadcast("EventVerifier", "SpokeDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManagerKey);
        EventVerifier(payable(eventVerifier)).addRemoteProver(hubEventProver);
        vm.stopBroadcast();
    }
}
