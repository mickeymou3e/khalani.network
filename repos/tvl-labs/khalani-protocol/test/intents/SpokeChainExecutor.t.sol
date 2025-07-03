pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../../src/Intents/SpokeChainExecutor.sol";
import "../../src/Intents/intentbook/lib/SwapIntentLib.sol";
import {SwapIntentLib} from "../../src/Intents/intentbook/lib/SwapIntentLib.sol";
import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";
import "../lib/IntentsLib.sol";
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

contract SpokeChainExecutorTest is Test {

    event SpokeCalled(address indexed contractToCall, address indexed token, uint256 indexed amount);

    MockIntentEventProverAndVerifier mockIntentEventProverAndVerifier = new MockIntentEventProverAndVerifier();
    SpokeChainExecutor spokeChainExecutor;
    MockERC20 token = new MockERC20("USDC", "USDC", 18);
    MockContractToCall mockContract;
    uint256 amount = 1e5;    
    address contractToCall;
    bytes32 spokeChainCallIntentId = IntentsLib._randomBytes32();

    function setUp() public {
        spokeChainExecutor = new SpokeChainExecutor(EventProver(address(mockIntentEventProverAndVerifier)));
        mockContract = new MockContractToCall();
        contractToCall = address(mockContract);
    }

    function testCallSpokeWithMockFunction() public {
        token.mint(address(this), amount);
        token.mint(address(spokeChainExecutor), amount);

        token.approve(address(this), amount);
        token.approve(address(spokeChainExecutor), amount);

        // Encode a call to the mockFunction of MockContractToCall
        bytes memory callData = abi.encodeWithSignature("mockFunction(address,uint256)", address(token), amount);

        vm.expectEmit(address(spokeChainExecutor));
        emit SpokeCalled(contractToCall, address(token), amount);

        // Execute the callSpoke function on the specified contract with encoded mockFunction call
        spokeChainExecutor.callSpoke(spokeChainCallIntentId, contractToCall, callData, address(token), amount);
    }

    function testCallSpokeWithAmountBiggerThanApproved() public {
        uint256 biggerAmount = amount + 1e2;

        token.mint(address(this), amount);
        token.approve(address(spokeChainExecutor), amount);

        // Encode a call to the mockFunction of MockContractToCall with bigger amount
        bytes memory callData = abi.encodeWithSignature("mockFunction(address,uint256)", address(token), biggerAmount);

        vm.expectRevert("Call to contract failed");
        // Execute the callSpoke function on the specified contract with encoded mockFunction call
        spokeChainExecutor.callSpoke(spokeChainCallIntentId, contractToCall, callData, address(token), amount);
    }
}
