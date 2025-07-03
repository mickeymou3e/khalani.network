// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./Custodian.sol";

contract IntentBook {
    using SafeERC20 for IERC20;

    struct Intent {
        address author;
        uint256 nonce;
        address srcToken;
        uint256 srcAmount;
        // If you spend s (s <= srcAmount), you must fill s * dstRatioMul / dstRatioDiv.
        address dstToken;
        uint256 dstRatioMul;
        uint256 dstRatioDiv;
    }

    struct Action {
        bytes32 intentHash;
        uint256 spend;
        uint256 fill;
        // solution.tokens[srcTokenIdx] == intents[intentHash].srcToken
        uint32 srcTokenIdx;
        // solution.tokens[dstTokenIdx] == intents[intentHash].dstToken
        uint32 dstTokenIdx;
    }

    struct Solution {
        Action[] actions;
        // All the tokens involved.
        address[] tokens;
    }

    Custodian public immutable custodian;

    mapping(bytes32 => Intent) private intents;
    mapping(address => uint256) private nonces;

    event IntentPosted(bytes32 intentHash, Intent intent);
    event IntentCancelled(bytes32 intentHash);
    event Executed(Action action);
    event IntentSolved(bytes32 intentHash);

    constructor() {
        custodian = new Custodian();
    }

    // Don't want to write this in js so we have this.
    function hashIntent(Intent calldata intent) external pure returns (bytes32) {
        return keccak256(abi.encode(intent));
    }

    function postIntent(Intent calldata intent) external returns (bytes32) {
        bytes32 intentHash = keccak256(abi.encode(intent));

        require(intent.author == msg.sender, "Author mismatch");
        require(intents[intentHash].author == address(0), "Intent already exists");
        require(intent.nonce >= nonces[intent.author], "Invalid nonce");
        nonces[intent.author] = intent.nonce + 1;

        require(intent.srcAmount > 0, "Invalid src amount");
        require(intent.dstRatioMul > 0 && intent.dstRatioDiv > 0, "Invalid dst ratio");

        IERC20(intent.srcToken).safeTransferFrom(intent.author, address(custodian), intent.srcAmount);

        intents[intentHash] = intent;
        emit IntentPosted(intentHash, intent);
        return intentHash;
    }

    function getIntent(bytes32 intentHash) external view returns (Intent memory intent) {
        return intents[intentHash];
    }

    function getNonce(address author) external view returns (uint256 nonce) {
        return nonces[author];
    }

    function cancelIntent(bytes32 intentHash) external {
        Intent storage intent = intents[intentHash];
        require(intent.author == msg.sender, "Author mismatch");
        custodian.transfer(intent.srcToken, intent.author, intent.srcAmount);
        delete intents[intentHash];
        emit IntentCancelled(intentHash);
    }

    function execute(Solution calldata solution) external {
        for (uint256 i = 0; i < solution.actions.length; i++) {
            Action calldata action = solution.actions[i];
            Intent storage intent = intents[action.intentHash];

            require(intent.author != address(0), "Intent not found");

            require(action.fill > 0 && action.spend > 0, "Invalid action");

            uint256 expectedFill = action.spend * intent.dstRatioMul / intent.dstRatioDiv;
            require(action.fill >= expectedFill, "Insufficient fill");

            require(intent.srcAmount >= action.spend, "Insufficient src amount");
            intent.srcAmount -= action.spend;
            custodian.transfer(intent.srcToken, address(this), action.spend);

            require(solution.tokens[action.srcTokenIdx] == intent.srcToken);
            require(solution.tokens[action.dstTokenIdx] == intent.dstToken);

            emit Executed(action);
            if (intent.srcAmount == 0) {
                emit IntentSolved(action.intentHash);
            }
        }

        for (uint256 i = 0; i < solution.actions.length; i++) {
            Action calldata action = solution.actions[i];
            Intent storage intent = intents[action.intentHash];

            IERC20(intent.dstToken).safeTransfer(intent.author, action.fill);
        }

        // Require that there's no token left.
        for (uint256 i = 0; i < solution.tokens.length; i++) {
            require(IERC20(solution.tokens[i]).balanceOf(address(this)) == 0, "Tokens left");
        }
    }
}
