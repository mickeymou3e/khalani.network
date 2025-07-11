pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "./lib/LibConfig.sol";
import "../src/LiquidityReserves/khalani/LiquidityProjector.sol";
import "../src/InterchainMessaging/facets/Setter/KhalaniSetter.sol";

contract CrossChainRegister is Script {
    LibConfig.KhalaniContracts khalaniContracts;
    LibConfig.DeployConfig deployConfig;
    function run() public {
        string[] memory remotes = vm.envString("REMOTES",",");
        string memory khalani = vm.envString("KHALANI");
        deployConfig = LibConfig.parseDeployConfigForChain(khalani,vm);
        khalaniContracts = LibConfig.readKhalaniAddress(khalani,vm);
        LiquidityProjector lp = LiquidityProjector(khalaniContracts.liquidityProjector);
        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();
        for(uint i = 0; i < remotes.length; i++) {
            string memory remote = remotes[i];
            LibConfig.RemoteContracts memory remoteContracts = LibConfig.readRemoteAddress(remote,vm);
            //register kai in mirror token map
            lp.setMirrorToken(remoteContracts.chainId,remoteContracts.kai,khalaniContracts.kai);
            //register adapter in diamond proxy
            KhalaniSetter(khalaniContracts.diamondProxy).registerRemoteAdapter(remoteContracts.chainId,remoteContracts.hyperlaneAdapter);
        }
        vm.stopBroadcast();
    }
}