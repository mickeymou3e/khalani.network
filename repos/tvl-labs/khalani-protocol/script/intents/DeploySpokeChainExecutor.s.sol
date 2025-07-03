pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../../src/Intents/SpokeChainExecutor.sol";
import {MockPermit2} from "../../test/Mock/MockPermit2.sol";
import "../../src/Intents/proof/impl/GMPIntentEventProver.sol";

contract DeploySpokeChainExecutor is Script {
    function run() public {

        vm.createSelectFork("https://avalanche-fuji.infura.io/v3/4133190de059407bbbe086a833dfe409");
        vm.startBroadcast();

        EventProver SPOKE_CHAIN_EVENT_PROVER = EventProver(vm.envAddress("SPOKE_CHAIN_EVENT_PROVER"));


        SpokeChainExecutor spokeChainExecutor = new SpokeChainExecutor(EventProver(SPOKE_CHAIN_EVENT_PROVER));
        console.log("Deployed Spoke Chain Executor at %s", address(spokeChainExecutor));
        GMPEventProver(address (SPOKE_CHAIN_EVENT_PROVER)).addEventRegisterer(address(spokeChainExecutor));

        vm.stopBroadcast();
    }
}