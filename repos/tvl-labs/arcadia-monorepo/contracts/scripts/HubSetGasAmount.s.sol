// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./BaseHubScript.s.sol";
import {GasAmountOracle} from "../src/event_system/GasAmountOracle.sol";

contract HubSetGasAmount is BaseHubScript {
    function run() public override {
        preProcess();
        spokeChainId = getSpokeChainId();
        gasAmountOracle = getContractAddressFromBroadcast("GasAmountOracle", "HubDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManagerKey);
        GasAmountOracle(gasAmountOracle).setGasAmount(uint32(chainId), uint32(spokeChainId), 500_000);
        vm.stopBroadcast();
    }
}
