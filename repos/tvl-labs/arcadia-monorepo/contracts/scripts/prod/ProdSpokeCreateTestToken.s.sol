// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {CustomERC20} from "../../src/spoke/CustomERC20.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";

contract ProdSpokeCreateTestToken is ProdBaseSpokeScript {
    function run() public override {
        preProcess();
        address mintedTo = vm.envAddress("MINT_TO");
        vm.startBroadcast(contractsManager);
        CustomERC20 token = new CustomERC20("TestToken", "TT");
        console.log("Token deployed at", address(token));
        token.mint(mintedTo, 10 ether);
        vm.stopBroadcast();
    }
}
