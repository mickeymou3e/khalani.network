// SPDX-License-Identifier: MIT OR Apache-2.0
pragma solidity ^0.8.4;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import "./IGasPayMaster.sol";

/**
 * @title Gas Paymaster Abstract Contract
 * @dev This abstract contract provides a base layer for gas paymaster implementations.
 * It allows setting and querying of gas overhead for specific destination domains and token units.
 */
abstract contract AbstractGasPaymaster is IGasPayMaster, Ownable {

    /// @dev Mapping to store the gas overhead for different destination domains.
    mapping(uint32 => uint256) public destinationGasOverhead;

    /// @dev The overhead of gas required to mint a token unit.
    uint256 public unitTokenGasOverhead;

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
    ) external payable virtual;

    function quoteSend(uint32 _destinationDomain, uint256 _numTokens) external virtual view returns (uint256);

    /**
     * @notice Set the destination gas overhead for a specific domain.
     * @dev Can only be called by the contract owner.
     * @param _destinationDomain The domain for which the gas overhead is set.
     * @param _gasOverhead The gas overhead amount to set.
     */
    function setDestinationGasOverhead(uint32 _destinationDomain, uint256 _gasOverhead) external onlyOwner {
        destinationGasOverhead[_destinationDomain] = _gasOverhead;
    }

    /**
     * @notice Set the unit token gas overhead.
     * @dev Can only be called by the contract owner.
     * @param _unitTokenGasOverhead The unit token gas overhead amount to set.
     */
    function setUnitTokenGasOverhead(uint256 _unitTokenGasOverhead) external onlyOwner {
        unitTokenGasOverhead = _unitTokenGasOverhead;
    }

    /**
     * @notice Calculate the total destination gas amount based on domain and number of tokens.
     * @dev This is a virtual function and should be overridden by the derived class.
     * @param _destinationDomain The domain for which the gas amount will be calculated.
     * @param _numTokens The number of tokens for the calculation.
     * @return The total gas amount required.
     */
    function destinationGasAmount(uint32 _destinationDomain, uint256 _numTokens) public view virtual returns (uint256);

}
