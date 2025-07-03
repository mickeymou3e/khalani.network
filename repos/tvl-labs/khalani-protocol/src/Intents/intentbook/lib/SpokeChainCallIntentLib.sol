pragma solidity ^0.8.4;

library SpokeChainCallIntentLib {
    // Define the SpokeChainCall struct
    struct SpokeChainCall {
        address author;
        uint32 chainId;
        bytes callData;
        address contractToCall;
        address token;
        uint256 amount;
        address rewardToken;
        uint256 rewardAmount;
        uint256 nonceIndex;
        uint256 nonceBitToFlip;
    }

    struct SpokeChainCallBid {
        address caller;
    }

    bytes32 constant public INTENT_TYPE_HASH = keccak256(
        'SpokeChainCall('
        'address author,'
        'uint32 chainId,'
        'bytes callData,'
        'address contractToCall,'
        'address token,'
        'uint256 amount,'
        'uint256 nonceIndex,'
        'uint256 nonceBitToFlip'
        ')'
    );

    function _getIntentHash(SpokeChainCall memory intent) internal view returns (bytes32) {
        bytes32 DOMAIN_HASH = keccak256(abi.encode(
            keccak256('EIP712Domain(string name,string version,uint256 chainId)'),
            keccak256('SpokeChainCall'),
            keccak256('1.0.0'),
            block.chainid
        ));

        bytes32 structHash = keccak256(abi.encode(
            INTENT_TYPE_HASH,
            intent.author,
            intent.chainId,
            keccak256(intent.callData),
            intent.contractToCall,
            intent.token,
            intent.amount,
            intent.rewardToken,
            intent.rewardAmount,
            intent.nonceIndex,
            intent.nonceBitToFlip
        ));
        return keccak256(abi.encodePacked('\x19\x01', DOMAIN_HASH, structHash));
    }
}