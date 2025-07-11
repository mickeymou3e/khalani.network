pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../lib/LibConfig.sol";
import "../../src/diamondCommons/sharedFacets/DiamondCutFacet.sol";
import "../../src/InterchainMessaging/facets/Bridge/RemoteBridge.sol";
import "../../src/InterchainMessaging/facets/RequestProcessor/DefaultRequestProcessor.sol";
import "../../src/diamondCommons/interfaces/IDiamond.sol";
import "../../src/InterchainMessaging/gasPayment/InterchainGasPaymaster.sol";
import "@hyperlane-xyz/core/contracts/igps/gas-oracles/StorageGasOracle.sol";
import "../../src/InterchainMessaging/gasPayment/GasPaymaster.sol";
import "../../src/InterchainMessaging/adapters/HyperlaneAdapter.sol";
import "@hyperlane-xyz/core/contracts/igps/gas-oracles/StorageGasOracle.sol";
import "../../src/InterchainMessaging/facets/Setter/RemoteSetter.sol";
import "../../src/InterchainMessaging/facets/Setter/KhalaniSetter.sol";

contract UpgradeRemote is Script{
    LibConfig.RemoteContracts public remoteContracts;
    LibConfig.KhalaniContracts public khalaniContracts;
    LibConfig.DeployConfig public config;
    LibConfig.DeployConfig public khalaniConfig;
    string  remote = vm.envString("REMOTE");
    function run() public {
        string memory khalani = vm.envString("KHALANI");
        config = LibConfig.parseDeployConfigForChain(remote,vm);
        khalaniContracts = LibConfig.readKhalaniAddress(khalani,vm);
        remoteContracts = LibConfig.readRemoteAddress(remote,vm);
        vm.createSelectFork(config.rpcUrl);
        vm.startBroadcast();
        replaceRemoteChainFacets(remoteContracts.diamondProxy);
        deployHyperlaneAdapterOnRemote();
        registerNewAdapter();
        setOverheadGas();
        LibConfig.writeRemoteAddress(remoteContracts,remote,vm);
        vm.stopBroadcast();


        khalaniConfig = LibConfig.parseDeployConfigForChain(khalani,vm);
        vm.createSelectFork(khalaniConfig.rpcUrl);
        vm.startBroadcast();
        registerRemoteAdapterInKhalani();
        vm.stopBroadcast();
    }

    function replaceRemoteChainFacets(address interChainGateway) private {
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](2);
        RemoteBridgeFacet remoteBridgeFacet = new RemoteBridgeFacet();
        //write to struct
        remoteContracts.bridgeFacet = address(remoteBridgeFacet);
        bytes4[] memory remoteBridgeFacetfunctionSelectors = new bytes4[](2);
        remoteBridgeFacetfunctionSelectors[0] = remoteBridgeFacet.send.selector;
        remoteBridgeFacetfunctionSelectors[1] = remoteBridgeFacet.getAssetReserves.selector;
        cut[0] = IDiamond.FacetCut(
            {facetAddress: address(remoteBridgeFacet),
                action: IDiamond.FacetCutAction.Replace,
                functionSelectors: remoteBridgeFacetfunctionSelectors
            });
        DefaultRequestProcessor defaultRequestProcessor = new DefaultRequestProcessor();
        //write to struct
        remoteContracts.requestProcessorFacet = address(defaultRequestProcessor);
        bytes4[] memory defaultRequestProcessorfunctionSelectors = new bytes4[](1);
        defaultRequestProcessorfunctionSelectors[0] = defaultRequestProcessor.processRequest.selector;
        cut[1] = IDiamond.FacetCut(
            {facetAddress: address(defaultRequestProcessor),
                action: IDiamond.FacetCutAction.Replace,
                functionSelectors: defaultRequestProcessorfunctionSelectors
            });

        DiamondCutFacet(interChainGateway).diamondCut(
            cut, //array of of cuts
            address(0), //initializer address
            "" //initializer data
        );
    }

    function deployHyperlaneAdapterOnRemote() private returns (address) {
        //deployInnerIgp
        address innerIgp = deployInnerIgp();
        GasPaymaster gasPaymaster = new GasPaymaster(innerIgp);
        remoteContracts.hyperlaneIGP = address(gasPaymaster);
        console.log("gasPaymaster on Remote deployed at %s", address(gasPaymaster));
        HyperlaneAdapter hyperlaneAdapter = new HyperlaneAdapter(config.hyperlaneMailbox, config.hyperlaneISM, remoteContracts.diamondProxy, address(gasPaymaster));
        remoteContracts.hyperlaneAdapter = address(hyperlaneAdapter);
        console.log("hyperlaneAdapter on Remote deployed at %s", address(hyperlaneAdapter));
        return address(hyperlaneAdapter);
    }

    function deployInnerIgp() private returns (address) {
        address gasOracleKhalaniAndGodwoken = deployStorageGasOracleForKhalaniAndGodwoken();
        InterchainGasPaymaster.GasOracleConfig[] memory gasOracleConfigs = new InterchainGasPaymaster.GasOracleConfig[](8);
        uint24[8] memory remotes = [43113,80001,97,421613,420,11155111,71401,10012];//this is a workaround for now last 2 are godwoken and khalani
        for(uint256 i = 0; i < remotes.length; i++){

            if(i<6 && config.chainId!=71401){
                gasOracleConfigs[i] = InterchainGasPaymaster.GasOracleConfig({remoteDomain: uint32(remotes[i]), gasOracle: config.hyperlaneGasOracle});
                continue;
            }
            gasOracleConfigs[i] = InterchainGasPaymaster.GasOracleConfig({remoteDomain: uint32(remotes[i]), gasOracle: gasOracleKhalaniAndGodwoken});
        }
        InterchainGasPaymaster interchainGasPaymaster = new InterchainGasPaymaster();
        interchainGasPaymaster.initialize(msg.sender,msg.sender);
        interchainGasPaymaster.setGasOracles(gasOracleConfigs);
        console.log("interchainGasPaymaster on Remote deployed at %s", address(interchainGasPaymaster));
        return address(interchainGasPaymaster);
    }

    function deployStorageGasOracleForKhalaniAndGodwoken() private returns (address){
        StorageGasOracle storageGasOracle = new StorageGasOracle();

        StorageGasOracle.RemoteGasDataConfig[] memory remoteDataConfigs = new StorageGasOracle.RemoteGasDataConfig[](2);
        //khalani
        remoteDataConfigs[0] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 71401, tokenExchangeRate: 4919865800000, gasPrice: 51});
        //godwoken
        remoteDataConfigs[1] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 10012, tokenExchangeRate: 13200000000, gasPrice: 8});
        console.log("storage gas oracle on Remote deployed at %s", address(storageGasOracle));

        if(config.chainId == 71401){
            console.log("special case for godwoken");
            remoteDataConfigs = new StorageGasOracle.RemoteGasDataConfig[](7);
            remoteDataConfigs[0] = StorageGasOracle.RemoteGasDataConfig({remoteDomain:421613 , tokenExchangeRate:30145508 , gasPrice: 4});
            remoteDataConfigs[1] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 43113, tokenExchangeRate: 2749747, gasPrice: 28});
            remoteDataConfigs[2] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 80001, tokenExchangeRate: 48490263, gasPrice: 3});
            remoteDataConfigs[3] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 11155111, tokenExchangeRate: 16616, gasPrice: 13});
            remoteDataConfigs[4] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 97, tokenExchangeRate: 126192, gasPrice: 3});
            remoteDataConfigs[5] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 420, tokenExchangeRate:20406015 , gasPrice: 3});
            remoteDataConfigs[6] = StorageGasOracle.RemoteGasDataConfig({remoteDomain: 10012, tokenExchangeRate:126192, gasPrice: 8});
        }
        storageGasOracle.setRemoteGasDataConfigs(remoteDataConfigs);
        return address(storageGasOracle);
    }

    function registerNewAdapter() private {
        RemoteSetter(remoteContracts.diamondProxy).initialize(
            remoteContracts.assetReserves,
            khalaniContracts.hyperlaneAdapter,
            10012,
            remoteContracts.hyperlaneAdapter
        );
    }

    function setOverheadGas() private {
        LibConfig.OverheadGasData[] memory overheadGasData = LibConfig.readOverheadGasData(remote,vm);
        for(uint256 i = 0; i < overheadGasData.length; i++){
            GasPaymaster(remoteContracts.hyperlaneIGP).setDestinationGasOverhead(uint32(overheadGasData[i].destinationChain), overheadGasData[i].destinationGas);
            console.log("overhead gas : %s , set for chain :  %s", overheadGasData[i].destinationGas, overheadGasData[i].destinationChain);
        }
    }

    function registerRemoteAdapterInKhalani() private {
        KhalaniSetter(khalaniContracts.diamondProxy).registerRemoteAdapter(config.chainId, remoteContracts.hyperlaneAdapter);
    }

}