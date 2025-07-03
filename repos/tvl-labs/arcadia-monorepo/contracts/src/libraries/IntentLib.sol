// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Outcome, OutcomeAssetStructure, FillStructure, Intent} from "../types/Intent.sol";
import {OutType, OutputIdx, Outcome, MoveRecord, Receipt} from "../types/Solution.sol";

library IntentLib {
    bytes32 public constant INTENT_TYPE_HASH = keccak256(
        "Intent(address author,uint256 ttl,uint256 nonce,address srcMToken,uint256 srcAmount,Outcome outcome)Outcome(address[] mTokens,uint256[] mAmounts,uint8 outcomeAssetStructure,uint8 fillStructure)"
    );

    function outcomeTypeHash() public pure returns (bytes32) {
        return
            keccak256("Outcome(address[] mTokens,uint256[] mAmounts,uint8 outcomeAssetStructure,uint8 fillStructure)");
    }

    function hashOutcome(Outcome memory outcome) public pure returns (bytes32) {
        return keccak256(
            abi.encode(
                keccak256(
                    "Outcome(address[] mTokens,uint256[] mAmounts,uint8 outcomeAssetStructure,uint8 fillStructure)"
                ),
                keccak256(abi.encodePacked(outcome.mTokens)),
                keccak256(abi.encodePacked(outcome.mAmounts)),
                outcome.outcomeAssetStructure,
                outcome.fillStructure
            )
        );
    }

    function encodedOutcome(Outcome memory outcome) public pure returns (bytes memory _encodedOutcome) {
        return abi.encode(
            keccak256("Outcome(address[] mTokens,uint256[] mAmounts,uint8 outcomeAssetStructure,uint8 fillStructure)"),
            keccak256(abi.encodePacked(outcome.mTokens)),
            keccak256(abi.encodePacked(outcome.mAmounts)),
            outcome.outcomeAssetStructure,
            outcome.fillStructure
        );
    }

    function hashOutcomeAlternate(Outcome memory outcome) public pure returns (bytes32 _outcomeHash) {
        _outcomeHash = keccak256(
            abi.encode(
                keccak256(
                    "Outcome(address[] mTokens,uint256[] mAmounts,uint8 outcomeAssetStructure,uint8 fillStructure)"
                ),
                keccak256(abi.encode(outcome.mTokens)),
                keccak256(abi.encode(outcome.mAmounts)),
                outcome.outcomeAssetStructure,
                outcome.fillStructure
            )
        );
    }

    function hashStructOfIntent(Intent memory intent, address verifyingContract) public view returns (bytes32) {
        bytes32 structHash = keccak256(
            abi.encode(
                INTENT_TYPE_HASH,
                intent.author,
                intent.ttl,
                intent.nonce,
                intent.srcMToken,
                intent.srcAmount,
                hashOutcome(intent.outcome)
            )
        );
        return structHash;
    }

    function eip712AbiEncodedData(Intent memory intent) public view returns (bytes memory _encodedData) {
        _encodedData = abi.encode(
            intent.author, intent.ttl, intent.nonce, intent.srcMToken, intent.srcAmount, hashOutcome(intent.outcome)
        );
    }

    function alternativeEncode(Intent memory intent) public view returns (bytes memory _encodedData) {
        _encodedData =
            abi.encode(intent.author, intent.ttl, intent.nonce, intent.srcMToken, intent.srcAmount, intent.outcome);
    }

    function hashIntentWithEip712(Intent memory intent, address verifyingContract) internal view returns (bytes32) {
        bytes32 DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256("EIP712Domain(string name,string version,address verifyingContract)"),
                keccak256(bytes("KhalaniIntent")),
                keccak256(bytes("1.0.0")),
                verifyingContract
            )
        );

        bytes32 structHash = keccak256(
            abi.encode(
                INTENT_TYPE_HASH,
                intent.author,
                intent.ttl,
                intent.nonce,
                intent.srcMToken,
                intent.srcAmount,
                hashOutcome(intent.outcome)
            )
        );

        return keccak256(abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, structHash));
    }

    function hashIntent(Intent memory intent) internal view returns (bytes32) {
        return keccak256(abi.encode(intent));
    }

    function validateTtl(Intent memory intent) internal view {
        require(isValidTtl(intent), "IntentLib: intent expired");
    }

    function isValidTtl(Intent memory intent) internal view returns (bool) {
        return block.number <= intent.ttl;
    }
}
