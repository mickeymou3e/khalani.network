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
        address permit2;
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
    //ref :https://book.getfoundry.sh/cheatcodes/parse-json
    struct DeployedContracts{
        address assetReserves;
        address hubProver;
        address hubVerifier;
        address spokeChainExecutor;
        address spokeEscrow;
        address spokeProver;
        address spokeVerifier;
        address swapIntentFiller;
    }

    struct KhalaniContracts {
        address liquidityAggregator;
        address liquidityProjector;
        address proverRegistry;
        address rewarder;
        address verifierRegistry;
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

    struct IntentBooks {
        address limitOrderIntentBook;
        address spokeChainCallIntentBook;
        address swapIntentBook;
    }

    function parseDeployConfigForChain(string memory chainName, Vm vm) internal returns (DeployConfig memory deployConfig) {
        string memory json = vm.readFile("./script/config/deploy_config.json");
        chainName = string.concat('.',chainName);
        deployConfig.chainId = vm.parseJsonUint(json, string.concat(chainName, ".chainId"));

        deployConfig.rpcUrl = vm.parseJsonString(json,string.concat(chainName, ".rpcUrl"));

        deployConfig.hyperlaneMailbox = vm.parseJsonAddress(json,string.concat(chainName,".hyperlaneMailbox"));

        deployConfig.hyperlaneISM = vm.parseJsonAddress(json,string.concat(chainName,".hyperlaneISM"));

        deployConfig.hyperlaneGasOracle = vm.parseJsonAddress(json,string.concat(chainName,".hyperlaneGasOracle"));

        deployConfig.permit2 = vm.parseJsonAddress(json,string.concat(chainName,".permit2"));
        // Workaround for Forge parser error on empty array of addresses []
        //bytes memory tokensAddressesBytes = vm.parseJson(json, string.concat(chainName, ".tokens"));
        //uint256 numOfTokens = (tokensAddressesBytes.length - 64) / 32;
        //if (numOfTokens > 0) {
        deployConfig.tokens = vm.parseJsonAddressArray(json, string.concat(chainName, ".tokens"));
        //}
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

    function writeStrategyAddress(address[] memory tokens, address[] memory strategies, string memory chainName, uint chainId , Vm vm) internal {
        string memory path = "./script/config/strategy_list.json";
        string memory repKey = "key";
        vm.serializeAddress(repKey, "tokens", tokens);
        vm.serializeAddress(repKey, "strategies", strategies);
        string memory obj = vm.serializeUint(repKey, "chainId", chainId);
        vm.writeJson(obj, path, string.concat(".", chainName));
    }

    function writeDeployedContracts(DeployedContracts memory contracts, string memory chainName, Vm vm) internal {
        string memory path = "./script/config/deployed_contracts.json";
        string memory key = "contracts";
        vm.serializeAddress(key,"assetReserves",contracts.assetReserves);
        vm.serializeAddress(key,"hubProver",contracts.hubProver);
        vm.serializeAddress(key,"hubVerifier",contracts.hubVerifier);
        vm.serializeAddress(key,"spokeChainExecutor",contracts.spokeChainExecutor);
        vm.serializeAddress(key,"spokeEscrow",contracts.spokeEscrow);
        vm.serializeAddress(key,"spokeProver",contracts.spokeProver);
        vm.serializeAddress(key,"spokeVerifier",contracts.spokeVerifier);
        vm.serializeAddress(key,"swapIntentFiller",contracts.swapIntentFiller);
        string memory addresses = vm.serializeAddress(key,"spokeChainExecutor",contracts.spokeChainExecutor);
        vm.writeJson(addresses, path, string.concat(".", chainName));
    }

    function readDeployedContracts(string memory chainName, Vm vm) internal returns (DeployedContracts memory contracts){
        string memory path = "./script/config/deployed_contracts.json";
        string memory json = vm.readFile(path);
        bytes memory contractsRaw = json.parseRaw(string.concat(".", chainName));
        (contracts) = abi.decode(contractsRaw, (DeployedContracts));
    }

    function writeKhalaniContracts(KhalaniContracts memory contracts, string memory chainName, Vm vm) internal {
        string memory path = "./script/config/khalani_contracts.json";
        string memory key = "contracts";

        vm.serializeAddress(key,"liquidityProjector",contracts.liquidityProjector);
        vm.serializeAddress(key,"liquidityAggregator",contracts.liquidityAggregator);
        vm.serializeAddress(key,"verifierRegistry",contracts.verifierRegistry);
        vm.serializeAddress(key, "rewarder", contracts.rewarder);

        string memory addresses = vm.serializeAddress(key,"proverRegistry",contracts.proverRegistry);
        vm.writeJson(addresses, path, string.concat(".", chainName));
    }

    function readKhalaniContracts(string memory chainName, Vm vm) internal returns (KhalaniContracts memory contracts){
        string memory path = "./script/config/khalani_contracts.json";
        string memory json = vm.readFile(path);
        bytes memory contractsRaw = json.parseRaw(string.concat(".", chainName));
        (contracts) = abi.decode(contractsRaw, (KhalaniContracts));
    }

    function writeIntentBooks(IntentBooks memory intentBooks, string memory chainName, Vm vm) internal {
        string memory path = "./script/config/intent_books.json";
        string memory key = "books";
        vm.serializeAddress(key,"limitOrderIntentBook",intentBooks.limitOrderIntentBook);
        vm.serializeAddress(key,"spokeChainCallIntentBook",intentBooks.spokeChainCallIntentBook);
        vm.serializeAddress(key,"swapIntentBook",intentBooks.swapIntentBook);
        string memory addresses = vm.serializeAddress(key,"swapIntentBook",intentBooks.swapIntentBook);
        vm.writeJson(addresses, path, string.concat(".", chainName));
    }

    function readIntentBooks(string memory chainName, Vm vm) internal returns (IntentBooks memory intentBooks){
        string memory path = "./script/config/intent_books.json";
        string memory json = vm.readFile(path);
        bytes memory intentBooksRaw = json.parseRaw(string.concat(".", chainName));
        (intentBooks) = abi.decode(intentBooksRaw, (IntentBooks));
    }
}