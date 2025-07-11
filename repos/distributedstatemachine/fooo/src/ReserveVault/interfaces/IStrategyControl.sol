pragma solidity ^0.8.0;

interface IStrategyControl {
    function deployFunds(uint256 _amount) external;
    function withdrawFunds(uint256 _amount) external;
    function harvestAndReport() external returns (uint256);
}