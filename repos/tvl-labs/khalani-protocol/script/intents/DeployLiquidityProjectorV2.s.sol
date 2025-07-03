pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import {LiquidityProjectorV2} from "../../src/LiquidityReserves/khalani/LiquidityProjectorV2.sol";
import {VerifierRegistry} from "../../src/Intents/registry/VerifierRegistry.sol";
import {ProverRegistry} from "../../src/Intents/registry/ProverRegistry.sol";
import "../lib/LibConfig.sol";
import "../../src/Intents/SwapIntentRewarder.sol";

contract DeployLiquidityProjectorV2 is Script {

    LibConfig.DeployConfig deployConfig;
    LibConfig.KhalaniContracts khalaniContracts;
    LiquidityProjectorV2 liquidityProjectorV2;

    function run() public {

        string memory khalaniChain = vm.envString("KHALANI_CHAIN");
        deployConfig = LibConfig.parseDeployConfigForChain(khalaniChain, vm);

        //get from json (imp)
        khalaniContracts = LibConfig.readKhalaniContracts(khalaniChain, vm);

        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();
        khalaniContracts.liquidityProjector = deployLiquidityProjectorV2();
        SwapIntentRewarder(khalaniContracts.rewarder).setRewardSource(khalaniContracts.liquidityProjector);
        vm.stopBroadcast();

        LibConfig.writeKhalaniContracts(khalaniContracts, khalaniChain, vm);

    }

    function deployLiquidityProjectorV2() private returns (address) {
        liquidityProjectorV2 = new LiquidityProjectorV2(VerifierRegistry(khalaniContracts.verifierRegistry), ProverRegistry(khalaniContracts.proverRegistry));
        liquidityProjectorV2.setLocalRewarder(khalaniContracts.rewarder);
        console.log("Liquidity projector V2 address: ", address(liquidityProjectorV2));
        return address(liquidityProjectorV2);
    }

    function registerMirrorTokens() public {
        string memory spokeChain = vm.envString("SPOKE_CHAIN");
        string memory khalaniChain = vm.envString("KHALANI_CHAIN");
        deployConfig = LibConfig.parseDeployConfigForChain(khalaniChain, vm);
        khalaniContracts = LibConfig.readKhalaniContracts(khalaniChain, vm);
        liquidityProjectorV2 = LiquidityProjectorV2(khalaniContracts.liquidityProjector);
        LibConfig.MirrorTokenInfo memory mirrorContracts = LibConfig.readMirrorTokenForChain(spokeChain, vm);
        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();
        for(uint i = 0; i < mirrorContracts.mirrorTokens.length; i++) {
            liquidityProjectorV2.registerToken(mirrorContracts.chainId, mirrorContracts.tokens[i], mirrorContracts.mirrorTokens[i]);
        }
        vm.stopBroadcast();
    }
}