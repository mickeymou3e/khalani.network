// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {IntentBook} from "../../src/hub/IntentBook.sol";
import {MTokenManager} from "../../src/hub/MTokenManager.sol";
import {ReceiptManager} from "../../src/hub/ReceiptManager.sol";
import {MTokenRegistry} from "../../src/modules/MTokenRegistry.sol";
import {MTokenCrossChainAdapter} from "../../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {HubPublisher} from "../../src/event_system/HubPublisher.sol";
import {HubHandler} from "../../src/event_system/HubHandler.sol";
import {SolutionLib} from "../../src/libraries/SolutionLib.sol";
import {MTOKEN_WITHDRAWAL_STRUCT_TYPE_HASH} from "../../src/types/Events.sol";
import {EventVerifier} from "../../src/event_system/EventVerifier.sol";
import {MockInterchainGasPaymaster} from "../../src/event_system/MockInterchainGasPaymaster.sol";
import {GasAmountOracle} from "../../src/event_system/GasAmountOracle.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {ProdBaseScript, DeploymentInfoSource} from "./ProdBaseScript.s.sol";
import {BaseHubScript} from "./ProdBaseHubScript.s.sol";
import {AccessManager} from "@oz5/contracts/access/manager/AccessManager.sol";
import {RolesLib} from "../../src/libraries/RolesLib.sol";

contract ProdHubDeployPermissioning is BaseHubScript {
    function run() public override {
        preProcess();

        vm.startBroadcast(deployer);
        manager = address(new AccessManager(roleAdmin));
        vm.stopBroadcast();
        vm.startBroadcast(roleAdmin);
        // Create same roles and assign roles to relevant addresses, just as in SystemState.sol
        AccessManager(manager).grantRole(RolesLib.CONTRACTS_MANAGER_ROLE, contractsManager, 0);
        AccessManager(manager).grantRole(RolesLib.INTENT_UPDATER_ROLE, medusa, 0);
        AccessManager(manager).grantRole(RolesLib.INTENT_PUBLISHER_ROLE, medusa, 0);
        AccessManager(manager).grantRole(RolesLib.MTOKEN_REMOTE_WITHDRAWER_ROLE, medusa, 0);
        AccessManager(manager).grantRole(RolesLib.INTENT_CANCELLER_ROLE, medusa, 0);
        vm.stopBroadcast();
    }
}
