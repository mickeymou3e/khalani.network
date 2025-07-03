pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../../src/Intents/Escrow.sol";
import "../../src/Intents/filler/SwapIntentFiller.sol";
import "../../src/Intents/proof/EventProver.sol";
import "./DeployIntentProverVerifier.s.sol";

contract DeploySwapIntentFiller is Script {

    function run() public {
        address SPOKE_CHAIN_EVENT_PROVER = 0xBEf9e8e7087038C1277C75f0D8bec8718fdfE3b9;

        vm.createSelectFork("https://rpc.ankr.com/avalanche_fuji");
        vm.startBroadcast();
        SwapIntentFiller swapIntentFiller = new SwapIntentFiller(EventProver(SPOKE_CHAIN_EVENT_PROVER));
        console.log("Deployed Swap Intent Filler at %s", address(swapIntentFiller));

        GMPIntentEventProver prover = GMPIntentEventProver(SPOKE_CHAIN_EVENT_PROVER);
        prover.addEventRegisterer(address(swapIntentFiller));
        vm.stopBroadcast();
    }
}