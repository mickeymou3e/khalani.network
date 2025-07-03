// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./ProdBaseHubScript.s.sol";
import {GasAmountOracle} from "../../src/event_system/GasAmountOracle.sol";

contract ProdHubSetGasAmount is BaseHubScript {
    function run() public override {
        preProcess();
        spokeChainId = getSpokeChainId();
        gasAmountOracle = getContractAddressFromBroadcast("GasAmountOracle", "ProdHubDeployCoreProtocol.s.sol", chainId);

        vm.startBroadcast(contractsManager);
        GasAmountOracle(gasAmountOracle).setGasAmount(uint32(chainId), uint32(spokeChainId), 250_000);
        vm.stopBroadcast();
    }
}
