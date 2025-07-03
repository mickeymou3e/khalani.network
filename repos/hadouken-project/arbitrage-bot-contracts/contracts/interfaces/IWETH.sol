pragma solidity 0.8.12;
import {IERC20} from './IERC20.sol';

interface IWETH is IERC20 {
  function deposit() external payable;

  function transfer(address to, uint value) external override returns (bool);

  function withdraw(uint) external;
}
