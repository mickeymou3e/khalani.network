// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

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
import {AbstractAIPEventHandler} from "../src/common/AbstractAIPEventHandler.sol";
import {MockSpokeChainAIPEventHandler} from "./MockSpokeChainAIPEventHandler.sol";
import {MockArcadiaAIPEventHandler} from "./MockArcadiaAIPEventHandler.sol";
import {Receipt as ReceiptStruct} from "../src/hub/ReceiptManager.sol";
import {console} from "forge-std/console.sol";
import {InterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/hooks/igp/InterchainGasPaymaster.sol";
import {GasPriceOracle} from "../src/common/GasPriceOracle.sol";
import {SignatureLib} from "../src/libraries/SignatureLib.sol";

contract MockERC20 is ERC20 {
    uint8 private _decimals;

    constructor(string memory name, string memory symbol, uint8 decimals_) ERC20(name, symbol) {
        _decimals = decimals_;
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }

    function decimals() public view override returns (uint8) {
        return _decimals;
    }
}

contract IntentBookTest is Test, Utilities {
    IntentBook intentBook;
    MToken mToken;
    MockERC20 spokeToken;
    MToken mToken2;
    MockERC20 spokeToken2;
    AIPEventPublisher arcadiaEventPublisher;
    MockArcadiaAIPEventHandler arcadiaEventHandler;
    MTokenManager mTokenManager;
    ReceiptManager receiptManager;
    EventProver arcadiaEventProver; // arcadia == arcadia chain == destinationChain
    EventVerifier spokeEventVerifier; // spoke == spoke chain == originChain
    EventProver spokeEventProver;
    EventVerifier arcadiaEventVerifier;
    MockSpokeChainAIPEventHandler spokeEventHandler;
    AIPEventPublisher spokeEventPublisher;
    AssetReserves spokeAssetReserves;
    MTokenRegistry mTokenRegistry;
    AuthorizationManager authorizationManager;
    IInterchainGasPaymaster interchainGasPaymaster;
    IGasPriceOracle gasPriceOracle;

    address owner = address(0x1);
    address user1 = address(0x2);
    address user2 = address(0x3);
    address public addr;
    uint256 public key;
    address public addr2;
    uint256 public key2;
    address mTokenAddress;

    function setUp() public override {
        super.setUp();
        vm.startPrank(owner);
        interchainGasPaymaster = new InterchainGasPaymaster();
        gasPriceOracle = new GasPriceOracle();
        // Event Verifier on Arcadia chain (destinationChain)
        arcadiaEventVerifier = new EventVerifier(address(destinationMailbox));
        // Event Verifier on Spoke chain (originChain)
        spokeEventVerifier = new EventVerifier(address(originMailbox));
        // Event Prover on Arcadia chain (destinationChain)
        arcadiaEventProver = new EventProver(
            address(destinationMailbox), address(spokeEventVerifier), originChainId, address(interchainGasPaymaster)
        );
        // Event Prover on Spoke chain (originChain)
        spokeEventProver = new EventProver(
            address(originMailbox), address(arcadiaEventVerifier), destinationChainId, address(interchainGasPaymaster)
        );

        arcadiaEventHandler =
            new MockArcadiaAIPEventHandler(address(destinationMailbox), address(spokeEventVerifier), owner);
        spokeEventHandler =
            new MockSpokeChainAIPEventHandler(address(originMailbox), address(arcadiaEventVerifier), owner);

        arcadiaEventPublisher = new AIPEventPublisher(address(arcadiaEventProver));
        spokeEventPublisher = new AIPEventPublisher(address(spokeEventProver));
        authorizationManager = new AuthorizationManager();

        mTokenManager = new MTokenManager(address(authorizationManager), address(arcadiaEventPublisher));
        mTokenRegistry = new MTokenRegistry(address(mTokenManager));
        mTokenManager.setTokenRegistry(address(mTokenRegistry));

        intentBook = new IntentBook(address(arcadiaEventPublisher));
        receiptManager = new ReceiptManager(address(intentBook), address(mTokenManager));
        intentBook.setReceiptManager(address(receiptManager));
        intentBook.setTokenManager(address(mTokenManager));
        mTokenManager.setIntentBook(address(intentBook));
        mTokenManager.setReceiptManager(address(receiptManager));
        spokeToken = new MockERC20("SpokeToken", "STK", 18);
        spokeToken2 = new MockERC20("SpokeToken2", "STK2", 18);

        mTokenAddress = mTokenRegistry.createMToken("MockToken", "MTK", address(spokeToken), originChainId);
        mToken = MToken(mTokenAddress);
        mToken2 = MToken(mTokenRegistry.createMToken("MockToken2", "MTK2", address(spokeToken2), originChainId));

        spokeToken.mint(user1, 1000 * 10 ** 18);
        spokeToken.mint(user2, 1000 * 10 ** 18);

        (addr, key) = makeAddrAndKey("1337");
        user1 = addr;
        (addr2, key2) = makeAddrAndKey("1338");
        user2 = addr2;
        authorizationManager.addAuthorizedMinter(user1);
        authorizationManager.addAuthorizedMinter(user2);
        authorizationManager.addAuthorizedMinter(address(receiptManager));
        authorizationManager.addAuthorizedMinter(address(intentBook));
        authorizationManager.addAuthorizedMinter(address(mTokenManager));

        vm.stopPrank();

        vm.startPrank(user1);
        mTokenManager.mintMToken(user1, mTokenAddress, 1000 * 10 ** 18);

        uint256 userBalance = mToken.balanceOf(user1);
        assertEq(userBalance, 1000 * 10 ** 18, "User1 balance should be 1000 MTokens");
        vm.stopPrank();
        vm.startPrank(user2);
        mTokenManager.mintMToken(user2, address(mToken2), 1000 * 10 ** 18);

        uint256 userBalance2 = mToken2.balanceOf(user2);
        assertEq(userBalance2, 1000 * 10 ** 18, "User2 balance should be 1000 MTokens");
        vm.stopPrank();
    }

    function testPostIntent() public {
        vm.startPrank(owner);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);

        address[] memory mTokens = new address[](1);
        mTokens[0] = address(mToken);

        uint256[] memory mAmts = new uint256[](1);
        mAmts[0] = 500 * 10 ** 18;
        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken),
            500 * 10 ** 18,
            user1,
            FillStructure.Exactly,
            key,
            address(intentBook),
            intentBook.getNonce()
        );
        bytes32 intentId = intentBook.publishIntent(signedIntent);

        // Retrieve the intent and validate
        Intent memory retrievedIntent = intentBook.getIntent(intentId);
        assertEq(retrievedIntent.author, user1);
        assertEq(retrievedIntent.ttl, block.timestamp + 1 hours);
        assertEq(retrievedIntent.nonce, 0);

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
            intentBook.getNonce()
        );

        vm.expectRevert(abi.encodeWithSignature("IntentBook__UnauthorizedIntentPublisher()"));
        intentBook.publishIntent(signedIntent);

        vm.stopPrank();
    }

    function testLockIntent() public {
        vm.startPrank(owner);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);

        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        address[] memory mTokens = new address[](1);
        mTokens[0] = address(mToken);

        uint256[] memory mAmts = new uint256[](1);
        mAmts[0] = 500 * 10 ** 18;

        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken),
            500 * 10 ** 18,
            user1,
            FillStructure.Exactly,
            key,
            address(intentBook),
            intentBook.getNonce()
        );

        bytes32 intentId = intentBook.publishIntent(signedIntent);
        IntentState stateAfterPost = intentBook.getIntentState(intentId);
        assertEq(uint256(stateAfterPost), uint256(IntentState.Open), "State should be Open after posting");
        vm.stopPrank();

        // Lock the intent
        vm.startPrank(owner);
        intentBook.lockIntent(intentId);

        // Verify that the intent is locked
        IntentState state = intentBook.getIntentState(intentId);
        assertEq(uint256(state), uint256(IntentState.Locked));

        vm.stopPrank();
    }

    function testCancelIntent() public {
        vm.startPrank(owner);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);

        // Post a valid intent
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
            intentBook.getNonce()
        );
        bytes32 intentId = intentBook.publishIntent(signedIntent);
        vm.stopPrank();

        // Cancel the intent by an unauthorized user
        vm.startPrank(user2);
        vm.expectRevert(abi.encodeWithSignature("IntentBook__UnauthorizedCancellationAttempt()"));
        intentBook.cancelIntent(intentId);
        vm.stopPrank();

        // Cancel the intent by the author
        vm.startPrank(user1);
        intentBook.cancelIntent(intentId);
        IntentState stateAfterCancel = intentBook.getIntentState(intentId);
        assertEq(
            uint256(stateAfterCancel), uint256(IntentState.Cancelled), "State should be Cancelled after cancellation"
        );
        vm.stopPrank();
    }

    function testAddAndRemoveSolver() public {
        vm.startPrank(owner);

        // Add a new solver
        address newSolver = address(0x4);
        intentBook.addSolver(newSolver);
        bool isSolver = intentBook.isSolver(newSolver);
        assertTrue(isSolver, "New solver should be added");

        // Remove the solver
        intentBook.removeSolver(newSolver);
        isSolver = intentBook.isSolver(newSolver);
        assertFalse(isSolver, "Solver should be removed");

        vm.stopPrank();
    }

    function testCancelNonOpenIntent() public {
        vm.startPrank(owner);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        // Post and lock an intent
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
            intentBook.getNonce()
        );
        bytes32 intentId = intentBook.publishIntent(signedIntent);
        vm.stopPrank();

        vm.startPrank(owner);
        intentBook.lockIntent(intentId);
        vm.stopPrank();

        // Cancel the locked intent
        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSignature("IntentBook__CannotCancelNonOpenIntent()"));
        intentBook.cancelIntent(intentId);
        vm.stopPrank();
    }

    function testIntentExpiration() public {
        vm.startPrank(owner);
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
            intentBook.getNonce()
        );
        signedIntent.intent.ttl = block.timestamp - 1; // Intent already expired

        vm.expectRevert(abi.encodeWithSignature("IntentBook__IntentExpired()"));
        intentBook.publishIntent(signedIntent);

        vm.stopPrank();
    }

    function testInvalidIntentNonce() public {
        vm.startPrank(owner);
        intentBook.addPublisher(user1);
        vm.stopPrank();

        vm.startPrank(user1);
        uint256 currentNonce = intentBook.getNonce();
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
            intentBook.getNonce() + 1
        );

        vm.expectRevert(abi.encodeWithSignature("IntentBook__InvalidIntentNonce()"));
        intentBook.publishIntent(signedIntent);

        vm.stopPrank();
    }

    // function testReplayIntentPublishShouldRevert() public {
    //     vm.startPrank(owner);
    //     intentBook.addPublisher(user1);
    //     vm.stopPrank();

    //     vm.startPrank(user1);
    // }

    // function testFillPartiallyFillableIntent() public {
    //     vm.startPrank(owner);
    //     intentBook.addPublisher(user1);
    //     intentBook.addPublisher(user2);
    //     vm.stopPrank();

    //     // User 1 is a non LP, creating a normal intent
    //     vm.startPrank(user1);

    //     address[] memory mTokens = new address[](1);
    //     mTokens[0] = address(mToken);

    //     uint256[] memory mAmts = new uint256[](1);
    //     mAmts[0] = 500 * 10 ** 18;
    //     SignedIntent memory signedIntent = createSimpleIntent(
    //         address(mToken),
    //         500 * 10 ** 18,
    //         address(mToken2),
    //         500 * 10 ** 18,
    //         user1,
    //         FillStructure.Exactly,
    //         key,
    //         address(intentBook)
    //     );
    //     bytes32 intentId = intentBook.publishIntent(signedIntent);

    //     // Retrieve the intent and validate
    //     Intent memory retrievedIntent = intentBook.getIntent(intentId);
    //     assertEq(retrievedIntent.author, user1);
    //     assertEq(retrievedIntent.ttl, block.timestamp + 1 hours);
    //     assertEq(retrievedIntent.nonce, 0);

    //     vm.stopPrank();

    //     vm.startPrank(user2);

    //     address[] memory mTokens2 = new address[](1);
    //     mTokens2[0] =
    // }

    function testCommitValidSolution() public {
        vm.startPrank(owner);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
        vm.stopPrank();

        vm.startPrank(user1);

        mToken.approve(address(intentBook), 1000 * 10 ** 18);

        SignedIntent memory signedIntent = createSimpleIntent(
            address(mToken),
            500 * 10 ** 18,
            address(mToken2),
            500 * 10 ** 18,
            user1,
            FillStructure.Exactly,
            key,
            address(intentBook),
            0
        );
        bytes32 intentId = intentBook.publishIntent(signedIntent);

        IntentState stateAfterPost = intentBook.getIntentState(intentId);
        assertEq(uint256(stateAfterPost), uint256(IntentState.Open), "State should be Open after publishing");

        vm.stopPrank();

        vm.startPrank(user2);
        mToken2.approve(address(intentBook), 1000 * 10 ** 18);
        uint256 newNonce = intentBook.getNonce();
        assertEq(newNonce, 1);
        SignedIntent memory signedIntent2 = createSimpleIntent(
            address(mToken2),
            500 * 10 ** 18,
            address(mToken),
            500 * 10 ** 18,
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
        bytes32[] memory intentIds = new bytes32[](2);
        intentIds[0] = intentId;
        intentIds[1] = intentId2;

        Intent[] memory outputIntents = new Intent[](0);

        ReceiptStruct[] memory receipts = new ReceiptStruct[](0);
        // receipts[0] =
        //     ReceiptStruct({mToken: address(mToken2), mTokenAmount: 500 * 10 ** 18, owner: user1, intentHash: intentId});
        // receipts[1] =
        //     ReceiptStruct({mToken: address(mToken), mTokenAmount: 500 * 10 ** 18, owner: user2, intentHash: intentId2});

        MoveRecord[] memory spendGraph = new MoveRecord[](0);
        // spendGraph[0] =
        //     MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 0}), srcIdx: 1, qty: 500 * 10 ** 18});
        // spendGraph[1] =
        //     MoveRecord({outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: 1}), srcIdx: 0, qty: 500 * 10 ** 18});

        FillRecord[] memory fillGraph = new FillRecord[](0);
        // fillGraph[0] = FillRecord({outIdx: 0, inIdx: 0, outType: OutType.Receipt});
        // fillGraph[1] = FillRecord({outIdx: 1, inIdx: 1, outType: OutType.Receipt});

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: receipts,
            spendGraph: spendGraph,
            fillGraph: fillGraph
        });

        solution = spendReceiptFromIntent(500 * 10 ** 18, user1, address(mToken2), 1, solution);
        solution = spendReceiptFromIntent(500 * 10 ** 18, user2, address(mToken), 0, solution);
        solution = fulfills(0, 0, OutType.Receipt, solution);
        solution = fulfills(1, 1, OutType.Receipt, solution);

        intentBook.solve(solution);

        IntentState state = intentBook.getIntentState(intentId);
        IntentState state2 = intentBook.getIntentState(intentId2);
        assertEq(uint256(state), uint256(IntentState.Solved));
        assertEq(uint256(state2), uint256(IntentState.Solved));

        // Validate the receipt was created and MTokens were transferred
        bytes32 receiptId = receiptManager.getReceiptsByOwner(user1)[0];
        bytes32 receiptId2 = receiptManager.getReceiptsByOwner(user2)[0];
        ReceiptStruct memory receipt = receiptManager.getReceipt(receiptId);
        ReceiptStruct memory receipt2 = receiptManager.getReceipt(receiptId2);

        assertEq(receipt.mTokenAmount, 500 * 10 ** 18, "Receipt amount should match");
        assertEq(receipt2.mTokenAmount, 500 * 10 ** 18, "Receipt amount should match");

        vm.stopPrank();
    }

    function testCommitPartialSolution() public {
        vm.startPrank(owner);
        intentBook.addPublisher(user1);
        intentBook.addPublisher(user2);
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
            0
        );
        bytes32 intentId = intentBook.publishIntent(signedIntent);

        IntentState stateAfterPost = intentBook.getIntentState(intentId);
        assertEq(uint256(stateAfterPost), uint256(IntentState.Open), "State should be Open after publishing");

        vm.stopPrank();

        vm.startPrank(user2);
        mToken2.approve(address(intentBook), 1000 * 10 ** 18);
        uint256 newNonce = intentBook.getNonce();
        assertEq(newNonce, 1);
        SignedIntent memory signedIntent2 = createSimpleIntent(
            address(mToken2),
            440 * 10 ** 18,
            address(mToken),
            400 * 10 ** 18,
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
        // Intent1 --spent-by--> OutIntent1 (for 100 leftover mtoken to intent1.author)
        // Intent1 --spent-by--> OutReceipt1 (for 400 mtoken to intent2.author)
        // Intent2 --spent-by--> OutReceipt2 (for 440 mtoken2 to intent1.author)
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
            0
        ).intent;

        ReceiptStruct[] memory receipts = new ReceiptStruct[](0);

        MoveRecord[] memory spendGraph = new MoveRecord[](1);
        spendGraph[0] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}), srcIdx: 0, qty: 100 * 10 ** 18});

        FillRecord[] memory fillGraph = new FillRecord[](0);

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: receipts,
            spendGraph: spendGraph,
            fillGraph: fillGraph
        });
        solution = spendReceiptFromIntent(400 * 10 ** 18, user2, address(mToken), 0, solution);
        solution = spendReceiptFromIntent(440 * 10 ** 18, user1, address(mToken2), 1, solution);
        solution = fulfills(0, 0, OutType.Intent, solution);
        solution = fulfills(0, 1, OutType.Receipt, solution);
        solution = fulfills(1, 0, OutType.Receipt, solution);

        bytes32[] memory allReceiptIdsUser1Before = receiptManager.getReceiptsByOwner(user1);
        assertEq(allReceiptIdsUser1Before.length, 0, "User 1 should have 0 receipt");
        bytes32[] memory allReceiptIdsUser2Before = receiptManager.getReceiptsByOwner(user2);
        assertEq(allReceiptIdsUser2Before.length, 0, "User 2 should have 0 receipt");

        intentBook.solve(solution);

        IntentState state = intentBook.getIntentState(intentId);
        IntentState state2 = intentBook.getIntentState(intentId2);
        assertEq(uint256(state), uint256(IntentState.Solved));
        assertEq(uint256(state2), uint256(IntentState.Solved));

        bytes32[] memory allReceiptIdsUser1 = receiptManager.getReceiptsByOwner(user1);
        assertEq(allReceiptIdsUser1.length, 1, "User 1 should have 1 receipt");
        bytes32[] memory allReceiptIdsUser2 = receiptManager.getReceiptsByOwner(user2);
        assertEq(allReceiptIdsUser2.length, 1, "User 2 should have 1 receipt");
        // Validate the receipt was created and MTokens were transferred
        bytes32 receiptId = receiptManager.getReceiptsByOwner(user1)[0];
        bytes32 receiptId2 = receiptManager.getReceiptsByOwner(user2)[0];
        ReceiptStruct memory receipt = receiptManager.getReceipt(receiptId);
        ReceiptStruct memory receipt2 = receiptManager.getReceipt(receiptId2);

        assertEq(receipt.mTokenAmount, 440 * 10 ** 18, "Receipt amount should match");
        assertEq(receipt2.mTokenAmount, 400 * 10 ** 18, "Receipt amount should match");

        vm.stopPrank();
    }

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
            0
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

        ReceiptStruct[] memory receipts = new ReceiptStruct[](0);

        MoveRecord[] memory spendGraph = new MoveRecord[](1);
        spendGraph[0] =
            MoveRecord({outputIdx: OutputIdx({outType: OutType.Intent, outIdx: 0}), srcIdx: 0, qty: 400 * 10 ** 18});

        FillRecord[] memory fillGraph = new FillRecord[](0);

        Solution memory solution = Solution({
            intentIds: intentIds,
            intentOutputs: outputIntents,
            receiptOutputs: receipts,
            spendGraph: spendGraph,
            fillGraph: fillGraph
        });
        solution = spendReceiptFromIntent(100 * 10 ** 18, user2, address(mToken), 0, solution);
        solution = spendReceiptFromIntent(110 * 10 ** 18, user1, address(mToken2), 1, solution);
        solution = fulfills(0, 0, OutType.Intent, solution);
        solution = fulfills(0, 1, OutType.Receipt, solution);
        solution = fulfills(1, 0, OutType.Receipt, solution);

        intentBook.solve(solution);

        IntentState state = intentBook.getIntentState(intentId);
        IntentState state2 = intentBook.getIntentState(intentId2);
        assertEq(uint256(state), uint256(IntentState.Solved));
        assertEq(uint256(state2), uint256(IntentState.Solved));

        // bytes32[] memory allReceiptIdsUser1 = receiptManager.getReceiptsByOwner(user1);
        // assertEq(allReceiptIdsUser1.length, 1, "User 1 should have 1 receipt");
        // bytes32[] memory allReceiptIdsUser2 = receiptManager.getReceiptsByOwner(user2);
        // assertEq(allReceiptIdsUser2.length, 1, "User 2 should have 1 receipt");
        // Validate the receipt was created and MTokens were transferred
        bytes32 receiptId = receiptManager.getReceiptsByOwner(user1)[0];
        bytes32 receiptId2 = receiptManager.getReceiptsByOwner(user2)[0];
        ReceiptStruct memory receipt = receiptManager.getReceipt(receiptId);
        ReceiptStruct memory receipt2 = receiptManager.getReceipt(receiptId2);

        assertEq(receipt.mTokenAmount, 110 * 10 ** 18, "Receipt amount should match");
        assertEq(receipt2.mTokenAmount, 100 * 10 ** 18, "Receipt amount should match");

        vm.stopPrank();
    }

    function testUnauthorizedReceiptCreation() public {
        vm.startPrank(owner);
        authorizationManager.removeAuthorizedMinter(user1);
        vm.stopPrank();

        bytes32 receiptId = keccak256(abi.encode(user1, address(mToken), 500 * 10 ** 18, block.timestamp));

        vm.startPrank(user1);
        vm.expectRevert(abi.encodeWithSignature("AuthorizationManager__UnauthorizedCaller()"));
        mTokenManager.transferMTokensToReceipt(bytes32(0), receiptId, address(mToken), 500 * 10 ** 18);

        vm.stopPrank();
    }

    function testVerifyIntentSignature() public {
        vm.startPrank(owner);
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
            intentBook.getNonce()
        );
        Intent memory intent = signedIntent.intent;
        // Generate the intent hash
        bytes32 intentHash = IntentLib.hashIntent(intent, address(intentBook));

        // Sign the intent hash with the author's private key
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, intentHash);
        require(ecrecover(intentHash, v, r, s) == addr, "Test error: Signer is invalid");
        signedIntent.signature = abi.encodePacked(r, s, v);

        // Verify the signature using the verifyIntentSignature function
        bool isValidSignature = SignatureLib.verifyIntentSignature(signedIntent, address(intentBook));
        assertTrue(isValidSignature, "The signature should be valid");

        // Test with an invalid signature (changed amount)
        intent.srcAmount = 200 * 10 ** 18;
        isValidSignature = SignatureLib.verifyIntentSignature(signedIntent, address(intentBook));
        assertFalse(isValidSignature, "The signature should be invalid");
    }

    function testDepositToIntent() public {
        vm.startPrank(owner);
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
            intentBook.getNonce()
        );

        bytes32 intentHash = IntentLib.hashIntent(signedIntent.intent, address(intentBook));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, intentHash);
        signedIntent.signature = abi.encodePacked(r, s, v);

        // Publish the intent, which will trigger depositToIntent
        bytes32 intentId = intentBook.publishIntent(signedIntent);

        // Verify that the MToken balance was deposited into the intent
        uint256 intentBalance = mTokenManager.getIntentBalance(intentId);
        assertEq(intentBalance, 500 * 10 ** 18, "MToken balance should be locked in the intent");

        vm.stopPrank();
    }
}
