pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import {SwapIntentRewarder} from "../../src/Intents/SwapIntentRewarder.sol";

contract DeploySwapIntentRewarder is Script {
    function run() public {
        vm.startBroadcast();

        SwapIntentRewarder rewarder = new SwapIntentRewarder();
        console.log("Swap Intent Rewarder: ", address(rewarder));
        vm.stopBroadcast();
    }
}