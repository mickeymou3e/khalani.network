pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import {VerifierRegistry} from "../../src/Intents/registry/VerifierRegistry.sol";
import {ProverRegistry} from "../../src/Intents/registry/ProverRegistry.sol";
import {AssetReserves} from "../../src/LiquidityReserves/remote/AssetReserves.sol";
import {EventProver} from "../../src/Intents/proof/EventProver.sol";
import {GMPEventProver} from "../../src/Intents/proof/GMPEventProver.sol";
import {EventVerifier} from "../../src/Intents/proof/EventVerifier.sol";
import "../lib/LibConfig.sol";

//First step is to deploy prover and verifier contracts from Intents/proof/impl
contract DeployAssetReserves is Script {

    LibConfig.DeployConfig deployConfig;
    LibConfig.DeployedContracts deployedContracts;

    function run() public {
        string memory spokeChain = vm.envString("SPOKE_CHAIN");
        deployConfig = LibConfig.parseDeployConfigForChain(spokeChain, vm);
        deployedContracts = LibConfig.readDeployedContracts(spokeChain, vm);

        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();
        deployedContracts.assetReserves = deployAssetReserves();
        addAssets();
        vm.stopBroadcast();

        LibConfig.writeDeployedContracts(deployedContracts, spokeChain, vm);
    }

    function deployAssetReserves() private returns (address) {
        AssetReserves assetReserves = new AssetReserves(EventProver(deployedContracts.spokeProver), EventVerifier(deployedContracts.spokeVerifier));
        GMPEventProver(deployedContracts.spokeProver).addEventRegisterer(address(assetReserves));
        console.log("Asset reserves address: ", address(assetReserves));
        return address(assetReserves);
    }

    function addAssets() public {
        AssetReserves assetReserves = AssetReserves(deployedContracts.assetReserves);
        for (uint i ; i < deployConfig.tokens.length ; i++) {
            assetReserves.addAsset(deployConfig.tokens[i]);
        }
    }
}