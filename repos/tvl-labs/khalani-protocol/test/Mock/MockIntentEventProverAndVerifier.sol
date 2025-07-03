pragma solidity ^0.8.4;

import "../../src/Intents/libraries/SwapIntentEventLibrary.sol";
import {EventProver} from "../../src/Intents/proof/EventProver.sol";
import {EventVerifier} from "../../src/Intents/proof/EventVerifier.sol";

contract MockIntentEventProverAndVerifier is EventProver, EventVerifier {
    mapping(bytes32 => bool) private provedEvents;

    function registerEvent(bytes32 eventHash) public override {
        provedEvents[eventHash] = true;
    }

    function verify(bytes32 eventHash) public override returns (bool) {
        return provedEvents[eventHash];
    }
}