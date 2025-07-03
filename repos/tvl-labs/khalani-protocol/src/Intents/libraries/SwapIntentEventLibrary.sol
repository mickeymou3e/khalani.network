pragma solidity ^0.8.0;

library SwapIntentEventLibrary {

    struct SwapIntentTokenLock {
        bytes32 intentId;
    }

    struct SwapIntentTokenBurn {
        bytes32 intentId;
    }

    struct SwapIntentFilled {
        bytes32 intentId;
        address filler;
        uint256 fillAmount;
    }

    function calculateSwapIntentTokenLockEventHash(SwapIntentTokenLock memory _event) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "SwapIntentTokenLock",
                _event.intentId
            )
        );
    }

    function calculateSwapIntentTokenBurnEventHash(SwapIntentTokenBurn memory _event) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "SwapIntentTokenBurn",
                _event.intentId
            )
        );
    }

    function calculateSwapIntentFilledEventHash(SwapIntentFilled memory _event) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                "SwapIntentFilled",
                _event.intentId,
                _event.filler,
                _event.fillAmount
            )
        );
    }
}