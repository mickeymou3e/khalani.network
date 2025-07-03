pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

abstract contract BitFlipMetaTransaction {

    mapping(address => mapping(uint => uint)) public bitmaps;

    function _verifyMetaTransactionSignature(bytes memory signature, bytes32 intentHash, address author) internal {
        require(ECDSA.recover(intentHash, signature) == author, "Verification error: Signer is invalid");
    }

    function _replayProtection(address _signer, uint _nonceIndex, uint _nonceBitToFlip) internal {
        require(bitmaps[_signer][_nonceIndex] & _nonceBitToFlip != _nonceBitToFlip, "Nonce already flipped.");
        bitmaps[_signer][_nonceIndex] = bitmaps[_signer][_nonceIndex] | _nonceBitToFlip;
    }

}