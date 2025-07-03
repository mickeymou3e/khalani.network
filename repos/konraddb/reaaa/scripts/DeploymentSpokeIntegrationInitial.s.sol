// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {stdJson} from "forge-std/StdJson.sol";
// Event system interfacesimports
import "../src/event_system/interfaces/IEventProver.sol";
import "../src/event_system/interfaces/IEventVerifier.sol";
import "../src/event_system/interfaces/IEventProcessor.sol";
import "../src/event_system/interfaces/IEventPublisher.sol";
import "../src/event_system/interfaces/IEventHandler.sol";
import "../src/event_system/interfaces/IEventProducer.sol";

// Event system imports
import {EventProver} from "../src/event_system/EventProver.sol";
import {EventVerifier} from "../src/event_system/EventVerifier.sol";
import {HubHandler} from "../src/event_system/HubHandler.sol";
import {SpokeHandler} from "../src/event_system/SpokeHandler.sol";
import {HubPublisher} from "../src/event_system/HubPublisher.sol";
import {SpokePublisher} from "../src/event_system/SpokePublisher.sol";

// Event system bridge app imports
import "../src/event_system/apps/bridge/AssetRegistry.sol";
import "../src/event_system/apps/bridge/AssetReserves.sol";

bytes32 constant DEPOSIT_EVENT_ID = keccak256("DEPOSIT_EVENT");
bytes32 constant WITHDRAWAL_EVENT_ID = keccak256("WITHDRAWAL_EVENT_ID");

// Assumes SPOKE_DEPLOYER == the same address used for hub deployments
contract DeploymentSpokeIntegrationInitial is Script {
    bytes32 public withdrawalEventType;
    bytes32 public withdrawalEventTypeHash =
        keccak256("MTokenWithdrawal(address token, uint256 amount, address withdrawer)");

    function run() external {
        uint256 spokeDeployerKey = vm.envUint("SPOKE_DEPLOYER_KEY");
        address spokeDeployer = vm.envAddress("SPOKE_DEPLOYER");
        address spokeMailbox = vm.envAddress("SPOKE_MAILBOX");
        uint256 spokeChainId = vm.envUint("SPOKE_CHAIN_ID");
        // address arcadiaHubChainEventVerifier = vm.envAddress("HUB_CHAIN_EVENT_VERIFIER");
        uint256 hubChainId = vm.envUint("HUB_CHAIN_ID");
        address permit2Address = vm.envAddress("PERMIT2_ADDRESS");
        withdrawalEventType = keccak256(abi.encode(spokeDeployer, withdrawalEventTypeHash));

        vm.startBroadcast(spokeDeployerKey);
        address spokeEventHandler = _deploySpokeEventHandler();
        address arcadiaHubChainEventVerifier = getHubEventVerifier();
        address spokeEventProver = _deployEventProver(spokeMailbox, arcadiaHubChainEventVerifier);

        address spokePublisher = _deploySpokePublisher(uint32(hubChainId));
        address assetReserves = _deployAssetReserves(spokeDeployer, spokePublisher, spokeEventHandler, permit2Address);
        address spokeEventVerifier = _deployEventVerifier(spokeMailbox, spokeEventHandler);

        SpokeHandler(spokeEventHandler).registerEventVerifier(spokeEventVerifier);
        _setupDeps(spokeEventHandler, spokeEventProver, spokeEventVerifier, spokePublisher, assetReserves);
        console.log("Spoke handler: %s", spokeEventHandler);
        console.log("Spoke verifier: %s", spokeEventVerifier);
        console.log("Spoke publisher: %s", spokePublisher);
        console.log("Spoke prover: %s", spokeEventProver);
        vm.stopBroadcast();
    }

    function getHubEventVerifier() public returns (address) {
        string memory root = vm.projectRoot();
        string memory path = string.concat(root, "/broadcast/DeploymentHubCore.s.sol/31337/run-latest.json");
        string memory json = vm.readFile(path);
        bytes memory contractAddress = stdJson.parseRaw(json, ".transactions[8].contractAddress");
        address hubEventVerifier = bytesToAddress(contractAddress);
        return hubEventVerifier;
    }

    function bytesToAddress(bytes memory bys) private pure returns (address addr) {
        assembly {
            addr := mload(add(bys, 32))
        }
    }

    function _deploySpokeEventHandler() internal returns (address spokeHandler) {
        spokeHandler = address(new SpokeHandler());
    }

    function _deployEventProver(address spokeMailbox, address hubChainEventVerifier)
        internal
        returns (address spokeEventProver)
    {
        spokeEventProver = address(new EventProver(spokeMailbox, hubChainEventVerifier));
    }

    function _deploySpokePublisher(uint32 hubChainId) internal returns (address spokePublisher) {
        spokePublisher = address(new SpokePublisher(hubChainId));
    }

    function _deployAssetReserves(
        address spokeDeployer,
        address spokePublisher,
        address spokeEventHandler,
        address permit2Address
    ) internal returns (address assetReserves) {
        assetReserves = address(new AssetReserves(spokeDeployer, spokePublisher, spokeEventHandler, permit2Address));
    }

    function _deployEventVerifier(address spokeMailbox, address spokeHandler) internal returns (address) {
        return address(new EventVerifier(spokeMailbox, spokeHandler));
    }

    function _setupDeps(
        address spokeHandler,
        address spokeProver,
        address spokeVerifier,
        address spokePublisher,
        address assetReserves,
        uint32 hubChainId
    ) internal {
        _setupSpokeHandlerDeps(spokeHandler, spokeVerifier, assetReserves);
        _setupSpokePublisherDeps(spokePublisher, spokeProver, assetReserves, hubChainId);
    }

    function _setupSpokeHandlerDeps(address spokeHandler, address spokeVerifier, address assetReserves) internal {
        SpokeHandler(spokeHandler).registerEventVerifier(spokeVerifier);
        SpokeHandler(spokeHandler).registerEventProcessor(assetReserves);
        SpokeHandler(spokeHandler).registerEventType(assetReserves, withdrawalEventType);
    }

    function _setupSpokePublisherDeps(
        address spokePublisher,
        address spokeProver,
        address assetReserves,
        uint32 hubChainId
    ) internal {
        SpokePublisher(spokePublisher).registerEventProver(hubChainId, spokeProver);
        SpokePublisher(spokePublisher).registerEventOnProducer(assetReserves, DEPOSIT_EVENT_ID);
    }
}
