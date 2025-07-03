import "forge-std/Test.sol";
import "../src/hub/IntentBook.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/types/Intent.sol";
import "../src/types/Events.sol";
import "../src/types/Solution.sol";
import "../src/types/Receipt.sol";
import "../src/hub/MTokenManager.sol";
import "../src/hub/MToken.sol";
import "../src/common/AIPEventPublisher.sol";
import "../src/common/AIPEventHandler.sol";
import "../src/common/EventProver.sol";
import "../src/common/EventVerifier.sol";
import "../src/hub/ReceiptManager.sol";
import "../src/modules/MTokenRegistry.sol";
import "../src/modules/AuthorizationManager.sol";
import {Utilities} from "./Utilities.sol";
import {IntentBookTest} from "./IntentBook.t.sol";
import {console} from "forge-std/console.sol";
import {Receipt as ReceiptStruct} from "../src/types/Receipt.sol";
import {SystemState, MockERC20} from "./SystemState.sol";

contract SolutionsTest is SystemState {
    function testMultiSolutionWithPartialSolution() public {
        vm.startPrank(owner);
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
        bytes32 intentId = intentBook.publishIntent(signedIntent);

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

        bytes32 intentId2 = intentBook.publishIntent(signedIntent2);

        IntentState stateAfterPost2 = intentBook.getIntentState(intentId);
        assertEq(uint256(stateAfterPost2), uint256(IntentState.Open), "State should be Open after publishing");

        vm.stopPrank();

        vm.startPrank(owner);

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

        bytes32[] memory allReceiptIdsUser1 = receiptManager.getReceiptsByOwner(user1);
        assertEq(allReceiptIdsUser1.length, 1, "User 1 should have 1 receipt");
        bytes32[] memory allReceiptIdsUser2 = receiptManager.getReceiptsByOwner(user2);
        assertEq(allReceiptIdsUser2.length, 1, "User 2 should have 1 receipt");
        //Validate the receipt was created and MTokens were transferred
        bytes32 receiptId = receiptManager.getReceiptsByOwner(user1)[0];
        bytes32 receiptId2 = receiptManager.getReceiptsByOwner(user2)[0];
        ReceiptStruct memory receipt = receiptManager.getReceipt(receiptId);
        ReceiptStruct memory receipt2 = receiptManager.getReceipt(receiptId2);

        assertEq(receipt.mTokenAmount, 110 * 10 ** 18, "Receipt amount should match");
        assertEq(receipt2.mTokenAmount, 100 * 10 ** 18, "Receipt amount should match");

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
            mTokenManager.getIntentBalance(ancestorIntentId), 400 * 10 ** 18, "Ancestor intent balance should match"
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

        bytes32 intentId3 = intentBook.publishIntent(signedIntent3);
        vm.stopPrank();

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
        vm.startPrank(owner);
        intentBook.solve(solution2);
        vm.stopPrank();
    }
}
