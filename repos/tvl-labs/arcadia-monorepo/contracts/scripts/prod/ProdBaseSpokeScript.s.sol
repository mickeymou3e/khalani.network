// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {ProdBaseScript, DeploymentInfoSource} from "./ProdBaseScript.s.sol";

abstract contract ProdBaseSpokeScript is ProdBaseScript {
    uint256 internal hubChainId;
    address internal hubEventVerifier;
    address internal assetReserves;
    address internal PERMIT2;

    function preProcess() internal override {
        loadBaseInformation();
        PERMIT2 = vm.envAddress("PERMIT2");
    }

    function getMailbox() internal view override returns (address) {
        return vm.envAddress("SPOKE_MAILBOX");
    }

    function getHubChainId() internal view returns (uint256) {
        return vm.envUint("HUB_CHAIN_ID");
    }

    function getHubEventVerifier() internal returns (address) {
        address hubVerifier =
            getContractAddressFromBroadcast("EventVerifier", "ProdHubDeployCoreProtocol.s.sol", getHubChainId());
        if (hubVerifier == address(0)) {
            hubVerifier = vm.envAddress("HUB_CHAIN_EVENT_VERIFIER");
        }

        if (hubVerifier == address(0)) {
            revert("Hub event verifier not found");
        }
        return hubVerifier;
    }
}
