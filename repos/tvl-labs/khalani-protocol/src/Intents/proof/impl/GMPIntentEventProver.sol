pragma solidity ^0.8.4;

import "../GMPEventProver.sol";


contract GMPIntentEventProver is GMPEventProver {

    constructor(address _gmpEventVerifier, address _hyperlaneMailbox, address _hyperlaneIgp, uint32 _destinationChainDomain)
    GMPEventProver(_gmpEventVerifier, _hyperlaneMailbox, _hyperlaneIgp, _destinationChainDomain) {
    }
}