pragma solidity ^0.8.4;

library SlowBridgeIntentsLibrary {

    function calculateLockTokenIntentId(
        uint nonce,
        uint256 chainId,
        address author,
        address asset,
        uint256 amount,
        address receiver
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(nonce, author, chainId, asset, amount, receiver));
    }

    function calculateUnlockTokenIntentId(
        uint nonce,
        uint256 chainId,
        address author,
        address asset,
        uint256 amount,
        address receiver
    ) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(nonce, author, chainId, asset, amount, receiver));
    }
}