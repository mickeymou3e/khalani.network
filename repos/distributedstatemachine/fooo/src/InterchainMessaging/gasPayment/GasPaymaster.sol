// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity >=0.8.0;

import "./AbstractGasPaymaster.sol";

/**
 * @title GasPaymaster
 * @notice This contract extends the AbstractGasPaymaster, and forwards payment-related calls to an inner Interchain Gas Paymaster (IGP).
 * It includes additional logic for handling domain-specific and token-specific gas overheads.
 */
contract GasPaymaster is AbstractGasPaymaster {
    /// @notice The inner IGP contract that actual payment-related logic is forwarded to with oracles and exchange rates
    IInterchainGasPaymaster public immutable innerIgp;

    /// @notice Default gas overhead amount to be used if a domain-specific overhead has not been set.
    uint constant public DEFAULT_GAS_OVERHEAD = 100_000;

    /**
     * @param _innerIgp The address of the inner IGP contract to forward payment-related calls to.
     */
    constructor(address _innerIgp) {
        innerIgp = IInterchainGasPaymaster(_innerIgp);
    }

    /**
     * @notice Pay for the gas cost of a specific message.
     * @dev Forwards the payment call to the inner IGP, after adding any domain-specific and token-specific gas overheads.
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
    ) external payable override {
        innerIgp.payForGas{value: msg.value}(
            _messageId,
            _destinationDomain,
            destinationGasAmount(_destinationDomain, _numTokens),
            _refundAddress
        );
    }

    /**
     * @notice Calculate the total destination gas amount based on domain and number of tokens.
     * @dev Includes both the domain-specific and token-specific gas overheads.
     * @param _destinationDomain The domain that the message is being sent to.
     * @param _numTokens The number of different tokens in the payment.
     * @return The total gas amount required for the operation.
     */
    function destinationGasAmount(uint32 _destinationDomain, uint256 _numTokens)
    public
    view
    override
    returns (uint256)
    {
        return (destinationGasOverhead[_destinationDomain] == 0 ? DEFAULT_GAS_OVERHEAD  : destinationGasOverhead[_destinationDomain]) + unitTokenGasOverhead * _numTokens;
    }

    /**
    * @dev Quote the payment required for a given number of tokens and destination domain.
    * @param _destinationDomain The domain that the message is being sent to.
    * @param _numTokens The number of different tokens in the payment.
    */
    function quoteSend(uint32 _destinationDomain, uint256 _numTokens) external view override returns (uint256) {
        return innerIgp.quoteGasPayment(_destinationDomain, destinationGasAmount(_destinationDomain, _numTokens));
    }
}