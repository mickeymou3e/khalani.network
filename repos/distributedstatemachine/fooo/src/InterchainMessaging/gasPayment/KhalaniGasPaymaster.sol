pragma solidity ^0.8.4;

import "./AbstractGasPaymaster.sol";

/**
 * @title KhalaniGasPaymaster
 * @notice This contract extends AbstractGasPaymaster and is designed for Khalani network gas payments.
 * It provides an implementation for paying for gas with domain-specific and token-specific gas overheads.
 * @dev The gas price is assumed to be 1 for all transactions in the Khalani network.
 */
contract KhalaniGasPaymaster is AbstractGasPaymaster {

    /**
     * @notice Pay for the gas cost of a specific message.
     * @dev Emits a GasPayment event indicating the amount of gas used and the required payment.
     * @param _messageId The ID of the message whose gas cost is being paid.
     * @param _destinationDomain The domain to which the message is being sent.
     * @param _numTokens The number of different tokens involved in the payment.
     * @param _refundAddress The address where any overpayment should be refunded.
     */
    function payForGas(
        bytes32 _messageId,
        uint32 _destinationDomain,
        uint256 _numTokens,
        address _refundAddress
    ) external payable override {
        uint256 _gasAmount = destinationGasAmount(_destinationDomain, _numTokens);
        uint256 _requiredPayment = _gasAmount ; //kept for now
        emit GasPayment(_messageId, _gasAmount, _requiredPayment);
    }

    /**
     * @notice Calculate the total destination gas amount based on domain and number of tokens.
     * @param _destinationDomain The domain to which the message is being sent.
     * @param _numTokens The number of different tokens involved in the payment.
     * @return The total amount of gas required for the message.
     */
    function destinationGasAmount(uint32 _destinationDomain, uint256 _numTokens)
    public
    view
    override
    returns (uint256)
    {
        return destinationGasOverhead[_destinationDomain] + _numTokens * unitTokenGasOverhead;
    }

    /**
     * @notice Quote the payment required for a given gas amount and destination domain.
     * @dev The gas price is assumed to be 1 in Khalani, so the required payment equals the gas amount.
     * @param _destinationDomain The domain to which the message is being sent.
     * @param _numTokens The number of different tokens involved in the payment.
     * @return The required payment for the given gas amount.
     */
    function quoteSend(uint32 _destinationDomain, uint256 _numTokens) public view override returns (uint256) {
        return destinationGasAmount(_destinationDomain, _numTokens) * 1;
    }
}