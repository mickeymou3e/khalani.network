// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseSpokeScript} from "./BaseSpokeScript.s.sol";

import {GasAmountOracle} from "../src/event_system/GasAmountOracle.sol";

contract SpokeSetGasAmount is BaseSpokeScript {
    function run() public override {
        preProcess();
        hubChainId = getHubChainId();

        gasAmountOracle = getContractAddressFromBroadcast("GasAmountOracle", "SpokeDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManagerKey);
        GasAmountOracle(gasAmountOracle).setGasAmount(uint32(chainId), uint32(hubChainId), 500_000);
        vm.stopBroadcast();
    }
}
