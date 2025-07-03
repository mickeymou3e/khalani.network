pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../../../src/Intents/registry/GMPProverRegistry.sol";
import "../../../src/Intents/proof/EventProver.sol";

contract ProverRegistryTest is Test {
    GMPProverRegistry registry;
    uint32 chainId1;
    uint32 chainId2;

    function setUp() public {
        registry = new GMPProverRegistry();
        chainId1 = 11155111;
        chainId2 = 43113;
    }

    function test_AddProverForChain_OnlyOwner() public {
        address prover1 = vm.addr(1);
        address random = vm.addr(2);

        vm.prank(random);
        vm.expectRevert("Ownable: caller is not the owner");
        registry.addProverForChain(chainId1, address(EventProver(prover1)));

        // owner i.e the deployer address(this) here can only call this function
        registry.addProverForChain(chainId1, address(EventProver(prover1)));

        assertTrue(registry.proverForChain(chainId1) == EventProver(prover1));
    }

    function test_AddProverForChain() public {
        address prover1 = vm.addr(1);
        address prover2 = vm.addr(2);
        registry.addProverForChain(chainId1, address(EventProver(prover1)));
        registry.addProverForChain(chainId2, address(EventProver(prover2)));
        
        assertTrue(registry.proverForChain(chainId1) == EventProver(prover1));
        assertTrue(registry.proverForChain(chainId2) == EventProver(prover2));
    }
}