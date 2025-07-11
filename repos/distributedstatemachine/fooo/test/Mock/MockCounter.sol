// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/console.sol";

contract MockCounter{
    uint256 count;
    address caller;
    modifier onlyICA(){
        console.log(msg.sender);
        require(msg.sender == caller,"invalid caller");
        _;
    }
    constructor(address _caller){
        console.log(_caller);
        caller = _caller;
    }

    function increaseCount(uint256 a) public onlyICA{
        count = count + a;
    }

    function getCount() public returns(uint256) {
        return count;
    }
}