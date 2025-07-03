// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IInterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";

contract MockInterchainGasPaymaster is IInterchainGasPaymaster {
    mapping(bytes32 => uint256) public payments;

    function payForGas(bytes32 _messageId, uint32 _destinationDomain, uint256 _gasAmount, address _refundAddress)
        external
        payable
        override
    {
        payments[_messageId] = msg.value;
    }

    function quoteGasPayment(uint32 _destinationDomain, uint256 _gasAmount) external pure override returns (uint256) {
        return _gasAmount;
    }
}
