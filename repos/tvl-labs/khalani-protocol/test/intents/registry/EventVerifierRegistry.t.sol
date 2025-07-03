pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../../../src/Intents/registry/GMPVerifierRegistry.sol";
import "../../../src/Intents/proof/EventVerifier.sol";

contract ProverRegistryTest is Test {
    GMPVerifierRegistry registry;
    uint32 chainId1;
    uint32 chainId2;

    function setUp() public {
        registry = new GMPVerifierRegistry();
        chainId1 = 11155111;
        chainId2 = 43113;
    }

    function test_AddVerifierForChain_OnlyOwner() public {
        address prover1 = vm.addr(1);
        address random = vm.addr(2);

        vm.prank(random);
        vm.expectRevert("Ownable: caller is not the owner");
        registry.addVerifierForChain(chainId1, address(EventVerifier(prover1)));

        // owner i.e the deployer address(this) here can only call this function
        registry.addVerifierForChain(chainId1, address(EventVerifier(prover1)));

        assertTrue(registry.proofVerifierForChain(chainId1) == EventVerifier(prover1));
    }

    function test_AddVerifierForChain() public {
        address prover1 = vm.addr(1);
        address prover2 = vm.addr(2);
        registry.addVerifierForChain(chainId1, address(EventVerifier(prover1)));
        registry.addVerifierForChain(chainId2, address(EventVerifier(prover2)));
        
        assertTrue(registry.proofVerifierForChain(chainId1) == EventVerifier(prover1));
        assertTrue(registry.proofVerifierForChain(chainId2) == EventVerifier(prover2));
    }
}