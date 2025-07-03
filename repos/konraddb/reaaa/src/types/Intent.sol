// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

enum OutcomeAssetStructure {
    AnySingle,
    Any,
    All
}

enum FillStructure {
    Exactly,
    Minimum,
    PctFilled,
    ConcreteRange
}

struct Outcome {
    address[] mTokens;
    uint256[] mAmounts;
    OutcomeAssetStructure outcomeAssetStructure;
    FillStructure fillStructure;
}

struct Intent {
    address author;
    uint256 ttl;
    uint256 nonce;
    address srcMToken;
    uint256 srcAmount;
    Outcome outcome;
}

struct SignedIntent {
    Intent intent;
    bytes signature;
}

enum IntentState {
    NonExistent,
    Open,
    Locked,
    Solved,
    Settled,
    Expired,
    Cancelled
}
