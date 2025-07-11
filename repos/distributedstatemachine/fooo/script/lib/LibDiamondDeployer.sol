pragma solidity ^0.8.0;

import "../../src/diamondCommons/sharedFacets/DiamondCutFacet.sol";
import "../../src/InterchainMessaging/NexusGateway.sol";
import "../../src/InterchainMessaging/facets/Bridge/BridgeFacet.sol";
import "../../src/InterchainMessaging/facets/RequestProcessor/RemoteRequestProcessor.sol";
import "../../src/InterchainMessaging/facets/Bridge/RemoteBridge.sol";
import "../../src/InterchainMessaging/facets/RequestProcessor/DefaultRequestProcessor.sol";
import "../../src/InterchainMessaging/facets/Setter/RemoteSetter.sol";
import "../../src/InterchainMessaging/facets/Setter/KhalaniSetter.sol";

library LibDiamondDeployer {

    //Include BridgeFacet and RemoteRequestProcessor Facets
    function addKhalaniFacets(address interChainGateway) internal returns (address, address, address) {
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](3);
        BridgeFacet bridgeFacet = new BridgeFacet();
        bytes4[] memory bridgeFacetfunctionSelectors = new bytes4[](2);
        bridgeFacetfunctionSelectors[0] = bridgeFacet.send.selector;
        bridgeFacetfunctionSelectors[1] = bridgeFacet.getLiquidityProjector.selector;
        cut[0] = IDiamond.FacetCut(
            {facetAddress: address(bridgeFacet),
                action: IDiamond.FacetCutAction.Add,
                functionSelectors: bridgeFacetfunctionSelectors
            });

        RemoteRequestProcessor metaRequestProcessor = new RemoteRequestProcessor();
        bytes4[] memory metaRequestProcessorfunctionSelectors = new bytes4[](1);
        metaRequestProcessorfunctionSelectors[0] = metaRequestProcessor.processRequest.selector;
        cut[1] = IDiamond.FacetCut(
            {facetAddress: address(metaRequestProcessor),
                action: IDiamond.FacetCutAction.Add,
                functionSelectors: metaRequestProcessorfunctionSelectors
            });
        KhalaniSetter setterFacet = new KhalaniSetter();
        bytes4[] memory setterFacetfunctionSelectors = new bytes4[](2);
        setterFacetfunctionSelectors[0] = setterFacet.initializeRemoteRequestProcessor.selector;
        setterFacetfunctionSelectors[1] = setterFacet.registerRemoteAdapter.selector;
        cut[2] = IDiamond.FacetCut(
            {facetAddress: address(setterFacet),
                action: IDiamond.FacetCutAction.Add,
                functionSelectors: setterFacetfunctionSelectors
            });
        DiamondCutFacet(interChainGateway).diamondCut(
            cut, //array of of cuts
            address(0), //initializer address
            "" //initializer data
        );
        return (address(bridgeFacet), address(metaRequestProcessor), address(setterFacet));
    }

    //Include RemoteBridgeFacet and DefaultRequestProcessor Facets
    function addRemoteChainFacets(address interChainGateway) internal returns (address, address, address) {
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](3);
        RemoteBridgeFacet remoteBridgeFacet = new RemoteBridgeFacet();
        bytes4[] memory remoteBridgeFacetfunctionSelectors = new bytes4[](2);
        remoteBridgeFacetfunctionSelectors[0] = remoteBridgeFacet.send.selector;
        remoteBridgeFacetfunctionSelectors[1] = remoteBridgeFacet.getAssetReserves.selector;
        cut[0] = IDiamond.FacetCut(
            {facetAddress: address(remoteBridgeFacet),
                action: IDiamond.FacetCutAction.Add,
                functionSelectors: remoteBridgeFacetfunctionSelectors
            });
        DefaultRequestProcessor defaultRequestProcessor = new DefaultRequestProcessor();
        bytes4[] memory defaultRequestProcessorfunctionSelectors = new bytes4[](1);
        defaultRequestProcessorfunctionSelectors[0] = defaultRequestProcessor.processRequest.selector;
        cut[1] = IDiamond.FacetCut(
            {facetAddress: address(defaultRequestProcessor),
                action: IDiamond.FacetCutAction.Add,
                functionSelectors: defaultRequestProcessorfunctionSelectors
            });
        RemoteSetter setterFacet = new RemoteSetter();
        bytes4[] memory setterFacetfunctionSelectors = new bytes4[](1);
        setterFacetfunctionSelectors[0] = setterFacet.initialize.selector;
        cut[2] = IDiamond.FacetCut(
            {facetAddress: address(setterFacet),
                action: IDiamond.FacetCutAction.Add,
                functionSelectors: setterFacetfunctionSelectors
            });
        DiamondCutFacet(interChainGateway).diamondCut(
            cut, //array of of cuts
            address(0), //initializer address
            "" //initializer data
        );
        return (address(remoteBridgeFacet), address(defaultRequestProcessor), address(setterFacet));
    }

    function deployDiamond(address owner) internal returns (address) {
        IDiamondCut.FacetCut[] memory cut = new IDiamondCut.FacetCut[](1);
        DiamondCutFacet diamondCutFacet = new DiamondCutFacet();
        bytes4[] memory diamondCutFacetfunctionSelectors = new bytes4[](1);
        diamondCutFacetfunctionSelectors[0] = diamondCutFacet.diamondCut.selector;
        cut[0] = IDiamond.FacetCut(
            {facetAddress: address(diamondCutFacet),
                action: IDiamond.FacetCutAction.Add,
                functionSelectors: diamondCutFacetfunctionSelectors
            });
        DiamondArgs memory args;
        args.owner  = owner;
        args.init = address(0);
        args.initCalldata = "";
        Nexus diamond = new Nexus(cut, args);
        return address(diamond);
    }

}