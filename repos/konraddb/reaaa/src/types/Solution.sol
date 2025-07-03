// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Intent.sol";
import "./Receipt.sol";

enum OutType {
    Intent,
    Receipt
}

struct OutputIdx {
    OutType outType;
    uint64 outIdx;
}

struct MoveRecord {
    uint64 srcIdx;
    OutputIdx outputIdx;
    uint256 qty;
}

struct FillRecord {
    uint64 inIdx;
    uint64 outIdx;
    OutType outType;
}

struct Solution {
    bytes32[] intentIds;
    Intent[] intentOutputs;
    Receipt[] receiptOutputs;
    MoveRecord[] spendGraph;
    FillRecord[] fillGraph;
}
