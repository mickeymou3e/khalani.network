pragma solidity ^0.8.4;

import "../../src/Intents/libraries/SwapIntentEventLibrary.sol";

contract MockGMPIntentEventVerifier {
    bool public flag;

    function setFlag(bool _flag) public {
        flag = _flag;
    }

    function verifySwapIntentTokenLockEvent(
        SwapIntentEventLibrary.SwapIntentTokenLock calldata event_
    ) public view returns (bool) {
        bytes32 eventHash = SwapIntentEventLibrary.calculateSwapIntentTokenLockEventHash(event_);
        if (flag == true) {
            return true;
        } else {
            return false;
        }
    }

    function verifySwapIntentFilledEvent(
        SwapIntentEventLibrary.SwapIntentFilled calldata event_
    ) public view returns (bool) {
        bytes32 eventHash = SwapIntentEventLibrary.calculateSwapIntentFilledEventHash(event_);
        if (flag == true) {
            return true;
        } else {
            return false;
        }
    }
}