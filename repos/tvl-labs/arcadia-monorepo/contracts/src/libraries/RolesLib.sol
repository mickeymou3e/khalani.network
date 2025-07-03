// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

library RolesLib {
    // The Guardian role and default Role Admin for each role
    uint64 public constant ADMIN_ROLE = 0;
    // The role for managing the configuration of contracts
    uint64 public constant CONTRACTS_MANAGER_ROLE = 1;
    // The role that can update intent state. This is the role for solvers and intent lockers.
    uint64 public constant INTENT_UPDATER_ROLE = 10;

    // The role for creating intents
    uint64 public constant INTENT_PUBLISHER_ROLE = 11;

    // The role for cancelling intents
    uint64 public constant INTENT_CANCELLER_ROLE = 12;

    // The role for minting new mTokens, such as bridge contracts
    uint64 public constant MTOKEN_MINTER_ROLE = 20;

    // The role for moving mTokens out of Arcadia
    uint64 public constant MTOKEN_REMOTE_WITHDRAWER_ROLE = 21;

    uint64 public constant GAS_ORACLE_ROLE = 22;

    // The default public role with no permissions
    uint64 public constant PUBLIC_ROLE = type(uint64).max;
}
