// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {CustomERC20} from "../../src/spoke/CustomERC20.sol";
import {ProdBaseSpokeScript} from "./ProdBaseSpokeScript.s.sol";

contract ProdSpokeMintAsset is ProdBaseSpokeScript {
    function run() public override {
        preProcess();
        address mintedTo = vm.envAddress("MINT_TO");
        address asset = vm.envAddress("ASSET");
        vm.startBroadcast(contractsManager);
        CustomERC20 token = CustomERC20(asset);

        token.mint(mintedTo, 100 ether);
        vm.stopBroadcast();
    }
}
