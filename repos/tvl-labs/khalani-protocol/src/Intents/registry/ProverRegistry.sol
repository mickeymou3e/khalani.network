pragma solidity ^0.8.4;

import "openzeppelin-contracts/contracts/access/Ownable.sol";
import "../proof/EventProver.sol";

//Deployed on Khalani chain and keeps registry of prover contract which sends the proof for a remote chain
abstract contract ProverRegistry is Ownable {
    mapping(uint32 => EventProver) public proverForChain; // map(chainId, proverAddress)

    function addProverForChain(
        uint32 chainId,
        address prover
    ) public onlyOwner {
        proverForChain[chainId] = EventProver(prover);
    }
}