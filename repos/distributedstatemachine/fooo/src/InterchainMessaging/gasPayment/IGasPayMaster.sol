// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";

/**
 * @title IGasPayMaster Interface
 * @dev This interface extends the IInterchainGasPaymaster and provides additional functions
 * for managing gas overheads across different domains and for different token units.
 */
interface IGasPayMaster {

    /**
     * @notice Emitted when a payment is made for a message's gas costs.
     * @param messageId The ID of the message to pay for.
     * @param gasAmount The amount of destination gas paid for.
     * @param payment The amount of native tokens paid.
     */
    event GasPayment(
        bytes32 indexed messageId,
        uint256 gasAmount,
        uint256 payment
    );

    /**
     * @notice Pay for the gas cost of a specific message.
     * @param _messageId The ID of the message to pay for.
     * @param _destinationDomain The domain that the message is being sent to.
     * @param _numTokens The number of different tokens in the payment.
     * @param _refundAddress The address to refund any overpayment to.
     */
    function payForGas(
        bytes32 _messageId,
        uint32 _destinationDomain,
        uint256 _numTokens,
        address _refundAddress
    ) external payable;

    /**
    * @notice Quote the payment required for a given destination domain and number of tokens.
    * @param _destinationDomain The domain for which the payment will be quoted.
    * @param _numTokens The number of tokens for the quote.
    */
    function quoteSend(uint32 _destinationDomain, uint256 _numTokens) external view returns (uint256);

    /**
     * @notice Calculate the total destination gas amount based on domain and number of tokens.
     * @param _destinationDomain The domain for which the gas amount will be calculated.
     * @param _numTokens The number of tokens for the calculation.
     * @return The total gas amount required for the operation.
     */
    function destinationGasAmount(uint32 _destinationDomain, uint256 _numTokens)
    external
    view
    returns (uint256);

    /**
     * @notice Set the destination gas overhead for a specific domain.
     * @dev Can only be called by the contract owner.
     * @param _destinationDomain The domain for which the gas overhead is set.
     * @param _gasOverhead The gas overhead amount to set.
     */
    function setDestinationGasOverhead(uint32 _destinationDomain, uint256 _gasOverhead) external;

    /**
     * @notice Set the unit token gas overhead.
     * @dev Can only be called by the contract owner.
     * @param _unitTokenGasOverhead The unit token gas overhead amount to set.
     */
    function setUnitTokenGasOverhead(uint256 _unitTokenGasOverhead) external;
}
