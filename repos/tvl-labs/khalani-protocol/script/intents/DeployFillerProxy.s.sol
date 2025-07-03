pragma solidity ^0.8.19;

import "forge-std/Script.sol";
import "../../src/Intents/Escrow.sol";
import "../../src/Intents/filler/SwapIntentFiller.sol";
import "../../src/Intents/proof/EventProver.sol";
import "./DeployIntentProverVerifier.s.sol";
import {SpokeChainExecutor} from "../../src/Intents/SpokeChainExecutor.sol";

contract DeployFillerProxy is Script {

    LibConfig.DeployConfig deployConfig;
    LibConfig.DeployedContracts deployedContracts;

    function run() public {
        string memory spokeChain = vm.envString("SPOKE_CHAIN");
        deployConfig = LibConfig.parseDeployConfigForChain(spokeChain, vm);
        deployedContracts = LibConfig.readDeployedContracts(spokeChain, vm);

        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();

        //Swap Intent Filler Deployment
        SwapIntentFiller swapIntentFiller = new SwapIntentFiller(EventProver(deployedContracts.spokeProver));
        deployedContracts.swapIntentFiller = address(swapIntentFiller);
        console.log("Deployed Swap Intent Filler at %s", deployedContracts.swapIntentFiller);

        //SpokeChainExecutor Deployment
        SpokeChainExecutor spokeChainExecutor = new SpokeChainExecutor(EventProver(deployedContracts.spokeProver));
        deployedContracts.spokeChainExecutor = address(spokeChainExecutor);
        console.log("Deployed Spoke Chain Executor at %s", deployedContracts.spokeChainExecutor);

        GMPIntentEventProver prover = GMPIntentEventProver(deployedContracts.spokeProver);
        prover.addEventRegisterer(address(swapIntentFiller));
        prover.addEventRegisterer(address(spokeChainExecutor));

        LibConfig.writeDeployedContracts(deployedContracts, spokeChain, vm);
        vm.stopBroadcast();
    }
}