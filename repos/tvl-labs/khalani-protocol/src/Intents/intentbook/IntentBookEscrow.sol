pragma solidity ^0.8.4;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

abstract contract IntentBookEscrow {

    function _deposit(ERC20 _token, uint _amount, address _from) internal {
        SafeERC20.safeTransferFrom(_token, _from, address(this), _amount);
    }

    function _withdraw(ERC20 _token, uint _amount, address _to) internal {
        SafeERC20.safeTransfer(_token, _to, _amount);
    }
}