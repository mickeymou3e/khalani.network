pragma solidity ^0.8.0;

import "forge-std/Vm.sol";
import "forge-std/StdJson.sol";
import "forge-std/Script.sol";

library  LibConfig {
    using stdJson for string;

    struct DeployConfig {
        uint256 chainId;
        string rpcUrl;
        address hyperlaneMailbox;
        address hyperlaneGasOracle;
        address hyperlaneISM;
        address[] tokens;
    }

    //needs to be alphabetical order for easy reading
    //ref :https://book.getfoundry.sh/cheatcodes/parse-json
    struct RemoteContracts {
        address assetReserves;
        address bridgeFacet;
        uint chainId;
        address diamondProxy;
        address hyperlaneAdapter;
        address hyperlaneIGP;
        address kai;
        address requestProcessorFacet;
        address setterFacet;
    }

    struct KlnToken {
        string symbol;
        address token;
    }

    //needs to be alphabetical order for easy reading
    struct KhalaniContracts {
        address bridgeFacet;
        uint chainId;
        address diamondProxy;
        address hyperlaneAdapter;
        address hyperlaneIgp;
        address interchainLiquidityHubWrapper;
        address kai;
        address kaiLiquidityAggregator;
        address liquidityAggregator;
        address liquidityProjector;
        address requestProcessorFacet;
        address setterFacet;
    }

    struct MirrorTokenInfo {
        uint256 chainId;
        uint256[] decimals;
        address[] mirrorTokens;
        string [] symbols;
        address[] tokens;

    }

    struct OverheadGasData{
        uint256 destinationChain;
        uint256 destinationGas;
    }

    function parseDeployConfigForChain(string memory chainName, Vm vm) internal returns (DeployConfig memory deployConfig) {
        string memory json = vm.readFile("./script/config/deploy_config.json");
        chainName = string.concat('.',chainName);
        deployConfig.chainId = vm.parseJsonUint(json, string.concat(chainName, ".chainId"));

        deployConfig.rpcUrl = vm.parseJsonString(json,string.concat(chainName, ".rpcUrl"));

        deployConfig.hyperlaneMailbox = vm.parseJsonAddress(json,string.concat(chainName,".hyperlaneMailbox"));

        deployConfig.hyperlaneISM = vm.parseJsonAddress(json,string.concat(chainName,".hyperlaneISM"));

        deployConfig.hyperlaneGasOracle = vm.parseJsonAddress(json,string.concat(chainName,".hyperlaneGasOracle"));

        // Workaround for Forge parser error on empty array of addresses []
        bytes memory tokensAddressesBytes = vm.parseJson(json, string.concat(chainName, ".tokens"));
        uint256 numOfTokens = (tokensAddressesBytes.length - 64) / 32;
        if (numOfTokens > 0) {
            deployConfig.tokens = vm.parseJsonAddressArray(json, string.concat(chainName, ".tokens"));
        }

        console.log("Read DeployConfig for %s", chainName);
        console.log("  chainId = %s", deployConfig.chainId);
        console.log("  hyperlaneMailbox = %s", deployConfig.hyperlaneMailbox);
        console.log("  hyperlaneISM = %s", deployConfig.hyperlaneISM);
        console.log("  rpcUrl = %s", deployConfig.rpcUrl);
        console.log("  tokens.length = %s", deployConfig.tokens.length);
        for (uint i = 0; i < deployConfig.tokens.length; i++) {
            console.log("    token %s", deployConfig.tokens[i]);
        }
    }

    function writeMirrorTokenOut(address[] memory tokens, address[] memory mirrorTokens, string[] memory symbols, uint[] memory decimals, string memory chainName, uint chainId , Vm vm) internal {
        string memory path = "./script/config/mirror_tokens.json";
        string memory repKey = "key";
        vm.serializeUint(repKey, "chainId", chainId);
        vm.serializeAddress(repKey, "tokens", tokens);
        vm.serializeAddress(repKey, "mirrorTokens", mirrorTokens);
        vm.serializeString(repKey, "symbols", symbols);
        string memory obj = vm.serializeUint(repKey, "decimals", decimals);
        vm.writeJson(obj, path, string.concat(".", chainName));
    }

    function readMirrorTokenForChain(string memory chainName, Vm vm) internal returns (MirrorTokenInfo memory mirrorTokenInfo) {
        string memory path = "./script/config/mirror_tokens.json";
        string memory json = vm.readFile(path);
        bytes memory mirrorTokensRaw = json.parseRaw(string.concat(".", chainName));
        //decode to MirrorTokenInfo
        mirrorTokenInfo = abi.decode(mirrorTokensRaw, (MirrorTokenInfo));
    }

    function readKlnSymbolList(Vm vm) internal returns (string[] memory symbols) {
        string memory path = "./script/config/kln_symbol_list.json";
        string memory json = vm.readFile(path);
        return vm.parseJsonStringArray(json, ".symbols");
    }

    function readWhiteListedMirrorTokenForKlnToken(address klnToken, Vm vm) internal returns (address[] memory mirrorTokens) {
        string memory path = "./script/config/kln_mirror_group.json";
        string memory json = vm.readFile(path);
        bytes memory mirrorTokensRaw = json.parseRaw(string.concat(".",vm.toString(klnToken)));
        (mirrorTokens) = abi.decode(mirrorTokensRaw, (address[]));
    }

    function writeKlnTokenOut(KlnToken[] memory klnTokens, Vm vm) internal{
        string memory path = "./script/config/kln_tokens_out.json";
        string memory key = "key";
        string memory out;
        for(uint i; i< klnTokens.length; i++){
            if(i==klnTokens.length-1){
                vm.writeJson( vm.serializeAddress(key,klnTokens[i].symbol,klnTokens[i].token), path, ".klnTokens");
                break;
            }
            vm.serializeAddress(key,klnTokens[i].symbol,klnTokens[i].token);
        }
    }

    function writeRemoteAddress(RemoteContracts memory contracts, string memory chainName, Vm vm) internal{
        string memory key = "key";
        vm.serializeAddress(key,"diamondProxy",contracts.diamondProxy);
        vm.serializeUint(key,"chainId",contracts.chainId);
        vm.serializeAddress(key,"bridgeFacet",contracts.bridgeFacet);
        vm.serializeAddress(key,"requestProcessorFacet",contracts.requestProcessorFacet);
        vm.serializeAddress(key,"setterFacet",contracts.setterFacet);
        vm.serializeAddress(key,"hyperlaneAdapter",contracts.hyperlaneAdapter);
        vm.serializeAddress(key,"hyperlaneIGP",contracts.hyperlaneIGP);
        vm.serializeAddress(key,"kai",contracts.kai);
        string memory addresses = vm.serializeAddress(key,"assetReserves",contracts.assetReserves);
        vm.writeJson(addresses, "./script/config/networks.json", string.concat(".", chainName));
    }

    function writeKhalaniAddress(KhalaniContracts memory contracts, string memory chainName, Vm vm) internal {
        string memory key = "contracts";
        vm.serializeAddress(key,"diamondProxy",contracts.diamondProxy);
        vm.serializeUint(key,"chainId",contracts.chainId);
        vm.serializeAddress(key,"bridgeFacet",contracts.bridgeFacet);
        vm.serializeAddress(key,"requestProcessorFacet",contracts.requestProcessorFacet);
        vm.serializeAddress(key,"setterFacet",contracts.setterFacet);
        vm.serializeAddress(key,"liquidityProjector",contracts.liquidityProjector);
        vm.serializeAddress(key,"liquidityAggregator",contracts.liquidityAggregator);
        vm.serializeAddress(key,"kai",contracts.kai);
        vm.serializeAddress(key,"kaiLiquidityAggregator",contracts.kaiLiquidityAggregator);
        vm.serializeAddress(key,"hyperlaneAdapter",contracts.hyperlaneAdapter);
        vm.serializeAddress(key,"hyperlaneIGP",contracts.hyperlaneIgp);
        string memory addresses = vm.serializeAddress(key,"interchainLiquidityHubWrapper",contracts.interchainLiquidityHubWrapper);
        vm.writeJson(addresses, "./script/config/networks.json", string.concat(".", chainName));
    }

    function readRemoteAddress(string memory chainName, Vm vm) internal returns (RemoteContracts memory contracts){
        string memory path = "./script/config/networks.json";
        string memory json = vm.readFile(path);
        bytes memory contractsRaw = json.parseRaw(string.concat(".", chainName));
        (contracts) = abi.decode(contractsRaw, (RemoteContracts));
    }

    function readKhalaniAddress(string memory chainName, Vm vm) internal returns (KhalaniContracts memory contracts){
        string memory path = "./script/config/networks.json";
        string memory json = vm.readFile(path);
        bytes memory contractsRaw = json.parseRaw(string.concat(".", chainName));
        (contracts) = abi.decode(contractsRaw, (KhalaniContracts));
    }

    function readOverheadGasData(string memory chainName, Vm vm) internal returns (OverheadGasData[] memory overheadGasData){
        string memory path = "./script/config/gas_data.json";
        string memory json = vm.readFile(path);
        bytes memory overheadGasDataRaw = json.parseRaw(string.concat(".", chainName));
        (overheadGasData) = abi.decode(overheadGasDataRaw, (OverheadGasData[]));
    }
}