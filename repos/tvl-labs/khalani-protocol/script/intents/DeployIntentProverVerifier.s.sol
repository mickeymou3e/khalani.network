pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../../src/Intents/proof/impl/GMPIntentEventVeifier.sol";
import "../../src/Intents/proof/impl/GMPIntentEventProver.sol";
import "../../src/Intents/registry/GMPVerifierRegistry.sol";
import "../lib/LibConfig.sol";
import "../../src/Intents/Escrow.sol";
import "../../src/Intents/registry/ProverRegistry.sol";
import "../../src/Intents/registry/GMPProverRegistry.sol";
import "../../src/Intents/SwapIntentRewarder.sol";

contract DeployIntentProverVerifier is Script {

    LibConfig.DeployConfig deployConfigSpoke;
    LibConfig.DeployConfig deployConfigKhalani;
    LibConfig.DeployedContracts deployedContracts;
    LibConfig.KhalaniContracts khalaniContracts;

    function deployVerifierProverRegistry() public {
        string memory khalaniChain = vm.envString("KHALANI_CHAIN");
        deployConfigKhalani = LibConfig.parseDeployConfigForChain(khalaniChain, vm);
        vm.createSelectFork(deployConfigKhalani.rpcUrl);
        vm.startBroadcast();
        deployVerifierRegistry();
        deployProverRegistry();
        vm.stopBroadcast();
        LibConfig.writeKhalaniContracts(khalaniContracts, khalaniChain, vm);
    }
    //one time call
    function deployVerifierRegistry() public {
        GMPVerifierRegistry verifierRegistry = new GMPVerifierRegistry();
        console.log("verifier registry deployed at %s", address(verifierRegistry));
        khalaniContracts.verifierRegistry = address(verifierRegistry);
    }

    function deployProverRegistry() public {
        GMPProverRegistry proverRegistry = new GMPProverRegistry();
        console.log("prover registry deployed at %s", address(proverRegistry));
        khalaniContracts.proverRegistry = address(proverRegistry);
    }

    function deployIntentEscrowAndProverVerifierPair() public {

        string memory khalaniChain = vm.envString("KHALANI_CHAIN");
        string memory spokeChain = vm.envString("SPOKE_CHAIN");

        deployConfigKhalani = LibConfig.parseDeployConfigForChain(khalaniChain, vm);
        deployConfigSpoke = LibConfig.parseDeployConfigForChain(spokeChain, vm);
        khalaniContracts = LibConfig.readKhalaniContracts(khalaniChain, vm);

        address proverRegistry = khalaniContracts.proverRegistry;
        address verifierRegistry = khalaniContracts.verifierRegistry;

        //khalani-chain
        uint256 forkId = vm.createFork(deployConfigKhalani.rpcUrl);

        vm.selectFork(forkId);
        vm.startBroadcast();
        deployedContracts.hubVerifier = deployKhalaniChainVerifier();
        deployedContracts.hubProver = deployKhalaniChainProver();
        registerVerifier(verifierRegistry, deployConfigSpoke.chainId, deployedContracts.hubVerifier);
        registerProver(proverRegistry, deployConfigSpoke.chainId, deployedContracts.hubProver);
        vm.stopBroadcast();
        //khalani-chain

        //spoke
        vm.createSelectFork(deployConfigSpoke.rpcUrl);
        vm.startBroadcast();
        deployedContracts.spokeVerifier = deploySpokeChainVerifier();
        deployedContracts.spokeProver = deploySpokeChainProver(deployedContracts.hubVerifier);
        deployedContracts.spokeEscrow = deployEscrow(deployedContracts.spokeProver);
        addEventRegistererToProver(deployedContracts.spokeEscrow,deployedContracts.spokeProver);
        initialiseSpokeChainVerifier(deployedContracts.spokeVerifier, deployedContracts.hubProver, uint32(deployConfigKhalani.chainId));
        vm.stopBroadcast();
        //spoke-end

        vm.selectFork(forkId);
        vm.startBroadcast();
        initialiseKhalaniChainVerifier(deployedContracts.hubVerifier, deployedContracts.spokeProver, uint32(deployConfigSpoke.chainId));
        deployRewarder();
        vm.stopBroadcast();
        LibConfig.writeDeployedContracts(deployedContracts, spokeChain, vm);
    }

    function deployEscrow(address prover) internal returns(address escrowAddr) {
        Escrow escrow = new Escrow(IPermit2(deployConfigSpoke.permit2), EventProver(prover));
        escrowAddr = address(escrow);
        console.log("escrow deployed at : %s", escrowAddr);
    }

    function deployKhalaniChainVerifier() internal returns (address) {
        GMPIntentEventVerifier verifier = new GMPIntentEventVerifier();
        console.log("Khalani Verifier deployed at %s", address(verifier));
        return address(verifier);
    }

    function deployKhalaniChainProver() internal returns (address) {
        GMPIntentEventProver prover = new GMPIntentEventProver(address(0), deployConfigKhalani.hyperlaneMailbox, address(0), uint32(deployConfigKhalani.chainId));
        console.log("Khalani Chain Prover deployed at %s", address(prover));
        return address(prover);
    }

    function deploySpokeChainVerifier() internal returns (address) {
        GMPIntentEventVerifier verifier = new GMPIntentEventVerifier();
        console.log("Spoke Verifier deployed at %s", address(verifier));
        return address(verifier);
    }

    function deploySpokeChainProver(address khalaniChainVerifier) internal returns (address) {
        GMPIntentEventProver prover = new GMPIntentEventProver(khalaniChainVerifier, deployConfigSpoke.hyperlaneMailbox, address(0), uint32(deployConfigKhalani.chainId));
        console.log("Spoke Chain Prover deployed at %s", address(prover));
        return address(prover);
    }

    function initialiseKhalaniChainVerifier(address khalaniChainVerifier, address spokeChainProver, uint32 spokeChainId) internal {
        GMPEventVerifier(khalaniChainVerifier).initialise(
            spokeChainId,
            deployConfigKhalani.hyperlaneMailbox,
            deployConfigKhalani.hyperlaneISM
        );
        GMPEventVerifier(khalaniChainVerifier).addEventRegisterer(spokeChainProver);
    }

    function initialiseSpokeChainVerifier(address spokeChainVerifier, address khalaniChainProver, uint32 khalaniChainId) internal {
        GMPEventVerifier(spokeChainVerifier).initialise(
            khalaniChainId,
            deployConfigSpoke.hyperlaneMailbox,
            deployConfigSpoke.hyperlaneISM
        );
        GMPEventVerifier(spokeChainVerifier).addEventRegisterer(khalaniChainProver);
    }

    function addEventRegistererToProver(address eventRegisterer, address prover) internal { //ESCROW
        GMPIntentEventProver(prover).addEventRegisterer(eventRegisterer);
    }

    function registerVerifiers() public {
        VerifierRegistry verifierRegistry;
        uint32[] memory chainId;
        address[] memory verifier;
        for (uint i ; i < chainId.length; i++){
            verifierRegistry.addVerifierForChain(chainId[i], verifier[i]);
        }
    }

    function registerProvers() public {
        ProverRegistry proverRegistry;
        uint32[] memory chainId;
        address[] memory prover;
        for (uint i ; i < chainId.length; i++){
            proverRegistry.addProverForChain(chainId[i], prover[i]);
        }
    }

    function registerVerifier(address verifierRegistryAddr, uint256 chainId, address verifier) internal {
        VerifierRegistry verifierRegistry = VerifierRegistry(verifierRegistryAddr);
        verifierRegistry.addVerifierForChain(uint32(chainId), verifier);
    }

    function registerProver(address proverRegistryAddr, uint256 chainId, address prover) internal {
        ProverRegistry proverRegistry = ProverRegistry(proverRegistryAddr);
        proverRegistry.addProverForChain(uint32(chainId), prover);
    }

    function deployRewarder() public {
        SwapIntentRewarder rewarder = new SwapIntentRewarder();
        console.log("Rewarder deployed at %s", address(rewarder));
        khalaniContracts.rewarder = address(rewarder);
    }
}