// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../src/hub/IntentBook.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/types/Intent.sol";
import "../src/types/Events.sol";
import "../src/types/Solution.sol";
import "../src/types/Receipt.sol";
import "../src/hub/MTokenManager.sol";
import "../src/hub/MToken.sol";
import "../src/hub/ReceiptManager.sol";
import "../src/modules/MTokenRegistry.sol";
import {Utilities} from "./Utilities.utils.sol";
import {Receipt as ReceiptStruct} from "../src/hub/ReceiptManager.sol";
import {console} from "forge-std/console.sol";
import {InterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/hooks/igp/InterchainGasPaymaster.sol";
import {SignatureLib} from "../src/libraries/SignatureLib.sol";
import {SystemState, MockERC20} from "./SystemState.sol";
import {IAccessManaged} from "@oz5/contracts/access/manager/IAccessManaged.sol";

contract IntentBookTest is Test, SystemState {
    function testPostIntent() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);

        bytes32 intentId = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken),
                500 * 10 ** 18,
                address(mToken),
                500 * 10 ** 18,
                user1,
                FillStructure.Exactly,
                key,
                address(intentBook),
                intentBook.getNonce(user1) + 1
            )
        );

        // Retrieve the intent and validate
        Intent memory retrievedIntent = intentBook.getIntent(intentId);
        assertEq(retrievedIntent.author, user1);
        assertEq(retrievedIntent.ttl, block.timestamp + 1 hours);
        assertEq(retrievedIntent.nonce, 1);

        vm.stopPrank();
    }

    function testUnauthorizedIntentPublisher() public {
        vm.startPrank(user2);

        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken),
            500 * 10 ** 18,
            user1,
            FillStructure.Exactly,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 1
        );

        vm.expectRevert(abi.encodeWithSignature("IntentBook__UnauthorizedIntentPublisher()"));
        intentBook.publishIntent(signedIntent);

        vm.stopPrank();
    }

    function testLockIntent() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        bytes32 intentId = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken),
                500 * 10 ** 18,
                address(mToken),
                500 * 10 ** 18,
                user1,
                FillStructure.Exactly,
                key,
                address(intentBook),
                intentBook.getNonce(user1) + 1
            )
        );

        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Open),
            "State should be Open after posting"
        );
        vm.stopPrank();

        // Lock the intent
        vm.startPrank(medusa);
        intentBook.lockIntent(intentId);

        // Verify that the intent is locked
        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Locked)
        );
        vm.stopPrank();
    }

    function testCancelIntent() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        uint256 user1BalanceBefore = mToken.balanceOf(user1);

        // Post a valid intent
        mToken.approve(address(intentBook), 1000 * 10 ** 18);
        bytes32 intentId = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken),
                500 * 10 ** 18,
                address(mToken),
                500 * 10 ** 18,
                user1,
                FillStructure.Exactly,
                key,
                address(intentBook),
                intentBook.getNonce(user1) + 1 + 1
            )
        );
        vm.stopPrank();

        // Check the user's balance has decreased
        assertEq(
            mToken.balanceOf(user1),
            user1BalanceBefore - 500 * 10 ** 18,
            "User 1 should have 500 mtoken less"
        );

        // Check the intent has the balance equal to the amount the user placed within the intent
        assertEq(
            mToken.balanceOf(intentId),
            500 * 10 ** 18,
            "Intent should have 500 mtoken"
        );

        // Cancel the intent by an unauthorized user
        vm.startPrank(user2);
        vm.expectRevert(
            abi.encodeWithSelector(
                IAccessManaged.AccessManagedUnauthorized.selector,
                user2
            )
        );
        intentBook.cancelIntent(intentId);
        vm.stopPrank();

        // Cancel the intent by medusa
        vm.startPrank(medusa);
        intentBook.cancelIntent(intentId);
        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Cancelled),
            "State should be Cancelled after cancellation"
        );

        // Check the intent has 0 balance
        assertEq(mToken.balanceOf(intentId), 0, "Intent should have 0 mtoken");

        // Check the user's balance has increased
        assertEq(
            mToken.balanceOf(user1),
            user1BalanceBefore,
            "User 1 should have 500 mtoken more"
        );

        vm.stopPrank();
    }

    function testCancelNonOpenIntent() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        // Post and lock an intent
        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);
        bytes32 intentId = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken),
                500 * 10 ** 18,
                address(mToken),
                500 * 10 ** 18,
                user1,
                FillStructure.Exactly,
                key,
                address(intentBook),
                intentBook.getNonce(user1) + 1 + 1
            )
        );
        vm.stopPrank();

        vm.startPrank(medusa);
        intentBook.lockIntent(intentId);
        vm.stopPrank();

        // Cancel the locked intent
        vm.startPrank(medusa);
        vm.expectRevert(
            abi.encodeWithSignature("IntentBook__CannotCancelNonOpenIntent()")
        );
        intentBook.cancelIntent(intentId);
        vm.stopPrank();
    }

    function testIntentExpiration() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken),
            500 * 10 ** 18,
            user1,
            FillStructure.Exactly,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 1
        );
        signedIntent.intent.ttl = block.timestamp - 1; // Intent already expired

        vm.expectRevert(abi.encodeWithSignature("IntentBook__IntentExpired()"));
        intentBook.publishIntent(signedIntent);

        vm.stopPrank();
    }

    function testInvalidIntentNonce() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        uint256 currentNonce = intentBook.getNonce(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);
        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken),
            500 * 10 ** 18,
            user1,
            FillStructure.Exactly,
            key,
            address(intentBook),
            currentNonce
        );

        vm.expectRevert(abi.encodeWithSignature("IntentBook__InvalidIntentNonce()"));
        intentBook.publishIntent(signedIntent);

        vm.stopPrank();
    }

    function testSpecificIntentHash() public {
        Intent memory intent = Intent({
            author: address(0x70997970C51812dc3A010C7d01b50e0d17dc79C8),
            ttl: 10000000000000000000,
            nonce: 0,
            srcMToken: address(0x94099942864EA81cCF197E9D71ac53310b1468D8),
            srcAmount: 100000000000000000000,
            outcome: Outcome({
                mTokens: new address[](1),
                mAmounts: new uint256[](1),
                outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
                fillStructure: FillStructure.PctFilled
            })
        });
        intent.outcome.mTokens[0] = address(
            0x06B1D212B8da92b83AF328De5eef4E211Da02097
        );
        intent.outcome.mAmounts[0] = 110000000000000000000;

        bytes32 intentHash = IntentLib.hashIntentWithEip712(
            intent,
            address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0)
        );
        console.logBytes32(intentHash);
        console.logBytes32(IntentLib.INTENT_TYPE_HASH);
        console.logBytes32(
            IntentLib.hashStructOfIntent(
                intent,
                address(0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0)
            )
        );
        console.logBytes(IntentLib.eip712AbiEncodedData(intent));
        console.logBytes(IntentLib.alternativeEncode(intent));
        console.logBytes32(IntentLib.hashOutcome(intent.outcome));
        console.logBytes32(IntentLib.hashOutcomeAlternate(intent.outcome));
        console.logBytes32(IntentLib.outcomeTypeHash());
        console.logBytes(IntentLib.encodedOutcome(intent.outcome));

        // Sign the intent with the author's private key
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d,
            intentHash
        );
        console.logBytes(abi.encodePacked(r, s, v));
    }

    function testCommitValidSolution() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
        vm.stopPrank();

        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        bytes32 intentId = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken),
                500 * 10 ** 18,
                address(mToken2),
                500 * 10 ** 18,
                user1,
                FillStructure.Exactly,
                key,
                address(intentBook),
                intentBook.getNonce(user1) + 1
            )
        );

        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Open),
            "State should be Open after publishing"
        );
        vm.stopPrank();

        vm.startPrank(user2);
        mToken2.approve(address(intentBook), 1000 * 10 ** 18);

        bytes32 intentId2 = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken2),
                500 * 10 ** 18,
                address(mToken),
                500 * 10 ** 18,
                user2,
                FillStructure.Exactly,
                key2,
                address(intentBook),
                intentBook.getNonce(user2) + 1
            )
        );

        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Open),
            "State should be Open after publishing"
        );
        vm.stopPrank();

        vm.startPrank(medusa);

        // Create a valid solution
        bytes32[] memory intentIds = new bytes32[](2);
        intentIds[0] = intentId;
        intentIds[1] = intentId2;

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: new Intent[](0),
            receiptOutputs: new ReceiptStruct[](0),
            spendGraph: new MoveRecord[](0),
            fillGraph: new FillRecord[](0)
        });

        solution = spendReceiptFromIntent(
            500 * 10 ** 18,
            user1,
            address(mToken2),
            1,
            solution
        );
        solution = spendReceiptFromIntent(
            500 * 10 ** 18,
            user2,
            address(mToken),
            0,
            solution
        );
        solution = fulfills(0, 0, OutType.Receipt, solution);
        solution = fulfills(1, 1, OutType.Receipt, solution);

        uint256 user1AskBalanceBefore = mToken2.balanceOf(user1);
        uint256 user2AskBalanceBefore = mToken.balanceOf(user2);

        intentBook.solve(solution);

        assertEq(
            mToken2.balanceOf(user1),
            user1AskBalanceBefore + 500 * 10 ** 18,
            "User 1 should have 500 mtoken2"
        );
        assertEq(
            mToken.balanceOf(user2),
            user2AskBalanceBefore + 500 * 10 ** 18,
            "User 2 should have 500 mtoken"
        );

        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Solved)
        );
        assertEq(
            uint256(intentBook.getIntentState(intentId2)),
            uint256(IntentState.Solved)
        );

        vm.stopPrank();
    }

    function testCommitPartialSolution() public {
        _setupPartialTest();
        (bytes32 intentId, bytes32 intentId2) = _publishPartialIntents();
        _executePartialSolution(intentId, intentId2);
    }

    function _setupPartialTest() internal {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
        vm.stopPrank();

        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);
        vm.stopPrank();

        vm.startPrank(user2);
        mToken2.approve(address(intentBook), 1000 * 10 ** 18);
        vm.stopPrank();
    }

    function _publishPartialIntents()
        internal
        returns (bytes32 intentId, bytes32 intentId2)
    {
        vm.startPrank(user1);
        intentId = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken),
                500 * 10 ** 18,
                address(mToken2),
                110 * 10 ** 18,
                user1,
                FillStructure.PctFilled,
                key,
                address(intentBook),
                intentBook.getNonce(user1) + 1
            )
        );
        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Open),
            "State should be Open after publishing"
        );
        vm.stopPrank();

        vm.startPrank(user2);
        assertEq(intentBook.getNonce(user2) + 1, 1);
        intentId2 = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken2),
                440 * 10 ** 18,
                address(mToken),
                400 * 10 ** 18,
                user2,
                FillStructure.Exactly,
                key2,
                address(intentBook),
                1
            )
        );
        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Open),
            "State should be Open after publishing"
        );
        vm.stopPrank();
    }

    function _executePartialSolution(
        bytes32 intentId,
        bytes32 intentId2
    ) internal {
        vm.startPrank(medusa);

        bytes32[] memory intentIds = new bytes32[](2);
        intentIds[0] = intentId;
        intentIds[1] = intentId2;

        Intent[] memory outputIntents = new Intent[](1);
        outputIntents[0] = createSimpleIntent(
            address(mToken),
            100 * 10 ** 18,
            address(mToken2),
            110 * 10 ** 18,
            user1,
            FillStructure.PctFilled,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 1
        ).intent;

        MoveRecord[] memory spendGraph = new MoveRecord[](1);
        spendGraph[0] = MoveRecord({
            outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}),
            srcIdx: 0,
            qty: 100 * 10 ** 18
        });

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: new ReceiptStruct[](0),
            spendGraph: spendGraph,
            fillGraph: new FillRecord[](0)
        });

        solution = spendReceiptFromIntent(
            400 * 10 ** 18,
            user2,
            address(mToken),
            0,
            solution
        );
        solution = spendReceiptFromIntent(
            440 * 10 ** 18,
            user1,
            address(mToken2),
            1,
            solution
        );
        solution = fulfills(0, 0, OutType.Intent, solution);
        solution = fulfills(0, 1, OutType.Receipt, solution);
        solution = fulfills(1, 0, OutType.Receipt, solution);

        assertEq(
            receiptManager.getReceiptsByOwner(user1).length,
            0,
            "User 1 should have 0 receipt"
        );
        assertEq(
            receiptManager.getReceiptsByOwner(user2).length,
            0,
            "User 2 should have 0 receipt"
        );

        uint256 user1OfferBalanceBefore = mToken.balanceOf(user1);
        uint256 user1AskBalanceBefore = mToken2.balanceOf(user1);
        uint256 user2OfferBalanceBefore = mToken2.balanceOf(user2);
        uint256 user2AskBalanceBefore = mToken.balanceOf(user2);

        // user1 should have 500 mtoken and 0 mtoken2
        // user2 should have 0 mtoken and (1000 - 440) = 560 mtoken2
        assertEq(
            user1OfferBalanceBefore,
            500 * 10 ** 18,
            "User 1 should have 500 mtoken"
        );
        assertEq(user1AskBalanceBefore, 0, "User 1 should have 0 mtoken2");
        assertEq(
            user2OfferBalanceBefore,
            560 * 10 ** 18,
            "User 2 should have 560 mtoken2"
        );
        assertEq(user2AskBalanceBefore, 0, "User 2 should have 0 mtoken");
        assertEq(
            mTokenManager.getIntentBalance(intentId),
            500 * 10 ** 18,
            "User 1 intent should have 500 mtoken"
        );
        assertEq(
            mTokenManager.getIntentBalance(intentId2),
            440 * 10 ** 18,
            "User 2 intent should have 560 mtoken2"
        );

        intentBook.solve(solution);

        // user1 should have 440 mtoken2 and 100 mtoken
        // user2 should have 400 mtoken and 0 mtoken2
        // Their offer balance should be the same since they didn't gain any mtoken
        assertEq(
            mToken.balanceOf(user1),
            user1OfferBalanceBefore,
            "User 1 should have 100 mtoken"
        );
        // Their ask balance should be higher since the only way their intent can be spent
        // is if they received mtoken2 from user2's intent
        assertEq(
            mToken2.balanceOf(user1),
            440 * 10 ** 18,
            "User 1 should have 440 mtoken2"
        );
        // User2's offer balance should be the same since they didnt spend any mtoken2 that wasn't
        // already in their intent
        assertEq(
            mToken2.balanceOf(user2),
            user2OfferBalanceBefore,
            "User 2 offer balance should be the same"
        );
        assertEq(
            mToken.balanceOf(user2),
            400 * 10 ** 18,
            "User 2 should have 400 mtoken"
        );

        vm.stopPrank();
    }

    function _validatePartialSolution(
        bytes32 intentId,
        bytes32 intentId2
    ) internal {
        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Solved)
        );
        assertEq(
            uint256(intentBook.getIntentState(intentId2)),
            uint256(IntentState.Solved)
        );

        assertEq(
            receiptManager.getReceiptsByOwner(user1).length,
            1,
            "User 1 should have 1 receipt"
        );
        assertEq(
            receiptManager.getReceiptsByOwner(user2).length,
            1,
            "User 2 should have 1 receipt"
        );

        bytes32 receiptId = receiptManager.getReceiptsByOwner(user1)[0];
        bytes32 receiptId2 = receiptManager.getReceiptsByOwner(user2)[0];

        assertEq(
            receiptManager.getReceipt(receiptId).mTokenAmount,
            440 * 10 ** 18,
            "Receipt amount should match"
        );
        assertEq(
            receiptManager.getReceipt(receiptId2).mTokenAmount,
            400 * 10 ** 18,
            "Receipt amount should match"
        );
    }

    function testUnauthorizedReceiptCreation() public {
        vm.startPrank(owner);
        vm.stopPrank();

        vm.startPrank(user1);
        vm.expectRevert(
            abi.encodeWithSignature("AccessManagedUnauthorized(address)", user1)
        );
        mTokenManager.transferMTokensToReceipt(
            bytes32(0),
            keccak256(
                abi.encode(
                    user1,
                    address(mToken),
                    500 * 10 ** 18,
                    block.timestamp
                )
            ),
            address(mToken),
            500 * 10 ** 18
        );
        vm.stopPrank();
    }

    function testVerifyIntentSignature() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(addr);
        vm.stopPrank();

        vm.startPrank(addr);
        // Create a simple intent
        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            50 * 10 ** 18,
            address(mToken),
            25 * 10 ** 18,
            addr,
            FillStructure.Exactly,
            key,
            address(intentBook),
            intentBook.getNonce(addr) + 1
        );

        // Generate the intent hash
        bytes32 intentHash = IntentLib.hashIntentWithEip712(
            signedIntent.intent,
            address(intentBook)
        );

        // Sign the intent hash with the author's private key
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, intentHash);
        require(
            ecrecover(intentHash, v, r, s) == addr,
            "Test error: Signer is invalid"
        );
        signedIntent.signature = abi.encodePacked(r, s, v);

        // Verify the signature using the verifyIntentSignature function
        assertTrue(
            SignatureLib.verifyIntentSignature(
                signedIntent,
                address(intentBook)
            ),
            "The signature should be valid"
        );

        // Test with an invalid signature (changed amount)
        signedIntent.intent.srcAmount = 200 * 10 ** 18;
        assertFalse(
            SignatureLib.verifyIntentSignature(
                signedIntent,
                address(intentBook)
            ),
            "The signature should be invalid"
        );
    }

    function testDepositToIntent() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);

        // Create the intent and sign it
        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken),
            500 * 10 ** 18,
            user1,
            FillStructure.Exactly,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 1
        );

        bytes32 intentHash = IntentLib.hashIntentWithEip712(
            signedIntent.intent,
            address(intentBook)
        );
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, intentHash);
        signedIntent.signature = abi.encodePacked(r, s, v);

        // Publish the intent, which will trigger depositToIntent
        bytes32 intentId = intentBook.publishIntent(signedIntent);

        // Verify that the MToken balance was deposited into the intent
        assertEq(
            mTokenManager.getIntentBalance(intentId),
            500 * 10 ** 18,
            "MToken balance should be locked in the intent"
        );

        vm.stopPrank();
    }

    function testIntentChainRootIsDescendantWhenHasNoParent() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        bytes32 intentId = intentBook.publishIntent(
            createSimpleIntent(
                address(mToken),
                500 * 10 ** 18,
                address(mToken2),
                500 * 10 ** 18,
                user1,
                FillStructure.Exactly,
                key,
                address(intentBook),
                intentBook.getNonce(user1) + 1
            )
        );

        assertEq(
            intentBook.getIntentChainRoot(intentId),
            intentId,
            "Intent chain root should be the intent itself"
        );
        vm.stopPrank();
    }

    function testCommitZeroPctFill() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        // LP intent willing to give mToken for mToken2, charging 10% fee. So, to get 500 mtoken, it would have to receive 550 mtoken2. To get
        // 400 mToken, it would have to receive 440 mToken2
        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken2),
            110 * 10 ** 18,
            user1,
            FillStructure.PctFilled,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 1
        );
        bytes32 intentId = intentBook.publishIntent(signedIntent);

        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Open),
            "State should be Open after publishing"
        );
        vm.stopPrank();

        vm.startPrank(medusa);

        // Create a solution that maps the user's intent onto a new one which is identical
        // This is equivalent to a "zero percent fill".
        bytes32[] memory intentIds = new bytes32[](1);
        intentIds[0] = intentId;

        Intent[] memory outputIntents = new Intent[](1);
        outputIntents[0] = signedIntent.intent;

        MoveRecord[] memory spendGraph = new MoveRecord[](1);
        spendGraph[0] = MoveRecord({
            outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}),
            srcIdx: 0,
            qty: 500 * 10 ** 18
        });

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: new ReceiptStruct[](0),
            spendGraph: spendGraph,
            fillGraph: new FillRecord[](0)
        });
        solution = fulfills(0, 0, OutType.Intent, solution);

        vm.expectRevert(
            abi.encodeWithSignature(
                "IntentBook__SpendingPartiallyFillableIntentMustMakeProgress()"
            )
        );
        intentBook.solve(solution);
        vm.stopPrank();

        // The intent chain root call should not cause infinite loop
        intentBook.getIntentChainRoot(intentId);
    }

    function testRevertsWhenIntentPartiallySpentChangesTtl() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        // LP intent willing to give mToken for mToken2, charging 10% fee. So, to get 500 mtoken, it would have to receive 550 mtoken2. To get
        // 400 mToken, it would have to receive 440 mToken2
        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken2),
            110 * 10 ** 18,
            user1,
            FillStructure.PctFilled,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 1
        );

        bytes32 intentId = intentBook.publishIntent(signedIntent);
        assertEq(
            uint256(intentBook.getIntentState(intentId)),
            uint256(IntentState.Open),
            "State should be Open after publishing"
        );

        vm.startPrank(medusa);

        // Create a solution that maps the user's intent onto a new one which is identical
        // This is equivalent to a "zero percent fill".
        bytes32[] memory intentIds = new bytes32[](1);
        intentIds[0] = intentId;

        Intent[] memory outputIntents = new Intent[](1);
        signedIntent.intent.ttl += 1 hours;
        outputIntents[0] = signedIntent.intent;

        MoveRecord[] memory spendGraph = new MoveRecord[](1);
        spendGraph[0] = MoveRecord({
            outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}),
            srcIdx: 0,
            qty: 500 * 10 ** 18
        });

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: new ReceiptStruct[](0),
            spendGraph: spendGraph,
            fillGraph: new FillRecord[](0)
        });
        solution = fulfills(0, 0, OutType.Intent, solution);

        vm.expectRevert(
            abi.encodeWithSignature(
                "IntentBook__IntentVersionsCannotChangeTtlWhenSpent()"
            )
        );
        intentBook.solve(solution);
        vm.stopPrank();

        // The intent chain root call should not cause infinite loop
        intentBook.getIntentChainRoot(intentId);
    }
}
