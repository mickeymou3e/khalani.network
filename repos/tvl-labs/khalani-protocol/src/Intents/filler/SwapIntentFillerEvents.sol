// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity ^0.8.0;

interface SwapIntentFillerEvents {
    event Fill(
        bytes32 indexed intentId,
        address indexed filler,
        address indexed author,
        uint256 fillAmount
    );
}
