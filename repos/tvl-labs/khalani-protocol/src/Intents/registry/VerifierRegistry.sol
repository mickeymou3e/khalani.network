pragma solidity ^0.8.4;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "../proof/EventVerifier.sol";


abstract contract VerifierRegistry is Ownable {
    mapping(uint32 => EventVerifier) public proofVerifierForChain; // map(chainId, verifierAddress)

    function addVerifierForChain(
        uint32 chainId,
        address verifier
    ) public onlyOwner {
        proofVerifierForChain[chainId] = EventVerifier(verifier);
    }
}