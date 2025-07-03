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
import {IntentBookTest} from "./IntentBook.t.sol";
import {console} from "forge-std/console.sol";
import {Receipt as ReceiptStruct} from "../src/types/Receipt.sol";
import {SystemState, MockERC20} from "./SystemState.sol";

contract SolutionsTest is SystemState {
    function testMultiSolutionWithPartialSolution() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
        vm.stopPrank();

        vm.startPrank(user1);

        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        // LP intent willing to give mToken for mToken2, charging 10% fee. So, to get 100 mtoken, it would have to receive 110 mtoken2.
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

        vm.stopPrank();

        vm.startPrank(user2);
        mToken2.approve(address(intentBook), 1000 * 10 ** 18);

        SignedIntent memory signedIntent2 = createSimpleIntent(
            address(mToken2),
            110 * 10 ** 18,
            address(mToken),
            100 * 10 ** 18,
            user2,
            FillStructure.Exactly,
            key2,
            address(intentBook),
            1
        );
        vm.stopPrank();
        vm.startPrank(medusa);
        bytes32 intentId = intentBook.publishIntent(signedIntent);

        bytes32 intentId2 = intentBook.publishIntent(signedIntent2);

        IntentState stateAfterPost2 = intentBook.getIntentState(intentId);
        assertEq(uint256(stateAfterPost2), uint256(IntentState.Open), "State should be Open after publishing");

        // Create a valid solution
        // Since intent 1 is an LPer and sicne intent2 is an order, we have the following spends:
        // Intent1 --spent-by--> OutIntent1 (for 400 leftover mtoken to intent1.author)
        // Intent1 --spent-by--> OutReceipt1 (for 100 mtoken to intent2.author)
        // Intent2 --spent-by--> OutReceipt2 (for 110 mtoken2 to intent1.author)
        bytes32[] memory intentIds = new bytes32[](2);
        intentIds[0] = intentId;
        intentIds[1] = intentId2;

        Intent[] memory outputIntents = new Intent[](1);
        outputIntents[0] = createSimpleIntent(
            address(mToken),
            400 * 10 ** 18,
            address(mToken2),
            110 * 10 ** 18,
            user1,
            FillStructure.PctFilled,
            key,
            address(intentBook),
            0
        ).intent;

        ReceiptStruct[] memory receipts = new ReceiptStruct[](2);
        receipts[0] =
            ReceiptStruct({mToken: address(mToken), mTokenAmount: 100 * 10 ** 18, owner: user2, intentHash: intentId});
        receipts[1] =
            ReceiptStruct({mToken: address(mToken2), mTokenAmount: 110 * 10 ** 18, owner: user1, intentHash: intentId2});

        MoveRecord[] memory spendGraph = new MoveRecord[](3);
        spendGraph[0] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}), srcIdx: 0, qty: 400 * 10 ** 18});
        spendGraph[1] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 0}), srcIdx: 0, qty: 100 * 10 ** 18});
        spendGraph[2] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 1}), srcIdx: 1, qty: 110 * 10 ** 18});

        FillRecord[] memory fillGraph = new FillRecord[](3);
        fillGraph[0] = FillRecord({inIdx: 0, outIdx: 0, outType: OutType.Intent});
        fillGraph[1] = FillRecord({inIdx: 0, outIdx: 1, outType: OutType.Receipt});
        fillGraph[2] = FillRecord({inIdx: 1, outIdx: 0, outType: OutType.Receipt});

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: receipts,
            spendGraph: spendGraph,
            fillGraph: fillGraph
        });
        // solution = spendReceiptFromIntent(100 * 10 ** 18, user2, address(mToken), 0, solution);
        // solution = spendReceiptFromIntent(110 * 10 ** 18, user1, address(mToken2), 1, solution);
        // solution = fulfills(0, 0, OutType.Intent, solution);
        // solution = fulfills(0, 1, OutType.Receipt, solution);
        // solution = fulfills(1, 0, OutType.Receipt, solution);

        intentBook.solve(solution);

        IntentState state = intentBook.getIntentState(intentId);
        IntentState state2 = intentBook.getIntentState(intentId2);
        assertEq(uint256(state), uint256(IntentState.Solved));
        assertEq(uint256(state2), uint256(IntentState.Solved));

        // Test the balances of the users.
        assertEq(mToken.balanceOf(user1), 500 * 10 ** 18, "User 1 should have 500 mToken");
        assertEq(mToken.balanceOf(user2), 100 * 10 ** 18, "User 2 should have 100 mToken");
        assertEq(mToken2.balanceOf(user1), 110 * 10 ** 18, "User 1 should have 110 mToken2");
        assertEq(mToken2.balanceOf(user2), 890 * 10 ** 18, "User 2 should have 890 mToken2");

        vm.stopPrank();

        /* 
        
            Solution 2:

                Input Intents: [
                    LPER Intent: owned by user1, contains mToken, amount 400
                        
                    Order intent: owned by user2, contains mToken2, amount 110
                ]
                Output Intents: [
                    LPER Intent: owned by user1, contains mToken, amount 300

                ]
                Output receipts: [
                    Lper-to-orderer receipt: owned by user2, contains mToken, amount 100
                    Order-to-lper receipt: owned by user1, contains mToken2, amount 110
                ]

                spendGraph: [
                    Input(0) --SpentBy--> Output(0, intent) 300 mToken
                    Input(0) --SpentBy--> Output(0, receipt) 100 mToken
                    Input(1) --SpentBy--> Output(1, receipt) 110 mToken2
                ]
        */

        bytes32[] memory lperIntents = intentBook.getIntentIdsByAuthor(user1);
        assertEq(lperIntents.length, 2, "User 1 should have 1 LPer intent");
        console.logBytes32(lperIntents[0]);
        console.logBytes32(lperIntents[1]);
        Intent memory lperLatestIntent = intentBook.getIntent(lperIntents[1]);
        assertEq(lperLatestIntent.srcAmount, 400 * 10 ** 18, "LPer intent amount should match");
        assertEq(lperLatestIntent.srcMToken, address(mToken), "LPer intent token should match");
        bytes32 ancestorIntentId = intentBook.getIntentChainRoot(lperIntents[1]);
        console.logBytes32(ancestorIntentId);
        assertEq(
            mTokenManager.getIntentBalance(lperIntents[1]),
            400 * 10 ** 18,
            "Child intent balance should have latest balance"
        );
        //assertEq(mTokenManager.getIntentBalance(lperIntents[1]), 400 * 10 ** 18, "LPer intent balance should match");
        vm.startPrank(user1);
        SignedIntent memory signedIntent3 = createSimpleIntent(
            address(mToken2),
            110 * 10 ** 18,
            address(mToken),
            100 * 10 ** 18,
            user2,
            FillStructure.Exactly,
            key2,
            address(intentBook),
            3
        );
        vm.stopPrank();
        vm.startPrank(medusa);
        bytes32 intentId3 = intentBook.publishIntent(signedIntent3);

        Intent[] memory outputIntents2 = new Intent[](1);
        outputIntents2[0] = createSimpleIntent(
            address(mToken),
            300 * 10 ** 18,
            address(mToken2),
            110 * 10 ** 18,
            user1,
            FillStructure.PctFilled,
            key,
            address(intentBook),
            2
        ).intent;

        bytes32[] memory intentIds2 = new bytes32[](2);
        intentIds2[0] = lperIntents[1];
        intentIds2[1] = intentId3;

        ReceiptStruct[] memory receipts2 = new ReceiptStruct[](2);
        receipts2[0] = ReceiptStruct({
            mToken: address(mToken),
            mTokenAmount: 100 * 10 ** 18,
            owner: user2,
            intentHash: lperIntents[1]
        });
        receipts2[1] =
            ReceiptStruct({mToken: address(mToken2), mTokenAmount: 110 * 10 ** 18, owner: user1, intentHash: intentId3});

        MoveRecord[] memory spendGraph2 = new MoveRecord[](3);
        spendGraph2[0] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}), srcIdx: 0, qty: 300 * 10 ** 18});
        spendGraph2[1] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 0}), srcIdx: 0, qty: 100 * 10 ** 18});
        spendGraph2[2] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 1}), srcIdx: 1, qty: 110 * 10 ** 18});

        FillRecord[] memory fillGraph2 = new FillRecord[](3);
        fillGraph2[0] = FillRecord({inIdx: 0, outIdx: 0, outType: OutType.Intent});
        fillGraph2[1] = FillRecord({inIdx: 0, outIdx: 1, outType: OutType.Receipt});
        fillGraph2[2] = FillRecord({inIdx: 1, outIdx: 0, outType: OutType.Receipt});

        Solution memory solution2 = Solution({
            intentIds: intentIds2,
            intentOutputs: outputIntents2,
            receiptOutputs: receipts2,
            spendGraph: spendGraph2,
            fillGraph: fillGraph2
        });

        uint256 user1BeforeNonce = intentBook.getNonce(user1);
        intentBook.solve(solution2);
        uint256 user1AfterNonce = intentBook.getNonce(user1);
        assertEq(user1AfterNonce, user1BeforeNonce + 1, "User 1 nonce should have incremented");
        vm.stopPrank();
    }

    function test_FailsWhenFillGraphIsEmpty() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
        vm.stopPrank();

        vm.startPrank(user1);

        mToken.approve(address(intentBook), 1000 * 10 ** 18);
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
        IntentState state = intentBook.getIntentState(intentId);
        assertEq(uint256(state), uint256(IntentState.Open), "State should be Open after publishing");
        vm.stopPrank();

        // vm.startPrank(user2);
        // mToken2.approve(address(intentBook), 1000 * 10 ** 18);

        // SignedIntent memory signedIntent2 = createSimpleIntent(
        //     address(mToken2),
        //     550 * 10 ** 18,
        //     address(mToken),
        //     500 * 10 ** 18,
        //     user2,
        //     FillStructure.Exactly,
        //     key2,
        //     address(intentBook),
        //     intentBook.getNonce(user2) + 1
        // );

        // bytes32 intentId2 = intentBook.publishIntent(signedIntent2);
        // vm.stopPrank();

        vm.startPrank(medusa);
        bytes32[] memory intentIds = new bytes32[](1);
        intentIds[0] = intentId;
        // intentIds[1] = intentId2;

        Intent[] memory outputIntents = new Intent[](0);
        // outputIntents[0] = createSimpleIntent(
        //     address(mToken),
        //     400 * 10 ** 18,
        //     address(mToken2),
        //     110 * 10 ** 18,
        //     user1,
        //     FillStructure.PctFilled,
        //     key,
        //     address(intentBook),
        //     0
        // )
        ReceiptStruct[] memory receipts = new ReceiptStruct[](1);
        receipts[0] =
            ReceiptStruct({mToken: address(mToken), mTokenAmount: 500 * 10 ** 18, owner: user2, intentHash: intentId});

        MoveRecord[] memory spendGraph = new MoveRecord[](1);
        spendGraph[0] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 0}), srcIdx: 0, qty: 500 * 10 ** 18});
        FillRecord[] memory fillGraph = new FillRecord[](0);

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: receipts,
            spendGraph: spendGraph,
            fillGraph: fillGraph
        });
        vm.expectRevert();
        intentBook.solve(solution);
        vm.stopPrank();
    }

    function test_FailsWhenFillGraphIsIncomplete() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
        vm.stopPrank();

        vm.startPrank(user1);

        mToken.approve(address(intentBook), 1000 * 10 ** 18);
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
        IntentState state = intentBook.getIntentState(intentId);
        assertEq(uint256(state), uint256(IntentState.Open), "State should be Open after publishing");
        vm.stopPrank();

        vm.startPrank(user2);
        mToken2.approve(address(intentBook), 1000 * 10 ** 18);

        SignedIntent memory signedIntent2 = createSimpleIntent(
            address(mToken2),
            220 * 10 ** 18,
            address(mToken),
            200 * 10 ** 18,
            user2,
            FillStructure.Exactly,
            key2,
            address(intentBook),
            intentBook.getNonce(user2) + 1
        );

        bytes32 intentId2 = intentBook.publishIntent(signedIntent2);
        vm.stopPrank();

        vm.startPrank(medusa);
        bytes32[] memory intentIds = new bytes32[](1);
        intentIds[0] = intentId;
        // intentIds[1] = intentId2;

        Intent[] memory outputIntents = new Intent[](0);
        // outputIntents[0] = createSimpleIntent(
        //     address(mToken),
        //     400 * 10 ** 18,
        //     address(mToken2),
        //     110 * 10 ** 18,
        //     user1,
        //     FillStructure.PctFilled,
        //     key,
        //     address(intentBook),
        //     0
        // )
        ReceiptStruct[] memory receipts = new ReceiptStruct[](1);
        receipts[0] =
            ReceiptStruct({mToken: address(mToken), mTokenAmount: 200 * 10 ** 18, owner: user2, intentHash: intentId});

        MoveRecord[] memory spendGraph = new MoveRecord[](1);
        spendGraph[0] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 0}), srcIdx: 0, qty: 500 * 10 ** 18});
        FillRecord[] memory fillGraph = new FillRecord[](1);
        fillGraph[0] = FillRecord({inIdx: 0, outIdx: 0, outType: OutType.Receipt});

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: receipts,
            spendGraph: spendGraph,
            fillGraph: fillGraph
        });
        vm.expectRevert();
        intentBook.solve(solution);
        vm.stopPrank();
    }

    // function test_FailsWhenOutputTokenSupplyFromLPIntentMintsNewTokens() public {
    //     vm.startPrank(owner);
    //     intentBook.addPublisher(user1);
    //     intentBook.addPublisher(user2);
    //     vm.stopPrank();

    //     vm.startPrank(user1);

    //     mToken.approve(address(intentBook), 10000 * 10 ** 18);

    //     SignedIntent memory signedIntent = createSimpleIntent(
    //         address(mToken),
    //         1000 * 10 ** 18,
    //         address(mToken2),
    //         100 * 10 ** 18,
    //         user1,
    //         FillStructure.PctFilled,
    //         key,
    //         address(intentBook),
    //         intentBook.getNonce(user1) + 1
    //     );
    //     bytes32 intentId = intentBook.publishIntent(signedIntent);

    //     vm.stopPrank();

    //     vm.startPrank(user2);
    //     mToken2.approve(address(intentBook), 1000 * 10 ** 18);

    //     SignedIntent memory signedIntent2 = createSimpleIntent(
    //         address(mToken2),
    //         100 * 10 ** 18,
    //         address(mToken),
    //         100 * 10 ** 18,
    //         user2,
    //         FillStructure.PctFilled,
    //         key2,
    //         address(intentBook),
    //         intentBook.getNonce(user2) + 1
    //     );

    //     bytes32 intentId2 = intentBook.publishIntent(signedIntent2);

    //     IntentState stateAfterPost2 = intentBook.getIntentState(intentId2);
    //     assertEq(uint256(stateAfterPost2), uint256(IntentState.Open), "State should be Open after publishing");

    //     vm.stopPrank();

    //     vm.startPrank(owner);

    //     bytes32[] memory intentIds = new bytes32[](2);
    //     intentIds[0] = intentId;
    //     intentIds[1] = intentId2;

    //     Intent[] memory outputIntents = new Intent[](1);
    //     outputIntents[0] = createSimpleIntent(
    //         address(mToken),
    //         900 * 10 ** 18,
    //         address(mToken2),
    //         100 * 10 ** 18,
    //         user1,
    //         FillStructure.PctFilled,
    //         key,
    //         address(intentBook),
    //         intentBook.getNonce(user1) + 1
    //     ).intent;

    //     ReceiptStruct[] memory receipts = new ReceiptStruct[](2);
    //     receipts[0] =
    //         ReceiptStruct({mToken: address(mToken), mTokenAmount: 500 * 10 ** 18, owner: user2, intentHash: intentId});
    //     receipts[1] =
    //         ReceiptStruct({mToken: address(mToken2), mTokenAmount: 100 * 10 ** 18, owner: user1, intentHash: intentId2});

    //     MoveRecord[] memory spendGraph = new MoveRecord[](3);
    //     spendGraph[0] =
    //         MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 0}), srcIdx: 0, qty: 100 * 10 ** 18});
    //     spendGraph[1] =
    //         MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 1}), srcIdx: 1, qty: 100 * 10 ** 18});
    //     spendGraph[2] =
    //         MoveRecord({outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}), srcIdx: 0, qty: 900 * 10 ** 18});

    //     FillRecord[] memory fillGraph = new FillRecord[](3);
    //     fillGraph[0] = FillRecord({inIdx: 0, outIdx: 0, outType: OutType.Intent});
    //     fillGraph[1] = FillRecord({inIdx: 0, outIdx: 1, outType: OutType.Receipt});
    //     fillGraph[2] = FillRecord({inIdx: 1, outIdx: 0, outType: OutType.Receipt});

    //     Solution memory solution = Solution({
    //         intentIds: intentIds,
    //         intentOutputs: outputIntents,
    //         receiptOutputs: receipts,
    //         spendGraph: spendGraph,
    //         fillGraph: fillGraph
    //     });
    //     // solution = spendReceiptFromIntent(100 * 10 ** 18, user2, address(mToken), 0, solution);
    //     // solution = spendReceiptFromIntent(110 * 10 ** 18, user1, address(mToken2), 1, solution);
    //     // solution = fulfills(0, 0, OutType.Intent, solution);
    //     // solution = fulfills(0, 1, OutType.Receipt, solution);
    //     // solution = fulfills(1, 0, OutType.Receipt, solution);

    //     intentBook.solve(solution);
    // }

    function test_8() public {
        vm.startPrank(contractsManager);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
        vm.stopPrank();

        // User1 posts a PctFilled intent
        vm.startPrank(user1);
        mToken.approve(address(intentBook), 1000 * 10 ** 18);
        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            1000 * 10 ** 18,
            address(mToken2),
            100 * 10 ** 18,
            user1,
            FillStructure.PctFilled,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 1
        );
        bytes32 intentId = intentBook.publishIntent(signedIntent);
        vm.stopPrank();

        vm.startPrank(user2);
        mToken2.approve(address(intentBook), 1000 * 10 ** 18);
        SignedIntent memory signedIntent2 = createSimpleIntent(
            address(mToken2),
            100 * 10 ** 18,
            address(mToken),
            100 * 10 ** 18,
            user2,
            FillStructure.PctFilled,
            key2,
            address(intentBook),
            intentBook.getNonce(user2) + 1
        );
        bytes32 intentId2 = intentBook.publishIntent(signedIntent2);
        vm.stopPrank();

        // Create solution with empty fillGraph
        vm.startPrank(medusa);
        bytes32[] memory intentIds = new bytes32[](2);
        intentIds[0] = intentId;
        intentIds[1] = intentId2;
        Intent[] memory outputIntents = new Intent[](1);
        outputIntents[0] = createSimpleIntent(
            address(mToken),
            900 * 10 ** 18,
            address(mToken2),
            100 * 10 ** 18,
            user1,
            FillStructure.PctFilled,
            key,
            address(intentBook),
            intentBook.getNonce(user1) + 2
        ).intent;

        ReceiptStruct[] memory receipts = new ReceiptStruct[](2);
        receipts[0] = ReceiptStruct({
            mToken: address(mToken),
            mTokenAmount: 500 * 10 ** 18,
            owner: user2, // Receipt to unrelated user
            intentHash: intentId // @audit not used bytes32 intentHash;
        });
        receipts[1] = ReceiptStruct({
            mToken: address(mToken2),
            mTokenAmount: 100 * 10 ** 18,
            owner: user1, // Receipt to unrelated user
            intentHash: intentId // @audit not used bytes32 intentHash;
        });

        MoveRecord[] memory spendGraph = new MoveRecord[](3);
        spendGraph[0] = MoveRecord({
            srcIdx: 0, // index in intentIds specifying which Intent is providing tokens.
            outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 0}), // indicates which output (an entry in intentOutputs or receiptOutputs) is receiving them.
            qty: 100 * 10 ** 18
        });
        spendGraph[1] = MoveRecord({
            srcIdx: 1, // index in intentIds specifying which Intent is providing tokens.
            outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 1}), // indicates which output (an entry in intentOutputs or receiptOutputs) is receiving them.
            qty: 100 * 10 ** 18
        });
        spendGraph[2] = MoveRecord({
            srcIdx: 0, // index in intentIds specifying which Intent is providing tokens.
            outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}), // indicates which output (an entry in intentOutputs or receiptOutputs) is receiving them.
            qty: 900 * 10 ** 18
        });

        /*
            struct FillRecord {
                uint64 inIdx;
                uint64 outIdx;
                OutType outType;
            }
            •	inIdx: index in intentIds specifying which Intent’s demand is being satisfied.
            •	outIdx: index in either intentOutputs or receiptOutputs, depending on outType.
            •	outType: whether the output is a leftover child Intent or a Receipt.
        */
        FillRecord[] memory fillGraph = new FillRecord[](3); // Non-Empty fillGraph
        fillGraph[0] = FillRecord({
            inIdx: uint64(0), // index in intentIds specifying which Intent is providing tokens.
            outIdx: uint64(0), // indicates which output (an entry in intentOutputs or receiptOutputs) is receiving them.
            outType: OutType.Intent
        });
        fillGraph[1] = FillRecord({
            inIdx: uint64(1), // index in intentIds specifying which Intent’s demand is being satisfied.
            outIdx: uint64(0), // index in either intentOutputs or receiptOutputs, depending on outType.
            outType: OutType.Receipt
        });
        fillGraph[2] = FillRecord({
            inIdx: uint64(0), // index in intentIds specifying which Intent’s demand is being satisfied.
            outIdx: uint64(1), // index in either intentOutputs or receiptOutputs, depending on outType.
            outType: OutType.Receipt
        });
        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: receipts,
            spendGraph: spendGraph,
            fillGraph: fillGraph
        });

        console.log("Call -> solve()");
        vm.expectRevert();
        intentBook.solve(solution);

        vm.stopPrank();
    }
}
