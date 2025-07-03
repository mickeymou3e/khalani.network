pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../../src/Intents/intentbook/lib/SpokeChainCallIntentLib.sol";
import "../../src/Intents/intentbook/SpokeChainCallIntentBook.sol";
import "../../src/Intents/intentbook/IntentBookEvents.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../../src/Intents/registry/GMPVerifierRegistry.sol";
import "../Mock/MockIntentEventProverAndVerifier.sol";

contract MockContractToCall {
    function mockFunction(address _token, uint256 _amount) external {
        SafeERC20.safeTransferFrom(
            IERC20(_token),
            msg.sender,
            address(this),
            _amount
        );
    }
}

contract SpokeChainCallBookTest is Test, IntentBookEvents {

    SpokeChainCallIntentBook spokeChainCallIntentBook;
    GMPVerifierRegistry verifierRegistry;
    MockIntentEventProverAndVerifier eventProverAndVerifier;
    MockContractToCall mockContract;
    address filler;
    address contractToCall;
    address public addr;
    uint256 public key;
    ERC20 public token;
    ERC20 public rewardToken;
    uint32 chainId;

    function setUp() public {
        verifierRegistry = new GMPVerifierRegistry();
        eventProverAndVerifier = new MockIntentEventProverAndVerifier();
        spokeChainCallIntentBook = new SpokeChainCallIntentBook(verifierRegistry);
        mockContract = new MockContractToCall();
        contractToCall = address(mockContract);
        token = new ERC20("token", "TKN");
        rewardToken = new ERC20("RewardToken", "rTKN");
        filler =  vm.addr(1);
        chainId = 11155111;
        (addr, key) = makeAddrAndKey("1337");
        deal(address(rewardToken), addr, 1000000e18);
        vm.prank(addr);
        rewardToken.approve(address(spokeChainCallIntentBook), 1000000e18);

        verifierRegistry.addVerifierForChain(
            chainId,
            address(eventProverAndVerifier)
        );
    }

    function testSpokeChainCallIntentBook_PlaceIntent(uint256 amount) public {
        vm.assume(amount<1001e18);

        // Encode a call to the mockFunction of MockContractToCall
        bytes memory callData = abi.encodeWithSignature("mockFunction(address,uint256)", address(token), amount);
        
        ( SpokeChainCallIntentLib.SpokeChainCall memory spokeChainCallIntent, bytes memory signature ) = _createIntent(amount, callData, 0);
        IntentBookLib.Intent memory intent = IntentBookLib.Intent(abi.encode(spokeChainCallIntent), signature);
        bytes32 intentId = IntentBookLib.calculateIntentId(intent);

        vm.expectEmit(address(spokeChainCallIntentBook));
        emit IntentCreated(intentId, intent);
        spokeChainCallIntentBook.placeIntent(intent);

        uint256 rewardAmount = amount;
        assertEq(ERC20(rewardToken).balanceOf(address(spokeChainCallIntentBook)), rewardAmount);
    }

    function testSpokeChainCallIntentBook_PlaceIntentNonceAlreadyFlipped(uint256 amount1, uint256 amount2) public {
        vm.assume(amount1<1001e18 && amount2<1001e18 && amount1!=amount2);

        // Encode a call to the mockFunction of MockContractToCall
        bytes memory callData1 = abi.encodeWithSignature("mockFunction(address,uint256)", address(token), amount1);
        
        ( SpokeChainCallIntentLib.SpokeChainCall memory spokeChainCallIntent1, bytes memory signature1 ) = _createIntent(amount1, callData1, 0);
        IntentBookLib.Intent memory intent1 = IntentBookLib.Intent(abi.encode(spokeChainCallIntent1), signature1);

        spokeChainCallIntentBook.placeIntent(intent1);

        bytes memory callData2 = abi.encodeWithSignature("mockFunction(address,uint256)", address(token), amount2);

        ( SpokeChainCallIntentLib.SpokeChainCall memory spokeChainCallIntent2, bytes memory signature2 ) = _createIntent(amount2, callData2, 0);
        IntentBookLib.Intent memory intent2 = IntentBookLib.Intent(abi.encode(spokeChainCallIntent2), signature2);

        vm.expectRevert("Nonce already flipped.");
        spokeChainCallIntentBook.placeIntent(intent2);
    }

    function testSpokeChainCallIntentBook_MatchIntent(uint256 amount) public {
        vm.assume(amount<1001e18);

        (, bytes32 intentId) = _placeIntent(amount);
        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bytes("0x00")
        );
        bytes32 intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        vm.expectEmit(address(spokeChainCallIntentBook));
        emit IntentMatch(intentId, intentBidId, intentBid);
        spokeChainCallIntentBook.matchIntent(intentBid);
    }

    function testSpokeChainCallIntentBook_SettleIntentEventHashNotRegistered(uint256 amount) public {
        vm.assume(amount<1001e18);

        (, bytes32 intentId) = _placeIntent(amount);

        address spokeChainCaller = vm.addr(101);
        _setupSettleIntent(intentId, amount, spokeChainCaller, false);

        vm.expectRevert("SpokeChainCallIntentBook: Invalid intent");
        spokeChainCallIntentBook.settleIntent(intentId);
    }

    function testSpokeChainCallIntentBook_SettleIntent(uint256 amount) public {
        vm.assume(amount<1001e18);

        (, bytes32 intentId) = _placeIntent(amount);

        address spokeChainCaller = vm.addr(101);
        bytes32 intentBidId = _setupSettleIntent(intentId, amount, spokeChainCaller, true);

        vm.expectEmit(address(spokeChainCallIntentBook));
        emit IntentSettled(intentId, intentBidId); 
        spokeChainCallIntentBook.settleIntent(intentId);

        assertEq(ERC20(rewardToken).balanceOf(address(spokeChainCallIntentBook)), 0);
        assertEq(ERC20(rewardToken).balanceOf(spokeChainCaller), amount);
    }
    
    
    // --------------- Private Helper Functions -----------------------------------
    function _signIntent(SpokeChainCallIntentLib.SpokeChainCall memory newIntent) private view returns (bytes memory) {
        bytes32 digest = SpokeChainCallIntentLib._getIntentHash(newIntent);
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(key, digest);

        require(ecrecover(digest, v, r, s) == addr, "Test error: Signer is invalid");

        return abi.encodePacked(r, s, v);
    }

    function _createIntent(uint256 amount, bytes memory callData, uint8 shift) private view returns (SpokeChainCallIntentLib.SpokeChainCall memory newIntent, bytes memory signature) {
        newIntent.author = addr;
        newIntent.chainId = chainId;
        newIntent.callData = callData;
        newIntent.contractToCall = contractToCall;
        newIntent.token = address(token);
        newIntent.rewardToken = address(rewardToken);
        newIntent.amount = amount;
        newIntent.rewardAmount = amount;
        newIntent.nonceIndex = 0;
        newIntent.nonceBitToFlip = 1 << shift;
        signature = _signIntent(newIntent);
    }

    function _placeIntent(uint256 amount) private returns (IntentBookLib.Intent memory intent, bytes32 intentId) {

        // Encode a call to the mockFunction of MockContractToCall
        bytes memory callData = abi.encodeWithSignature("mockFunction(address,uint256)", address(token), amount);

        ( SpokeChainCallIntentLib.SpokeChainCall memory spokeChainCallIntent, bytes memory signature ) = _createIntent(amount, callData, 0);
        intent = IntentBookLib.Intent(abi.encode(spokeChainCallIntent), signature);
        intentId = IntentBookLib.calculateIntentId(intent);
        spokeChainCallIntentBook.placeIntent(intent);
    }

    function _setupSettleIntent(bytes32 intentId, uint256 amount,address spokeChainCaller, bool registerSpokeCallHash) private returns(bytes32 intentBidId){

        SpokeChainCallIntentLib.SpokeChainCallBid memory spokeChainCallBid = SpokeChainCallIntentLib.SpokeChainCallBid(spokeChainCaller);
        bytes memory bid = abi.encode(spokeChainCallBid);

        IntentBookLib.IntentBid memory intentBid = IntentBookLib.IntentBid(
            intentId,
            bid
        );
        intentBidId = IntentBookLib.calculateIntentBidId(intentBid);

        spokeChainCallIntentBook.matchIntent(intentBid);

        bytes memory callData = abi.encodeWithSignature("mockFunction(address,uint256)", address(token), amount);

        bytes32 eventHash = SpokeChainCallEventLibrary.calculateSpokeCalledEventHash(SpokeChainCallEventLibrary.SpokeCalled({
            caller: spokeChainCaller,
            spokeChainCallIntentId: intentId,
            contractToCall: contractToCall,
            callData: callData,
            token: address(token),
            amount: amount
        }));

        if (registerSpokeCallHash) {
            eventProverAndVerifier.registerEvent(eventHash);
        }
    }

}