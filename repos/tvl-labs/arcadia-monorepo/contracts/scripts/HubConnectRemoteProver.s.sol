// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./BaseHubScript.s.sol";
import {EventProver} from "../src/event_system/EventProver.sol";
import {EventVerifier} from "../src/event_system/EventVerifier.sol";

contract HubConnectRemoteProver is BaseHubScript {
    function run() public override {
        preProcess();
        spokeChainId = getSpokeChainId();
        address spokeEventProver =
            getContractAddressFromBroadcast("EventProver", "SpokeDeployCoreProtocol.s.sol", spokeChainId);
        eventVerifier = getContractAddressFromBroadcast("EventVerifier", "HubDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManagerKey);
        EventVerifier(payable(eventVerifier)).addRemoteProver(spokeEventProver);
        vm.stopBroadcast();
    }
}
