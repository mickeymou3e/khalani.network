// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";

import {GasAmountOracle} from "../../src/event_system/GasAmountOracle.sol";

contract ProdSpokeSetGasAmount is ProdBaseSpokeScript {
    function run() public override {
        preProcess();
        hubChainId = getHubChainId();

        gasAmountOracle =
            getContractAddressFromBroadcast("GasAmountOracle", "ProdSpokeDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManager);
        GasAmountOracle(gasAmountOracle).setGasAmount(uint32(chainId), uint32(hubChainId), 250_000);
        vm.stopBroadcast();
    }
}
