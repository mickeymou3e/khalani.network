pragma solidity ^0.8.4;

library TokenEventLibrary {

    event LockToken(bytes32 indexed intentId, uint256 nonce, address asset, uint256 amount);
    event UnlockToken(bytes32 indexed intentId, address asset, uint256 amount);

    string constant LOCK_TOKEN = "LockToken";
    string constant UNLOCK_TOKEN = "UnlockToken";

    //Struct for LockToken event
    struct LockTokenEvent {
        bytes32 intentId;
    }

    //Struct for UnlockToken event
    struct UnlockTokenEvent {
        bytes32 intentId;
    }

    function calculateLockTokenEventHash(LockTokenEvent memory _event) internal view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                LOCK_TOKEN,
                _event.intentId,
                block.chainid
            )
        );
    }

    function calculateUnlockTokenEventHash(UnlockTokenEvent memory _event) internal view returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                UNLOCK_TOKEN,
                _event.intentId,
                block.chainid
            )
        );
    }

    function calculateLockTokenEventHashFromRemoteChain(LockTokenEvent memory _event, uint32 chainId) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                LOCK_TOKEN,
                _event.intentId,
                uint256(chainId)
            )
        );
    }

    function calculateUnlockTokenEventHashForRemoteChain(UnlockTokenEvent memory _event, uint32 chainId) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                UNLOCK_TOKEN,
                _event.intentId,
                uint256(chainId)
            )
        );
    }
}