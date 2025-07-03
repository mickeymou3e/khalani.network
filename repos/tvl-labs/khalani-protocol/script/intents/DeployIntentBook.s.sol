pragma solidity ^0.8.4;

import "forge-std/Script.sol";
import {LimitOrderIntentBook} from "../../src/Intents/intentbook/LimitOrderIntentBook.sol";
import {SwapIntentBook} from "../../src/Intents/intentbook/SwapIntentBook.sol";
import {SpokeChainCallIntentBook} from "../../src/Intents/intentbook/SpokeChainCallIntentBook.sol";
import {VerifierRegistry} from "../../src/Intents/registry/VerifierRegistry.sol";
import {IRewarder} from "../../src/Intents/interfaces/IRewarder.sol";
import "../lib/LibConfig.sol";
import {SwapIntentRewarder} from "../../src/Intents/SwapIntentRewarder.sol";

contract DeployIntentBook is Script {

    LibConfig.KhalaniContracts khalaniContracts;
    LibConfig.DeployConfig deployConfig;
    LibConfig.IntentBooks intentBooks;

    function run() public {
        string memory khalaniChain = vm.envString("KHALANI_CHAIN");
        khalaniContracts = LibConfig.readKhalaniContracts(khalaniChain, vm);
        deployConfig = LibConfig.parseDeployConfigForChain(khalaniChain, vm);
        //deploy LimitOrderIntentBook
        vm.createSelectFork(deployConfig.rpcUrl);
        vm.startBroadcast();
        LimitOrderIntentBook limitOrderIntentBook = new LimitOrderIntentBook();
        console.log("LimitOrderIntentBook: ", address(limitOrderIntentBook));

        //deploy SwapIntentBook
        SwapIntentBook swapIntentBook = new SwapIntentBook(VerifierRegistry(khalaniContracts.verifierRegistry), IRewarder(khalaniContracts.rewarder));
        SwapIntentRewarder(khalaniContracts.rewarder).addSettlementReactor(address(swapIntentBook));
        console.log("SwapIntentBook: ", address(swapIntentBook));

        //deploy SpokeChainCallIntentBook
        SpokeChainCallIntentBook spokeChainCallIntentBook = new SpokeChainCallIntentBook(VerifierRegistry(khalaniContracts.verifierRegistry));
        console.log("SpokeChainCallIntentBook: ", address(spokeChainCallIntentBook));

        //write addresses
        intentBooks = LibConfig.IntentBooks({
            limitOrderIntentBook: address(limitOrderIntentBook),
            swapIntentBook: address(swapIntentBook),
            spokeChainCallIntentBook: address(spokeChainCallIntentBook)
        });

        LibConfig.writeIntentBooks(intentBooks, khalaniChain, vm);
        vm.stopBroadcast();
    }
}