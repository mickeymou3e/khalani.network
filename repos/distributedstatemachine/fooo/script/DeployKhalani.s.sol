pragma solidity ^0.8.0;

import "../src/InterchainMessaging/adapters/HyperlaneAdapter.sol";
import "./lib/LibDiamondDeployer.sol";
import "../src/LiquidityReserves/khalani/LiquidityProjector.sol";
import "../src/InterchainLiquidityHub/InterchainLiquidityHubWrapper.sol";
import "../src/LiquidityReserves/khalani/kln/LiquidityAggregator.sol";
import "../src/LiquidityReserves/khalani/kai/KaiLiquidityAggregator.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";
import "forge-std/Script.sol";
import "./lib/LibConfig.sol";

contract DeployKhalani is Script {


    LibConfig.MirrorTokenInfo[] mirrorTokens;
    address[] klnTokens;
    address[][] klnTokensGroup;
    LibConfig.KhalaniContracts khalaniContracts;
    function run() public {
        //read from env
        string[] memory remotes = vm.envString("REMOTES",",");
        string memory khalani = vm.envString("KHALANI");
        klnTokens = vm.envAddress("KLN_TOKENS",",");

        //read from json
        for(uint i; i<remotes.length; i++){
            //read from json
            mirrorTokens.push(LibConfig.readMirrorTokenForChain(remotes[i],vm));
        }

        for(uint i; i<klnTokens.length; i++){
            //read from json
            klnTokensGroup.push(LibConfig.readWhiteListedMirrorTokenForKlnToken(klnTokens[i],vm));
        }

        LibConfig.DeployConfig memory deployConfig = LibConfig.parseDeployConfigForChain(khalani, vm);


        address balancerVault = vm.envAddress("BALANCER_VAULT");

        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();
        address kaiOnKhalani = address(new ERC20MintableBurnable("KAI","KAI"));


        //deploy diamond proxy - deployDiamond() aka interchaingateway
        address diamondProxy = LibDiamondDeployer.deployDiamond(msg.sender);

        //make facet cuts - addKhalaniFacets() -> BridgeFacet, RemoteRequestProcessor, KhalaniSetter
        (khalaniContracts.bridgeFacet, khalaniContracts.requestProcessorFacet, khalaniContracts.setterFacet) = LibDiamondDeployer.addKhalaniFacets(diamondProxy);

        address hyperlaneIGP; //TODO, adjust after finalizing M2 Deployment
        //deploy hyperlane adapter - constructor (mailbox , ism, diamondProxy) <- mailbox and ism from config
        HyperlaneAdapter hyperlaneAdapter = new HyperlaneAdapter(deployConfig.hyperlaneMailbox, deployConfig.hyperlaneISM, diamondProxy, hyperlaneIGP);

        //deploy liquidity projector - constructor(diamondProxy, kaiOnKhalani);
        LiquidityProjector liquidityProjector = new LiquidityProjector(diamondProxy, kaiOnKhalani);

        //deploy interchain liquidity hub wrapper - constructor(vault, diamondProxy);
        InterchainLiquidityHubWrapper interchainLiquidityHubWrapper = new InterchainLiquidityHubWrapper(balancerVault, diamondProxy);

        //deploy liquidity aggregator - constructor();
        LiquidityAggregator liquidityAggregator = new LiquidityAggregator();

        //deploy kai liquidity aggregator
        KaiLiquidityAggregator kaiLiquidityAggregator = new KaiLiquidityAggregator(kaiOnKhalani);

        //initialise diamond using khalani setter - initialize(assetReserves, khalaniReceiver, khalaniChainId, hyperlaneAdapter)
        KhalaniSetter(diamondProxy).initializeRemoteRequestProcessor(address(hyperlaneAdapter), address(liquidityProjector), address(interchainLiquidityHubWrapper), address(liquidityAggregator));

        //register mirror token for each chain to liquidity projector
        //mirror token minter burner role to liquidityProjector
        for(uint i; i<mirrorTokens.length; i++){
            for(uint j; j<mirrorTokens[i].tokens.length; j++){
                liquidityProjector.setMirrorToken(mirrorTokens[i].chainId,mirrorTokens[i].tokens[j],mirrorTokens[i].mirrorTokens[j]);
                ERC20MintableBurnable(mirrorTokens[i].mirrorTokens[j]).addMinterRole(address(liquidityProjector));
            }
        }

        //register kln token, mirror token for each chain to liquidity aggregator
        //kln token minter burner role to liquidity aggregator
        for(uint i; i<klnTokens.length; i++){
            for(uint j; j<klnTokensGroup[i].length; j++){
                liquidityAggregator.registerTokenForKlnToken(klnTokensGroup[i][j],klnTokens[i]);
            }
            ERC20MintableBurnable(klnTokens[i]).addMinterRole(address(liquidityAggregator));
        }

        //whitelist kln tokens in kai liquidity aggregator
        for(uint i; i<klnTokens.length; i++){
            kaiLiquidityAggregator.addWhiteListedAsset(klnTokens[i]);
        }
        //kai on khalani minter burner role to kai liquidity aggregator
        ERC20MintableBurnable(kaiOnKhalani).addMinterRole(address(kaiLiquidityAggregator));
        vm.stopBroadcast();
        //write deployed addresses to json
        khalaniContracts.diamondProxy = diamondProxy;
        khalaniContracts.hyperlaneAdapter = address(hyperlaneAdapter);
        khalaniContracts.liquidityProjector = address(liquidityProjector);
        khalaniContracts.interchainLiquidityHubWrapper = address(interchainLiquidityHubWrapper);
        khalaniContracts.liquidityAggregator = address(liquidityAggregator);
        khalaniContracts.kaiLiquidityAggregator = address(kaiLiquidityAggregator);
        khalaniContracts.kai = kaiOnKhalani;
        khalaniContracts.chainId = deployConfig.chainId;

        LibConfig.writeKhalaniAddress(khalaniContracts,khalani,vm);
    }
}