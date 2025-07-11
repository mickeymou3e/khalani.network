pragma solidity ^0.8.0;

interface IStrategy {
    function asset() external view returns (address);
}