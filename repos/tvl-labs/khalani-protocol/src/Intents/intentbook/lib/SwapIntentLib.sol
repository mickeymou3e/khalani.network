pragma solidity ^0.8.4;

library SwapIntentLib {
    // Define the SwapIntent struct
    struct SwapIntent {
        address author;
        uint32 sourceChainId;
        uint32 destinationChainId;
        address sourceToken;
        address destinationToken;
        uint256 sourceAmount;
        bytes sourcePermit2;
        uint256 deadline;
        uint256 nonceIndex;
        uint256 nonceBitToFlip;
    }

    struct SwapIntentBid {
        address filler;
        uint fillAmount;
    }

    bytes32 constant public INTENT_TYPE_HASH = keccak256(
        'SwapIntent('
        'address author,'
        'uint32 destinationChainId,'
        'address destinationToken,'
        'uint256 sourceAmount,'
        'uint32 sourceChainId,'
        'bytes sourcePermit2,'
        'address sourceToken,'
        'uint256 nonce,'
        'uint256 deadline,'
        'uint256 nonceIndex,'
        'uint256 nonceBitToFlip'
        ')'
    );

    function _getIntentHash(SwapIntent memory intent) internal view returns (bytes32) {
        bytes32 DOMAIN_HASH = keccak256(abi.encode(
            keccak256('EIP712Domain(string name,string version,uint256 chainId)'),
            keccak256('KhalaniSwapIntent'),
            keccak256('1.0.0'),
            block.chainid
        ));

        bytes32 structHash = keccak256(abi.encode(
            INTENT_TYPE_HASH,
            intent.author,
            intent.destinationChainId,
            intent.destinationToken,
            intent.sourceAmount,
            intent.sourceChainId,
            keccak256(intent.sourcePermit2),
            intent.sourceToken,
            intent.deadline,
            intent.nonceIndex,
            intent.nonceBitToFlip
        ));
        return keccak256(abi.encodePacked('\x19\x01', DOMAIN_HASH, structHash));
    }

    function calculateSwapIntentId(SwapIntent memory intent) internal pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                intent.author,
                intent.sourceChainId,
                intent.destinationChainId,
                intent.sourceToken,
                intent.destinationToken,
                intent.sourceAmount,
                intent.sourcePermit2,
                intent.deadline,
                intent.nonceIndex,
                intent.nonceBitToFlip
            )
        );
    }

}

