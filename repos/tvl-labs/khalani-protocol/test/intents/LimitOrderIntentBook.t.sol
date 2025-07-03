pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../../src/Intents/intentbook/lib/LimitOrderIntentLib.sol";
import "../../src/Intents/intentbook/LimitOrderIntentBook.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LimitOrderBookTest is Test, IntentBookEvents {

    event LimitOrderFulfilled(bytes32 intentId);
    event LimitOrderPartialFill(bytes32 intentId, uint256 volumeFilled);

    LimitOrderIntentBook limitOrderIntentBook;
    address filler;
    address public addr;
    uint256 public key;
    ERC20 public token;
    ERC20 public outToken;

    function setUp() public {
        limitOrderIntentBook = new LimitOrderIntentBook();
        token = new ERC20("token", "TKN");
        outToken = new ERC20("outToken", "OUT");
        filler =  vm.addr(1);
        (addr, key) = makeAddrAndKey("1337");
        deal(address(token), addr, 1000000e18);
        vm.prank(addr);
        token.approve(address(limitOrderIntentBook), 1000000e18);
    }

    function testLimitOrderBook_PlaceIntent(uint256 amount) public {
        vm.assume(amount<1001e18);
        ( LimitOrderIntentLib.LimitOrder memory limitOrder, bytes memory signature ) = _createIntent(amount, 0);
        IntentBookLib.Intent memory intent = IntentBookLib.Intent(abi.encode(limitOrder), signature);
        vm.expectEmit(address(limitOrderIntentBook));
        emit IntentCreated(IntentBookLib.calculateIntentId(intent), intent);
        limitOrderIntentBook.placeIntent(intent);
    }

    function testLimitOrderBook_PlaceIntentNonceAlreadyFlipped(uint256 amount1, uint256 amount2) public {
        vm.assume(amount1<1001e18 && amount2<1001e18 && amount1!=amount2);
        ( LimitOrderIntentLib.LimitOrder memory limitOrder1, bytes memory signature1 ) = _createIntent(amount1, 0);
        IntentBookLib.Intent memory intent1 = IntentBookLib.Intent(abi.encode(limitOrder1), signature1);
        limitOrderIntentBook.placeIntent(intent1);

        // changing the intent hash while keeping the bitToFlip same reverts
        ( LimitOrderIntentLib.LimitOrder memory limitOrder2, bytes memory signature2 ) = _createIntent(amount2 , 0);
        IntentBookLib.Intent memory intent2 = IntentBookLib.Intent(abi.encode(limitOrder2), signature2);

        vm.expectRevert("Nonce already flipped.");
        limitOrderIntentBook.placeIntent(intent2);
    }

    function testLimitOrderBook_PlaceBatchIntent(uint256 amount1, uint256 amount2) public {
        vm.assume(amount1<1001e18 && amount2<1001e18 && amount1!=amount2);
        //create 2 different intents and place them using placeBatchIntent
        ( LimitOrderIntentLib.LimitOrder memory limitOrder1, bytes memory signature1 ) = _createIntent(amount1, 0);
        ( LimitOrderIntentLib.LimitOrder memory limitOrder2, bytes memory signature2 ) = _createIntent(amount2, 1);
        IntentBookLib.Intent[] memory intents = new IntentBookLib.Intent[](2);
        intents[0] = IntentBookLib.Intent(abi.encode(limitOrder1), signature1);
        intents[1] = IntentBookLib.Intent(abi.encode(limitOrder2), signature2);
        vm.expectEmit(address(limitOrderIntentBook));
        for (uint i = 0; i < intents.length; i++) {
            emit IntentCreated(IntentBookLib.calculateIntentId(intents[i]), intents[i]);
        }
        limitOrderIntentBook.placeBatchIntent(intents);
    }

    function testLimitOrderBook_MatchIntent(uint256 amount) public {
        vm.assume(amount<1001e18);
        (, bytes32 intentId) = _placeIntent(amount);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bytes("0x00")
        );
        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        vm.expectEmit(address(limitOrderIntentBook));
        emit IntentMatch(intentId, intentBidId, intentBid);
        limitOrderIntentBook.matchIntent(intentBid);
    }

    function testLimitorderBook_SettleIntent(uint256 amount) public {
        vm.assume(amount<1001e18);
        uint256 volumeToFill = amount;
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount);
        LimitOrderIntentLib.LimitOrderBid memory limitOrderBid = LimitOrderIntentLib
            .LimitOrderBid(filler, volumeToFill);
        bytes memory bid = abi.encode(limitOrderBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );
        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        limitOrderIntentBook.matchIntent(intentBid);

        deal(address(outToken), filler, amount);
        vm.startPrank(filler);
        ERC20(outToken).approve(address(limitOrderIntentBook), amount);

        vm.expectEmit(address(limitOrderIntentBook));
        emit LimitOrderFulfilled(intentId);
        emit IntentSettled(intentId, intentBidId);
        limitOrderIntentBook.settleIntent(intentId);
    }

    function testLimitorderBook_SettleIntentPartialFilled(uint256 amount) public {
        vm.assume(amount>1e8 && amount<1001e18);
        (IntentBookLib.Intent memory intent, bytes32 intentId) = _placeIntent(amount);
        uint256 volumeToFill = amount / 2;
        LimitOrderIntentLib.LimitOrderBid memory limitOrderBid = LimitOrderIntentLib
            .LimitOrderBid(filler, volumeToFill);
        bytes memory bid = abi.encode(limitOrderBid);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );
        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        limitOrderIntentBook.matchIntent(intentBid);

        deal(address(outToken), filler, amount);
        deal(address(token), address(limitOrderIntentBook), amount);
        vm.startPrank(filler);
        ERC20(outToken).approve(address(limitOrderIntentBook), amount);

        vm.expectEmit(address(limitOrderIntentBook));
        emit LimitOrderPartialFill(intentId, volumeToFill);
        emit IntentPartiallySettled(intentId, intentBidId);
        limitOrderIntentBook.settleIntent(intentId);
    }

    function testLimitOrderMatch() public {
        assertEq(_limitOrderMatch(6, 18, 3000e6, 0.998e18), 2994e18);
        assertEq(_limitOrderMatch(18, 6, 3000e18, 0.998e18), 2994e6);
    }

    // ---------------------- private helper functions ----------------------------
    function _signIntent(LimitOrderIntentLib.LimitOrder memory newIntent) private view returns (bytes memory) {
        bytes32 digest = LimitOrderIntentLib._getIntentHash(newIntent);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        require(ecrecover(digest, v, r, s) == addr, "Test error: Signer is invalid");

        return abi.encodePacked(r, s, v);
    }

    function _createIntent(uint256 amount, uint8 shift) private view returns (LimitOrderIntentLib.LimitOrder memory newIntent, bytes memory signature) {
        newIntent.author = addr;
        newIntent.token = address(token);
        newIntent.outToken = address(outToken);
        newIntent.volume = amount;
        newIntent.price = 0.998e18;
        newIntent.nonceIndex = 0;
        newIntent.nonceBitToFlip = 1 << shift;
        signature = _signIntent(newIntent);
    }

    function _placeIntent(uint256 amount) private returns (IntentBookLib.Intent memory intent, bytes32 intentId) {
        ( LimitOrderIntentLib.LimitOrder memory limitOrder, bytes memory signature ) = _createIntent(amount, 0);
        intent = IntentBookLib.Intent(abi.encode(limitOrder), signature);
        intentId = IntentBookLib.calculateIntentId(intent);
        limitOrderIntentBook.placeIntent(intent);    
    }

    function _limitOrderMatch(uint256 tokenDecimals, uint256 outTokenDecimals, uint256 volume, uint256 price) private view returns (uint256 tokensToFill) {
        // Adjust price for outToken decimals
        uint256 adjustedPrice = price * (10**outTokenDecimals) / 1e18;

        // Token to be sent from filler to author
        // The value sent is volume * price, adjusted for outToken's decimal count
        tokensToFill = volume * adjustedPrice / (10**tokenDecimals);
        console.log("Tokens to send from filler to author %s ", tokensToFill);
    }
}