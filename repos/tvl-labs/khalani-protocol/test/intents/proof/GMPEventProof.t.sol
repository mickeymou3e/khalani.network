pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import "../../../src/Intents/proof/GMPEventProver.sol";
import "../../../src/Intents/proof/GMPEventVerifier.sol";
import "hyperlane-monorepo/solidity/contracts/mock/MockMailbox.sol";
import "hyperlane-monorepo/solidity/contracts/mock/MockMailbox.sol";
import "../../../src/Intents/intentbook/lib/SwapIntentLib.sol";
import "../../../src/Intents/proof/impl/GMPIntentEventProver.sol";
import "../../../src/Intents/proof/impl/GMPIntentEventVeifier.sol";
import "../../../src/Intents/libraries/SwapIntentEventLibrary.sol";

contract GMPEventProof is Test {

    event ProofReceived(bytes32 indexed intentId);

    MockMailbox mailboxChainA;
    MockMailbox mailboxChainB;
    GMPIntentEventProver gmpEventProverChainA;
    GMPIntentEventVerifier gmpEventVerifierChainB;
    address escrowChainA;

    function setUp() public {
        escrowChainA = vm.addr(1);
        deployMailboxAndRegister();
        setupProverVerifier();
    }

    function test_GMPShouldVerifyTokenLockEventHash() public {
        address sourceToken = vm.addr(90);
        address destinationToken = vm.addr(91);
        uint256 sourceAmount = 100e18;
        uint32 destinationChainId = 3;

        SwapIntentLib.SwapIntent memory swapIntent = SwapIntentLib.SwapIntent(msg.sender, 1, destinationChainId, sourceToken, destinationToken, sourceAmount, "", block.timestamp, 0, 1 << 0);
        bytes32 intentId = SwapIntentLib.calculateSwapIntentId(swapIntent);

        SwapIntentEventLibrary.SwapIntentTokenLock memory tokenLockEvent = SwapIntentEventLibrary.SwapIntentTokenLock(intentId);

        //escrow sends this event eventRepresentation to GMPEventProver
        vm.startPrank(escrowChainA);
        gmpEventProverChainA.registerEvent(
            SwapIntentEventLibrary.calculateSwapIntentTokenLockEventHash(
                SwapIntentEventLibrary.SwapIntentTokenLock(intentId)
            )
        );
        vm.stopPrank();

        mailboxChainB.processNextInboundMessage();

        //verify event
        bool correctProof = gmpEventVerifierChainB.verify(
            SwapIntentEventLibrary.calculateSwapIntentTokenLockEventHash(
                SwapIntentEventLibrary.SwapIntentTokenLock(intentId)
            )
        );
        //should be true on correct verification
        assertTrue(correctProof);
    }

    function test_GMPShouldVerifyTokenBurnEventHash() public {
        address sourceToken = vm.addr(90);
        address destinationToken = vm.addr(91);
        uint256 sourceAmount = 100e18;
        uint32 destinationChainId = 3;
        address reactor = vm.addr(92);

        // give reactor a event registerer role
        gmpEventProverChainA.addEventRegisterer(reactor);

        SwapIntentLib.SwapIntent memory swapIntent = SwapIntentLib.SwapIntent(msg.sender, 1, destinationChainId, sourceToken, destinationToken, sourceAmount, "", block.timestamp, 0, 1 << 0);
        bytes32 intentId = SwapIntentLib.calculateSwapIntentId(swapIntent);

        SwapIntentEventLibrary.SwapIntentTokenBurn memory tokenBurnEvent = SwapIntentEventLibrary.SwapIntentTokenBurn(intentId);

        //reactor sends burn eventRepresentation to GMPEventProver
        vm.startPrank(reactor);
        gmpEventProverChainA.registerEvent(
            SwapIntentEventLibrary.calculateSwapIntentTokenBurnEventHash(
                SwapIntentEventLibrary.SwapIntentTokenBurn(intentId)
            )
        );
        vm.stopPrank();

        mailboxChainB.processNextInboundMessage();

        //verify event
        bool correctProof = gmpEventVerifierChainB.verify(
            SwapIntentEventLibrary.calculateSwapIntentTokenBurnEventHash(
                SwapIntentEventLibrary.SwapIntentTokenBurn(intentId)
            )
        );

        //should be true on correct verification
        assertTrue(correctProof);
    }

    function test_GMPShouldVerifyFilledEventHash() public {
        address sourceToken = vm.addr(90);
        address destinationToken = vm.addr(91);
        uint256 sourceAmount = 100e18;
        uint32 destinationChainId = 3;
        address filler = vm.addr(92);
        address reactor = vm.addr(92);
        uint256 fillAmount = 100e18;

        // give reactor a event registerer role
        gmpEventProverChainA.addEventRegisterer(reactor);

        SwapIntentLib.SwapIntent memory swapIntent = SwapIntentLib.SwapIntent(msg.sender, 1, destinationChainId, sourceToken, destinationToken, sourceAmount, "", block.timestamp, 0, 1 << 0);
        bytes32 intentId = SwapIntentLib.calculateSwapIntentId(swapIntent);

        SwapIntentEventLibrary.SwapIntentFilled memory filledEvent = SwapIntentEventLibrary.SwapIntentFilled(intentId, filler, fillAmount);

        //reactor sends filled eventRepresentation to GMPEventProver
        vm.startPrank(escrowChainA);
        gmpEventProverChainA.registerEvent(
            SwapIntentEventLibrary.calculateSwapIntentFilledEventHash(
                SwapIntentEventLibrary.SwapIntentFilled(intentId, filler, fillAmount)
            )
        );
        vm.stopPrank();

        mailboxChainB.processNextInboundMessage();

        //verify event
        bool correctProof = gmpEventVerifierChainB.verify(
            SwapIntentEventLibrary.calculateSwapIntentFilledEventHash(
                SwapIntentEventLibrary.SwapIntentFilled(intentId, filler, fillAmount)
            )
        );

        //should be true on correct verification
        assertTrue(correctProof);
    }

    function test_ProofSend_InvalidCaller() public {
        vm.expectRevert();
        gmpEventProverChainA.registerEvent(keccak256(""));
    }

    function deployMailboxAndRegister() private {
        mailboxChainA = new MockMailbox(1);
        mailboxChainB = new MockMailbox(2);
        mailboxChainA.addRemoteMailbox(2, mailboxChainB);
        mailboxChainB.addRemoteMailbox(1, mailboxChainA);
    }

    function setupProverVerifier() private {
        gmpEventVerifierChainB = new GMPIntentEventVerifier();
        gmpEventVerifierChainB.initialise(1, address(mailboxChainB), address(0x0));

        gmpEventProverChainA = new GMPIntentEventProver(address(gmpEventVerifierChainB), address(mailboxChainA), address(0x0), 2);

        gmpEventProverChainA.addEventRegisterer(escrowChainA);
        gmpEventVerifierChainB.addEventRegisterer(address (gmpEventProverChainA));
    }
}