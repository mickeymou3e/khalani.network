// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./ProdBaseHubScript.s.sol";
import {EventProver} from "../../src/event_system/EventProver.sol";
import {EventVerifier} from "../../src/event_system/EventVerifier.sol";

contract ProdHubConnectRemoteProver is BaseHubScript {
    function run() public override {
        preProcess();
        spokeChainId = getSpokeChainId();
        address spokeEventProver =
            getContractAddressFromBroadcast("EventProver", "ProdSpokeDeployCoreProtocol.s.sol", spokeChainId);
        eventVerifier = getContractAddressFromBroadcast("EventVerifier", "ProdHubDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManager);
        EventVerifier(payable(eventVerifier)).addRemoteProver(spokeEventProver);
        vm.stopBroadcast();
    }
}
