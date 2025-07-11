pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "./lib/LibDiamondDeployer.sol";
import "../src/InterchainMessaging/adapters/HyperlaneAdapter.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "../src/InterchainMessaging/facets/Setter/RemoteSetter.sol";
import "../src/LiquidityReserves/remote/AssetReserves.sol";
import "./lib/LibConfig.sol";

contract DeployRemote is Script {


    LibConfig.RemoteContracts public remoteContracts;
    function run() public {
        string memory remote = vm.envString("REMOTE");
        string memory khalani = vm.envString("KHALANI");
        uint khalaniChainId = vm.envUint("KHALANI_CHAIN_ID");
        LibConfig.DeployConfig memory config = LibConfig.parseDeployConfigForChain(remote,vm);
        LibConfig.KhalaniContracts memory khalaniContracts = LibConfig.readKhalaniAddress(khalani,vm);
        vm.createSelectFork(config.rpcUrl);
        vm.startBroadcast();
        remoteContracts.chainId = config.chainId;
        //deploy diamond proxy - deployDiamond() aka interchaingateway
        remoteContracts.diamondProxy = LibDiamondDeployer.deployDiamond(msg.sender);

        //make facet cuts - addRemoteFacets() -> RemoteBridge, DefaultRequestProcessor, RemoteSetter
        (remoteContracts.bridgeFacet, remoteContracts.requestProcessorFacet, remoteContracts.setterFacet) = LibDiamondDeployer.addRemoteChainFacets(remoteContracts.diamondProxy);

        //deploy hyperlane adapter - constructor (mailbox , ism, diamondProxy) <- mailbox and ism from config
        address hyperlaneIGP; //TODO, adjust after finalizing M2 Deployment
        HyperlaneAdapter hyperlaneAdapter = new HyperlaneAdapter(config.hyperlaneMailbox, config.hyperlaneISM, remoteContracts.diamondProxy, hyperlaneIGP);
        remoteContracts.hyperlaneAdapter = address(hyperlaneAdapter);

        //deploy kai token
        ERC20MintableBurnable kai = new ERC20MintableBurnable("KAI", "KAI");
        remoteContracts.kai = address(kai);

        //deploy asset reserves - constructor(diamondProxy, kai);
        AssetReserves assetReserves = new AssetReserves(remoteContracts.diamondProxy, address(kai));
        remoteContracts.assetReserves = address(assetReserves);

        //initialise diamond using setter - initializeRemoteRequestProcessor(hyperlaneAdapter, liquidityProjector, interchainLiquidityHub, liquidityAggregator)
        RemoteSetter(remoteContracts.diamondProxy).initialize(remoteContracts.assetReserves,khalaniContracts.hyperlaneAdapter, khalaniChainId, address(hyperlaneAdapter));


        //add whitelisted assets to asset reserves
        for(uint i = 0; i < config.tokens.length; i++) {
            assetReserves.addWhiteListedAsset(config.tokens[i]);
        }
        //kai minter burner role to asset reserves
        kai.addMinterRole(address(assetReserves));
        vm.stopBroadcast();
        //write to json
        LibConfig.writeRemoteAddress(remoteContracts, remote, vm);
    }
}