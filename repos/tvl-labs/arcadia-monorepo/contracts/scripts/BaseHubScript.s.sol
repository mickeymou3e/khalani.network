// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {BaseScript} from "./BaseScript.s.sol";

abstract contract BaseHubScript is BaseScript {
    address internal intentBook;
    address internal mTokenManager;
    address internal mTokenRegistry;
    address internal receiptManager;
    address internal spokeEventVerifier;
    uint256 internal spokeChainId;

    function preProcess() internal override {
        loadBaseInformation();
        medusa = vm.envAddress("MEDUSA");
    }

    function getMailbox() internal override returns (address) {
        return vm.envAddress("HUB_MAILBOX");
    }

    function getSpokeChainId() internal returns (uint256) {
        return vm.envUint("SPOKE_CHAIN_ID");
    }

    function getSpokeEventVerifier() internal returns (address) {
        address spokeVerifier =
            getContractAddressFromBroadcast("EventVerifier", "SpokeDeployCoreProtocol.s.sol", getSpokeChainId());
        if (spokeVerifier == address(0)) {
            spokeVerifier = vm.envAddress("SPOKE_CHAIN_EVENT_VERIFIER");
        }

        if (spokeVerifier == address(0)) {
            revert("Spoke event verifier not found");
        }
        return spokeVerifier;
    }
}
