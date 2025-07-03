pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import {GMPVerifierRegistry} from "../../src/Intents/registry/GMPVerifierRegistry.sol";
import {GMPProverRegistry} from "../../src/Intents/registry/GMPProverRegistry.sol";

contract DeployKhalaniProver is Script {
    function run() public {
        vm.startBroadcast();

        GMPProverRegistry proverRegistry = new GMPProverRegistry();
        console.log("Prover registry: ", address(proverRegistry));

        vm.stopBroadcast();
    }
}