// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

struct Receipt {
    address mToken;
    uint256 mTokenAmount;
    address owner;
    bytes32 intentHash;
}
