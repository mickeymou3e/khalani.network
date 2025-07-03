pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "forge-std/Vm.sol";
import "../src/Intents/intentbook/lib/SwapIntentLib.sol";
import "../src/Intents/intentbook/SwapIntentBook.sol";
import "../src/Intents/intentbook/IntentBookEvents.sol";
import "../src/Intents/registry/GMPVerifierRegistry.sol";
import "./Mock/MockIntentEventProverAndVerifier.sol";
import "./Mock/MockRewarder.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";

contract SwapIntentBookTest is Test, IntentBookEvents {
    SwapIntentBook intentBook;
    GMPVerifierRegistry verifierRegistry;
    MockIntentEventProverAndVerifier eventProverAndVerifier;
    IERC20 usdcEth;
    MockRewarder rewarder;
    address public addr;
    uint256 public key;
    address filler;
    uint256 fillAmount;
    uint32 sourceChainId;
    uint32 destinationChainId;

    function setUp() public {
        verifierRegistry = new GMPVerifierRegistry();
        eventProverAndVerifier = new MockIntentEventProverAndVerifier();
        usdcEth = IERC20(new ERC20MintableBurnable("USDC.ETH", "USDC/ETH"));
        rewarder = new MockRewarder(address(usdcEth));
        intentBook = new SwapIntentBook(
            verifierRegistry,
            IRewarder(address(rewarder))
        );
        (addr, key) = makeAddrAndKey("1337");
        filler = vm.addr(1);
        fillAmount = 1000e18;
        sourceChainId = 11155111;
        destinationChainId = 43113;
        verifierRegistry.addVerifierForChain(
            sourceChainId,
            address(eventProverAndVerifier)
        );
        verifierRegistry.addVerifierForChain(
            destinationChainId,
            address(eventProverAndVerifier)
        );
    }

    // ----------------------- PlaceIntentTests--------------------------------------
    function test_SwapIntentBook_PlaceOrder_RevertsIntentAlreadyExists(uint256 amount)
        public
    {
        vm.assume(amount<1001e18);
        (
            SwapIntentLib.SwapIntent memory intentData,
            bytes memory signature
        ) = _createIntent(amount, 0);
        IntentBookLib.Intent memory intent = IntentBookLib.Intent(
            abi.encode(intentData),
            signature
        );
        bytes32 intentId = IntentBookLib.calculateIntentId(intent);
        intentBook.placeIntent(intent);

        vm.expectRevert("Intent already exists");
        intentBook.placeIntent(intent);
    }

    function test_SwapIntentBook_PlaceOrder_InvalidSignature(uint256 amount) public {
        vm.assume(amount<1001e18);
        (
            SwapIntentLib.SwapIntent memory intentData,
            bytes memory signature
        ) = _createIntent(amount, 0);

        // changing the nonce will invalidate the signature
        intentData.nonceIndex = 1;

        IntentBookLib.Intent memory intent = IntentBookLib.Intent(
            abi.encode(intentData),
            signature
        );
        bytes32 intentId = IntentBookLib.calculateIntentId(intent);

        vm.expectRevert("Verification error: Signer is invalid");
        intentBook.placeIntent(intent);
    }

    function test_SwapIntentBook_PlaceOrder(uint256 amount) public {
        vm.assume(amount<1001e18);

        (
            SwapIntentLib.SwapIntent memory intentData,
            bytes memory signature
        ) = _createIntent(amount, 0);
        console.log("Swap Intent Author : %s", intentData.author);
        console.log(
            "Swap Intent Source Chain ID : %s",
            intentData.sourceChainId
        );
        console.log(
            "Swap Intent Destination Chain ID : %s",
            intentData.destinationChainId
        );
        console.log("Swap Intent Source Token : %s", intentData.sourceToken);
        console.log(
            "Swap Intent Destination Token : %s",
            intentData.destinationToken
        );
        console.log("Swap Intent Source Amount : %s", intentData.sourceAmount);
        console.log("Swap Intent Source Permit 2 :");
        console.logBytes(intentData.sourcePermit2);
        console.log("Swap Intent Deadline : %s", intentData.deadline);

        console.log("Swap Intent Signature :");
        console.logBytes(signature);

        console.log("Encoded intent : %s");
        console.logBytes(abi.encode(intentData));

        IntentBookLib.Intent memory intent = IntentBookLib.Intent(
            abi.encode(intentData),
            signature
        );
        bytes32 intentId = IntentBookLib.calculateIntentId(intent);

        console.log("Intent ID");
        console.logBytes32(intentId);

        vm.expectEmit(address(intentBook));
        emit IntentCreated(intentId, intent);

        intentBook.placeIntent(intent);
    }

    function test_SwapIntentBook_PlaceOrderNonceAlreadyFlipped(uint256 amount1, uint256 amount2) public {
        vm.assume(amount1<1001e18 && amount2<1001e18 && amount1!=amount2);

        (SwapIntentLib.SwapIntent memory intentData1, bytes memory signature1) = _createIntent(amount1, 0);
        IntentBookLib.Intent memory intent1 = IntentBookLib.Intent(abi.encode(intentData1), signature1);

        (SwapIntentLib.SwapIntent memory intentData2, bytes memory signature2) = _createIntent(amount2, 0);
        IntentBookLib.Intent memory intent2 = IntentBookLib.Intent(abi.encode(intentData2), signature2);

        intentBook.placeIntent(intent1);

        vm.expectRevert("Nonce already flipped.");
        intentBook.placeIntent(intent2);
    }

    function test_SwapIntentBook_PlaceBatchOrder(uint256 amount) public {
        vm.assume(amount<1001e18);
        (
            SwapIntentLib.SwapIntent memory intentData1,
            bytes memory signature1
        ) = _createIntent(amount, 0);
        (
            SwapIntentLib.SwapIntent memory intentData2,
            bytes memory signature2
        ) = _createIntent(amount, 1);

        IntentBookLib.Intent memory intent1 = IntentBookLib.Intent(
            abi.encode(intentData1),
            signature1
        );
        bytes32 intentId1 = IntentBookLib.calculateIntentId(intent1);

        IntentBookLib.Intent memory intent2 = IntentBookLib.Intent(
            abi.encode(intentData2),
            signature2
        );
        bytes32 intentId2 = IntentBookLib.calculateIntentId(intent2);

        IntentBookLib.Intent[] memory intents = new IntentBookLib.Intent[](2);
        intents[0] = intent1;
        intents[1] = intent2;

        bytes32[] memory intentIds = new bytes32[](2);
        intentIds[0] = intentId1;
        intentIds[1] = intentId2;

        for (uint i; i < 2; i++) {
            vm.expectEmit(address(intentBook));
            emit IntentCreated(intentIds[i], intents[i]);
        }

        intentBook.placeBatchIntent(intents);
    }

    // ----------------------- MatchIntentTests--------------------------------------
    function test_SwapIntentBook_MatchOrder(uint256 amount) public {
        vm.assume(amount<1001e18);
        (, bytes32 intentId) = _placeIntent(amount, 0);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bytes("0x40")
        );

        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        vm.expectEmit(address(intentBook));
        emit IntentMatch(intentId, intentBidId, intentBid);
        intentBook.matchIntent(intentBid);
    }

    function test_SwapIntentBook_MatchOrder_IntentAlreadyHasBid(uint256 amount) public {
        vm.assume(amount<1001e18);
        (, bytes32 intentId) = _placeIntent(amount, 0);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bytes("0x40")
        );

        intentBook.matchIntent(intentBid);

        vm.expectRevert("Intent already has a bid");
        intentBook.matchIntent(intentBid);
    }

    function test_SwapIntentBook_MatchOrder_IntentNotExists() public {
        bytes32 intentId = bytes32("");
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bytes("0x40")
        );

        vm.expectRevert("Intent does not exist");
        intentBook.matchIntent(intentBid);
    }

    function test_SwapIntentBook_MatchOrder_IntentAlreadyCancelled(uint256 amount) public {
        vm.assume(amount<1001e18);
        (, bytes32 intentId) = _placeIntent(amount, 0);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bytes("0x40")
        );

        intentBook.cancelIntent(intentId);

        vm.expectRevert("Intent is already cancelled");
        intentBook.matchIntent(intentBid);
    }

    function test_SwapIntentBook_MatchOrder_IntentAlreadySettled(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);
        SwapIntentLib.SwapIntentBid memory swapIntentBid = SwapIntentLib
            .SwapIntentBid(filler, fillAmount);
        bytes memory bid = abi.encode(swapIntentBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );

        intentBook.matchIntent(intentBid);
        _setupSettleIntent(intent, true, true);
        intentBook.settleIntent(intentId);

        vm.expectRevert("Intent is already settled");
        intentBook.matchIntent(intentBid);
    }

    // ----------------------- SettleIntentTests--------------------------------------
    function test_SwapIntentBook_SettleOrder_IntentDoesNotHaveabid(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);

        vm.expectRevert("Intent does not have a bid");
        intentBook.settleIntent(intentId);
    }

    function test_SwapIntentBook_SettleOrderTokenNotLocked(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);
        SwapIntentLib.SwapIntentBid memory swapIntentBid = SwapIntentLib
            .SwapIntentBid(filler, fillAmount);
        bytes memory bid = abi.encode(swapIntentBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );
        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        intentBook.matchIntent(intentBid);

        _setupSettleIntent(intent, false, false);
        vm.expectRevert("token not locked at source");
        intentBook.settleIntent(intentId);
    }

    function test_SwapIntentBook_SettleOrderSwapNotFulfilled(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);
        SwapIntentLib.SwapIntentBid memory swapIntentBid = SwapIntentLib
            .SwapIntentBid(filler, fillAmount);
        bytes memory bid = abi.encode(swapIntentBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );
        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        intentBook.matchIntent(intentBid);

        _setupSettleIntent(intent, true, false);
        vm.expectRevert("swap not fulfilled at destination");
        intentBook.settleIntent(intentId);
    }

    function test_SwapIntentBook_SettleOrder(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);
        SwapIntentLib.SwapIntentBid memory swapIntentBid = SwapIntentLib
            .SwapIntentBid(filler, fillAmount);
        bytes memory bid = abi.encode(swapIntentBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );
        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        intentBook.matchIntent(intentBid);

        _setupSettleIntent(intent, true, true);
        vm.expectEmit(address(intentBook));
        emit IntentSettled(intentId, intentBidId);

        intentBook.settleIntent(intentId);
    }

    function test_SwapIntentBook_MatchAndSettleOrder(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);
        SwapIntentLib.SwapIntentBid memory swapIntentBid = SwapIntentLib
            .SwapIntentBid(filler, fillAmount);
        bytes memory bid = abi.encode(swapIntentBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );

        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        _setupSettleIntent(intent, true, true);

        vm.expectEmit(address(intentBook));
        emit IntentMatch(intentId, intentBidId, intentBid);
        vm.expectEmit(address(intentBook));
        emit IntentSettled(intentId, intentBidId);
        intentBook.matchAndSettle(intentBid);
    }

    // ----------------------- CancelIntentTests--------------------------------------
    function test_SwapIntentBook_CancelOrder_IntentAlreadySettled(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);
        SwapIntentLib.SwapIntentBid memory swapIntentBid = SwapIntentLib
            .SwapIntentBid(filler, fillAmount);
        bytes memory bid = abi.encode(swapIntentBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );

        _setupSettleIntent(intent, true, true);
        intentBook.matchAndSettle(intentBid);

        vm.expectRevert("Intent is already settled");
        intentBook.cancelIntent(intentId);(intentId);
    }

    function test_SwapIntentBook_CancelOrder_IntentAlreadyCancelled(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);
        intentBook.cancelIntent(intentId);(intentId);

        vm.expectRevert("Intent is already cancelled");
        intentBook.cancelIntent(intentId);(intentId);
    }

    function test_SwapIntentBook_CancelOrder(uint256 amount) public {
        vm.assume(amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount, 0);

        vm.expectEmit(address(intentBook));
        emit IntentCancelled(intentId);
        intentBook.cancelIntent(intentId);
    }

    function test_SwapIntentBook_CancelBatchOrder(uint256 amount) public {
        vm.assume(amount<1001e18);
        (
            SwapIntentLib.SwapIntent memory intentData1,
            bytes memory signature1
        ) = _createIntent(amount, 0);
        (
            SwapIntentLib.SwapIntent memory intentData2,
            bytes memory signature2
        ) = _createIntent(amount, 1);

        IntentBookLib.Intent memory intent1 = IntentBookLib.Intent(
            abi.encode(intentData1),
            signature1
        );
        bytes32 intentId1 = IntentBookLib.calculateIntentId(intent1);

        IntentBookLib.Intent memory intent2 = IntentBookLib.Intent(
            abi.encode(intentData2),
            signature2
        );
        bytes32 intentId2 = IntentBookLib.calculateIntentId(intent2);

        bytes32[] memory intentIds = new bytes32[](2);
        intentIds[0] = intentId1;
        intentIds[1] = intentId2;

        for (uint i; i < 2; i++) {
            vm.expectEmit(address(intentBook));
            emit IntentCancelled(intentIds[i]);
        }
        intentBook.cancelBatchIntent(intentIds);
    }

    // ------------------- private helper functions----------------------
    function _signIntent(
        SwapIntentLib.SwapIntent memory newIntent
    ) private view returns (bytes memory) {
        bytes32 digest = SwapIntentLib._getIntentHash(newIntent);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        require(
            ecrecover(digest, v, r, s) == addr,
            "Test error: Signer is invalid"
        );

        return abi.encodePacked(r, s, v);
    }

    function _createIntent(uint256 amount, uint8 shift) private view returns (
            SwapIntentLib.SwapIntent memory newIntent,
            bytes memory signature) 
    {
        newIntent = SwapIntentLib.SwapIntent({
            author: addr,
            sourceChainId: sourceChainId,
            destinationChainId: destinationChainId,
            sourceToken: vm.addr(2),
            destinationToken: vm.addr(3),
            sourceAmount: amount,
            sourcePermit2: vm.parseBytes("0xabcd"),
            deadline: block.timestamp,
            nonceIndex: 0,
            nonceBitToFlip: 1 << shift
        });
        signature = _signIntent(newIntent);
    }

    function _placeIntent(uint256 amount, uint8 shift) private returns 
        (IntentBookLib.Intent memory intent, bytes32 intentId)
    {
        (
            SwapIntentLib.SwapIntent memory intentData,
            bytes memory signature
        ) = _createIntent(amount, shift);
        intent = IntentBookLib.Intent(abi.encode(intentData), signature);
        intentId = IntentBookLib.calculateIntentId(intent);
        intentBook.placeIntent(intent);
    }

    function _setupSettleIntent(IntentBookLib.Intent memory intent,
    bool registerTokenLockHash, bool registerFilledEventHash
    ) private {
        SwapIntentLib.SwapIntent memory swapIntent = abi.decode(
            intent.intent,
            (SwapIntentLib.SwapIntent)
        );
        bytes32 swapIntentId = SwapIntentLib.calculateSwapIntentId(swapIntent);

        SwapIntentEventLibrary.SwapIntentTokenLock
            memory swapIntentTokenLock = SwapIntentEventLibrary
                .SwapIntentTokenLock({intentId: swapIntentId});
        bytes32 swapIntentTokenLockEventHash = SwapIntentEventLibrary
            .calculateSwapIntentTokenLockEventHash(swapIntentTokenLock);

        SwapIntentEventLibrary.SwapIntentFilled
            memory swapIntentFilled = SwapIntentEventLibrary.SwapIntentFilled({
                intentId: swapIntentId,
                filler: filler,
                fillAmount: fillAmount
            });

        bytes32 swapIntentFilledEventHash = SwapIntentEventLibrary
            .calculateSwapIntentFilledEventHash(swapIntentFilled);

        if (registerTokenLockHash) {
            eventProverAndVerifier.registerEvent(swapIntentTokenLockEventHash);
        }

        if (registerFilledEventHash) {
            eventProverAndVerifier.registerEvent(swapIntentFilledEventHash);
        }

        // let's say rewarder will send USDC.eth as reward
        ERC20MintableBurnable(address(usdcEth)).mint(
            address(rewarder),
            1001e18
        );
    }
}