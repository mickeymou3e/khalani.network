// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../src/libraries/IntentLib.sol";
import "../src/types/Intent.sol";
import {console} from "forge-std/console.sol";

contract IntentLibTest is Test {
    address user = address(0x123);
    address mToken = address(0xABC);

    function testHashOutcome() public {
        Outcome memory outcome = Outcome({
            mTokens: new address[](1),
            mAmounts: new uint256[](1),
            outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
            fillStructure: FillStructure.Exactly
        });

        outcome.mTokens[0] = mToken;
        outcome.mAmounts[0] = 100 ether;

        bytes32 outcomeHash = IntentLib.hashOutcome(outcome);
        assertTrue(outcomeHash != bytes32(0), "Outcome hash should not be zero");
    }

    function testEncodedOutcome() public {
        Outcome memory outcome = Outcome({
            mTokens: new address[](1),
            mAmounts: new uint256[](1),
            outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
            fillStructure: FillStructure.Exactly
        });

        outcome.mTokens[0] = mToken;
        outcome.mAmounts[0] = 100 ether;

        bytes memory encodedOutcome = IntentLib.encodedOutcome(outcome);
        assertTrue(encodedOutcome.length > 0, "Encoded outcome should not be empty");
    }

    function testHashIntent() public {
        Intent memory intent = Intent({
            author: user,
            ttl: block.timestamp + 1 days,
            nonce: 1,
            srcMToken: mToken,
            srcAmount: 100 ether,
            outcome: Outcome({
                mTokens: new address[](1),
                mAmounts: new uint256[](1),
                outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
                fillStructure: FillStructure.Exactly
            })
        });

        intent.outcome.mTokens[0] = mToken;
        intent.outcome.mAmounts[0] = 100 ether;

        bytes32 intentHash = IntentLib.hashIntent(intent);
        assertTrue(intentHash != bytes32(0), "Intent hash should not be zero");
    }

    function testValidateTtl() public {
        Intent memory validIntent = Intent({
            author: user,
            ttl: block.number + 10, // Valid TTL
            nonce: 1,
            srcMToken: mToken,
            srcAmount: 100 ether,
            outcome: Outcome({
                mTokens: new address[](1),
                mAmounts: new uint256[](1),
                outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
                fillStructure: FillStructure.Exactly
            })
        });

        vm.roll(block.number + 5); // Move forward in time (still valid)
        IntentLib.validateTtl(validIntent); // Should NOT revert

        Intent memory expiredIntent = validIntent;
        expiredIntent.ttl = block.number - 5; // Expired TTL

        assertFalse(IntentLib.isValidTtl(expiredIntent), "Intent should be expired");
    }
}
