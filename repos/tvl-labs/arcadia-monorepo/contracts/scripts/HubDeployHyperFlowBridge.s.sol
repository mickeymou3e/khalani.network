// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {console} from "forge-std/console.sol";
import {BaseHubScript} from "./BaseHubScript.s.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {MTokenManager} from "../src/hub/MTokenManager.sol";
import {MTokenRegistry} from "../src/modules/MTokenRegistry.sol";
import {HubPublisher} from "../src/event_system/HubPublisher.sol";
import {HubHandler} from "../src/event_system/HubHandler.sol";
import {MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH} from "../src/types/Events.sol";
import {AccessManager} from "@oz5/contracts/access/manager/AccessManager.sol";
import {RolesLib} from "../src/libraries/RolesLib.sol";

contract HubDeployHyperFlowBridge is BaseHubScript {
    function run() public override {
        preProcess();
        manager = getContractAddressFromBroadcast("AccessManager", "DeployPermissions.s.sol", chainId);

        vm.startBroadcast(deployerKey);
        mTokenManager = getContractAddressFromBroadcast("MTokenManager", "HubDeployCoreProtocol.s.sol", chainId);
        mTokenRegistry = getContractAddressFromBroadcast("MTokenRegistry", "HubDeployCoreProtocol.s.sol", chainId);
        eventPublisher =
            payable(getContractAddressFromBroadcast("HubPublisher", "HubDeployCoreProtocol.s.sol", chainId));
        eventHandler = getContractAddressFromBroadcast("HubHandler", "HubDeployCoreProtocol.s.sol", chainId);

        address adapter =
            address(new MTokenCrossChainAdapter(mTokenManager, eventPublisher, mTokenRegistry, eventHandler));
        bytes32 withdrawalEventType = keccak256(abi.encode(adapter, MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH));
        MTokenCrossChainAdapter(adapter).transferOwnership(contractsManager);
        vm.stopBroadcast();
        vm.startBroadcast(roleAdminKey);
        AccessManager(manager).grantRole(RolesLib.MTOKEN_REMOTE_WITHDRAWER_ROLE, adapter, 0);
        AccessManager(manager).grantRole(RolesLib.MTOKEN_MINTER_ROLE, adapter, 0);
        vm.stopBroadcast();
        vm.startBroadcast(contractsManagerKey);
        console.log("eventPublisher:", eventPublisher);
        HubPublisher(eventPublisher).addProducer(adapter);
        HubPublisher(eventPublisher).registerEventOnProducer(adapter, withdrawalEventType);
        MTokenManager(mTokenManager).setWithdrawalHandler(adapter);
        vm.stopBroadcast();
    }
}
