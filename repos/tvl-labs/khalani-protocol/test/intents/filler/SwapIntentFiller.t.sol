pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../../../src/Intents/filler/SwapIntentFiller.sol";
import "../../../src/Intents/filler/SwapIntentFillerEvents.sol";
import "../../../src/Intents/intentbook/lib/SwapIntentLib.sol";
import "../../../test/Mock/MockPermit2.sol";
import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";
import "../../lib/IntentsLib.sol";
import "../../Mock/MockIntentEventProverAndVerifier.sol";

contract SwapFillerTest is Test, SwapIntentFillerEvents {
    SwapIntentFiller swapIntentFiller;
    MockERC20 destinationToken = new MockERC20("USDT", "USDT", 6);
    SwapIntentLib.SwapIntent intent;

    MockIntentEventProverAndVerifier mockIntentEventProverAndVerifier = new MockIntentEventProverAndVerifier();

    uint256 authorPrivateKey;
    address author;

    uint256 solverPrivateKey;
    address solver;
    address solverFiller = vm.addr(5);

    uint256 fillAmount = 999_000_000;

    function setUp() public {
        swapIntentFiller = new SwapIntentFiller(EventProver(address(mockIntentEventProverAndVerifier)));

        authorPrivateKey = IntentsLib._randomUint256();
        author = vm.addr(authorPrivateKey);

        solverPrivateKey = IntentsLib._randomUint256();
        solver = vm.addr(solverPrivateKey);
        solverFiller = vm.addr(solverPrivateKey + 1);

        intent = createIntent();

        vm.startPrank(solver);
        destinationToken.mint(solver, fillAmount);
        destinationToken.approve(address(swapIntentFiller), type(uint256).max);
        vm.stopPrank();
    }

    function createIntent() private view returns (SwapIntentLib.SwapIntent memory) {
        return SwapIntentLib.SwapIntent({
            author: author,
            sourceChainId: 0,
            destinationChainId: 0,
            sourceToken: vm.addr(1),
            destinationToken: address(destinationToken),
            sourceAmount: 0,
            sourcePermit2: "",
            deadline: block.timestamp,
            nonceIndex: 0,
            nonceBitToFlip: 1 << 0
        });
    }

    function testFulfillSwapIntent() public {
        bytes32 intentId = SwapIntentLib.calculateSwapIntentId(intent);

        vm.startPrank(solver);
        vm.expectEmit();
        emit SwapIntentFillerEvents.Fill(intentId, solverFiller, author, fillAmount);

        swapIntentFiller.fillSwapIntent(intent, solverFiller, fillAmount);
        vm.stopPrank();

        assertTrue(
            mockIntentEventProverAndVerifier.verify(SwapIntentEventLibrary.calculateSwapIntentFilledEventHash(
                SwapIntentEventLibrary.SwapIntentFilled(
                    {
                        intentId: intentId,
                        filler: solverFiller,
                        fillAmount: fillAmount
                    }
                )
            ))
        );

        assertEq(destinationToken.balanceOf(solver), 0);
        assertEq(destinationToken.balanceOf(author), fillAmount);
    }

    function testFillSwapIntentDeadlinePassed() public {
        intent.deadline = block.timestamp - 1;
        vm.startPrank(solver);
        vm.expectRevert(SwapIntentFiller.DeadlineExpired.selector);
        swapIntentFiller.fillSwapIntent(intent, solver, fillAmount);
        vm.stopPrank();
    }

}