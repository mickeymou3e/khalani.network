pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import "../lib/LibConfig.sol";
import "../../src/InterchainMessaging/adapters/HyperlaneAdapter.sol";
import "../../src/InterchainMessaging/gasPayment/KhalaniGasPaymaster.sol";
import "../../src/InterchainMessaging/facets/Setter/KhalaniSetter.sol";
import "../../src/InterchainMessaging/facets/RequestProcessor/RemoteRequestProcessor.sol";
import "../../src/diamondCommons/sharedFacets/DiamondCutFacet.sol";
import "../../src/diamondCommons/interfaces/IDiamond.sol";

contract UpgradeKhalani is Script {
    LibConfig.KhalaniContracts private khalaniContracts;
    LibConfig.DeployConfig private config;
    function run() public {
        string memory khalani = vm.envString("KHALANI");
        config = LibConfig.parseDeployConfigForChain(khalani,vm);
        khalaniContracts = LibConfig.readKhalaniAddress(khalani,vm);
        vm.createSelectFork(config.rpcUrl);
        vm.startBroadcast();
        replaceKhalaniFacets();
        deployKhalaniHyperlaneAdapter();
        registerNewAdapter();
        LibConfig.writeKhalaniAddress(khalaniContracts,khalani,vm);
        vm.stopBroadcast();
    }

    function replaceKhalaniFacets() internal {
        address interChainGateway = khalaniContracts.diamondProxy;
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](2);
        BridgeFacet bridgeFacet = new BridgeFacet();
        //write to struct
        khalaniContracts.bridgeFacet = address(bridgeFacet);
        bytes4[] memory bridgeFacetfunctionSelectors = new bytes4[](2);
        bridgeFacetfunctionSelectors[0] = bridgeFacet.send.selector;
        bridgeFacetfunctionSelectors[1] = bridgeFacet.getLiquidityProjector.selector;
        cut[0] = IDiamond.FacetCut(
            {facetAddress: address(bridgeFacet),
                action: IDiamond.FacetCutAction.Replace,
                functionSelectors: bridgeFacetfunctionSelectors
            });

        RemoteRequestProcessor remoteRequestProcessor = new RemoteRequestProcessor();
        //write to struct
        khalaniContracts.requestProcessorFacet = address(remoteRequestProcessor);
        bytes4[] memory remoteRequestProcessorfunctionSelectors = new bytes4[](1);
        remoteRequestProcessorfunctionSelectors[0] = remoteRequestProcessor.processRequest.selector;
        cut[1] = IDiamond.FacetCut(
            {facetAddress: address(remoteRequestProcessor),
                action: IDiamond.FacetCutAction.Replace,
                functionSelectors: remoteRequestProcessorfunctionSelectors
            });
        DiamondCutFacet(interChainGateway).diamondCut(
            cut, //array of of cuts
            address(0), //initializer address
            "" //initializer data
        );
    }

    function deployKhalaniHyperlaneAdapter() private {
        //deploy hyperlane IGP
        address hyperlaneIGP = deployKhalaniIgp();
        console.log("hyperlaneIGP on Khalani deployed at %s", hyperlaneIGP);
        //deployAdapter
        HyperlaneAdapter hyperlaneAdapter = new HyperlaneAdapter(config.hyperlaneMailbox, config.hyperlaneISM, khalaniContracts.diamondProxy, hyperlaneIGP);
        console.log("hyperlaneAdapter on Khalani deployed at %s", address(hyperlaneAdapter));
        khalaniContracts.hyperlaneAdapter = address(hyperlaneAdapter);
        khalaniContracts.hyperlaneIgp = hyperlaneIGP;
    }

    function deployKhalaniIgp() private returns (address) {
        //deploy hyperlane IGP
        KhalaniGasPaymaster khalaniGasPaymaster = new KhalaniGasPaymaster();
        return address(khalaniGasPaymaster);
    }

    function registerNewAdapter() public {
        KhalaniSetter(khalaniContracts.diamondProxy).initializeRemoteRequestProcessor(khalaniContracts.hyperlaneAdapter, khalaniContracts.liquidityProjector, khalaniContracts.interchainLiquidityHubWrapper, khalaniContracts.liquidityAggregator);
    }
}