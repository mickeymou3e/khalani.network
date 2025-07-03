// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./ProdBaseHubScript.s.sol";
import {HubHandler} from "../../src/event_system/HubHandler.sol";
import {HubPublisher} from "../../src/event_system/HubPublisher.sol";
import {EventProver} from "../../src/event_system/EventProver.sol";
import {MockInterchainGasPaymaster} from "../../src/event_system/MockInterchainGasPaymaster.sol";

contract ProdHubConnectProverToVerifier is BaseHubScript {
    function run() public override {
        preProcess();
        vm.startBroadcast(contractsManager);
        spokeChainId = getSpokeChainId();
        console.log("spokeChainId:", spokeChainId);

        spokeEventVerifier = getSpokeEventVerifier();
        console.log("spokeEventVerifier:", spokeEventVerifier);

        mailbox = getMailbox();
        console.log("mailbox:", mailbox);

        // igp = getContractAddressFromBroadcast("MockInterchainGasPaymaster", "ProdHubDeployCoreProtocol.s.sol", chainId);
        igp = vm.envAddress("HUB_IGP");
        console.log("igp:", igp);

        gasAmountOracle = getContractAddressFromBroadcast("GasAmountOracle", "ProdHubDeployCoreProtocol.s.sol", chainId);
        console.log("gasAmountOracle:", gasAmountOracle);

        eventHandler = getContractAddressFromBroadcast("HubHandler", "ProdHubDeployCoreProtocol.s.sol", chainId);
        console.log("eventHandler:", eventHandler);

        eventPublisher =
            payable(getContractAddressFromBroadcast("HubPublisher", "ProdHubDeployCoreProtocol.s.sol", chainId));
        console.log("eventPublisher:", eventPublisher);

        eventProver = address(new EventProver(mailbox, spokeEventVerifier, uint32(spokeChainId), igp, gasAmountOracle));
        console.log("eventProver:", eventProver);

        connect();
        vm.stopBroadcast();
    }

    function connect() internal {
        console.log("Attempting to authorize origin chain");
        console.log("Spoke Chain ID:");
        console.log(vm.toString(spokeChainId));
        HubHandler(eventHandler).authorizeOriginChain(uint32(spokeChainId));
        console.log("Origin chain authorized");

        console.log("Attempting to register event prover");
        console.log("SpokeChain ID:");
        console.log(vm.toString(spokeChainId));
        console.log("Event Prover:");
        console.logAddress(eventProver);

        console.log("HubPublisher address:", eventPublisher);

        // Try to get the contract code size to verify it's a contract
        uint256 size;
        address addr = eventPublisher;
        assembly {
            size := extcodesize(addr)
        }
        console.log("HubPublisher contract size:", size);

        // Try to get the contract code
        bytes memory code = address(eventPublisher).code;
        console.log("HubPublisher code length:", code.length);

        // Try to get the contract code hash
        bytes32 codeHash;
        assembly {
            codeHash := extcodehash(addr)
        }
        console.log("HubPublisher code hash:");
        console.logBytes32(codeHash);

        // Try to get the contract owner
        console.log("HubPublisher owner:", HubPublisher(eventPublisher).owner());
        console.log("ContractsManager address:", contractsManager);
        console.log("Current caller:", msg.sender);

        (bool enabled, uint32 chainId) = HubPublisher(eventPublisher).s_eventProvers(eventProver);
        console.log("Event prover already registered:", enabled);
        console.log("Event prover chain ID:", chainId);
        HubPublisher(eventPublisher).registerEventProver(uint32(spokeChainId), eventProver);
        console.log("Event prover registered");

        console.log("Attempting to add event publisher");
        console.log("Event Publisher:", eventPublisher);
        EventProver(eventProver).addEventPublisher(eventPublisher);
        console.log("Event publisher added");
    }
}
