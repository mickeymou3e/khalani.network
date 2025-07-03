pragma solidity ^0.8.4;

library LimitOrderIntentLib {

    struct LimitOrder {
        address author;
        address token;
        uint256 volume;
        uint256 price;
        address outToken;
        uint256 nonceIndex;
        uint256 nonceBitToFlip;
    }

    struct LimitOrderBid {
        address filler;
        uint256 volume;
    }

    bytes32 constant public INTENT_TYPE_HASH = keccak256(
        'LimitOrder('
        'address author,'
        'address token,'
        'uint256 volume,'
        'uint256 price,'
        'address outToken,'
        'uint256 nonceIndex,'
        'uint256 nonceBitToFlip'
        ')'
    );

    function _getIntentHash(LimitOrder memory intent) internal view returns (bytes32) {
        bytes32 DOMAIN_HASH = keccak256(abi.encode(
            keccak256('EIP712Domain(string name,string version,uint256 chainId)'),
            keccak256('KhalaniLimitOrder'),
            keccak256('1.0.0'),
            block.chainid
        ));

        bytes32 structHash = keccak256(abi.encode(
            INTENT_TYPE_HASH,
            intent.author,
            intent.token,
            intent.volume,
            intent.price,
            intent.outToken,
            intent.nonceIndex,
            intent.nonceBitToFlip
        ));

        return keccak256(abi.encodePacked('\x19\x01', DOMAIN_HASH, structHash));
    }
}