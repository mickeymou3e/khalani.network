pragma solidity ^0.8.4;

import "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";

contract MockIgp is IInterchainGasPaymaster {
    uint256 public constant gasPrice = 10;

    function payForGas(
        bytes32 _messageId,
        uint32 _destinationDomain,
        uint256 _gasAmount,
        address _refundAddress
    ) external payable override {
        uint256 _requiredPayment = quoteGasPayment(
            _destinationDomain,
            _gasAmount
        );
        require(
            msg.value >= _requiredPayment,
            "insufficient interchain gas payment"
        );
        uint256 _overpayment = msg.value - _requiredPayment;
        if (_overpayment > 0) {
            (bool _success, ) = _refundAddress.call{value: _overpayment}("");
            require(_success, "Interchain gas payment refund failed");
        }
        emit GasPayment(_messageId, _gasAmount, _requiredPayment);
    }

    function quoteGasPayment(uint32 _destinationDomain, uint256 _gasAmount)
        public
        view
        virtual
        override
        returns (uint256)
    {
        return gasPrice * _gasAmount;
    }
}