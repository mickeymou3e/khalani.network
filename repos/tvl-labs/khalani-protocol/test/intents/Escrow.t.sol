pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "forge-std/Vm.sol";
import "../../src/Intents/Escrow.sol";
import "../../src/Intents/intentbook/lib/SwapIntentLib.sol";
import "../../test/Mock/MockPermit2.sol";
import {MockERC20} from "solmate/test/utils/mocks/MockERC20.sol";
import "../lib/IntentsLib.sol";
import "../Mock/MockIntentEventProverAndVerifier.sol";

contract EscrowTest is Test {
    event TokensLocked(bytes32 intentId);

    MockPermit2 permit2 = new MockPermit2();
    Escrow escrow;
    MockERC20 token = new MockERC20("USDC", "USDC", 18);
    SwapIntentLib.SwapIntent intent;
    uint256 ownerKey;
    address owner;

    function setUp() public {
        MockIntentEventProverAndVerifier mockIntentEventProverAndVerifier = new MockIntentEventProverAndVerifier();
        escrow = new Escrow(permit2, EventProver(address(mockIntentEventProverAndVerifier)));
        ownerKey = IntentsLib._randomUint256();
        owner = vm.addr(ownerKey);
        intent = createIntent();
        vm.prank(owner);
        token.approve(address(permit2), type(uint256).max);
    }

    function createIntent() private returns (SwapIntentLib.SwapIntent memory) {
        return SwapIntentLib.SwapIntent({
            author: owner,
            sourceChainId: 0,
            destinationChainId: 0,
            sourceToken: address(token),
            destinationToken: vm.addr(3),
            sourceAmount: IntentsLib._randomUint256() % 1e18 + 1,
            sourcePermit2: "",
            deadline: block.timestamp,
            nonceIndex: 0,
            nonceBitToFlip: 1 << 0 
        });
    }

    function testLockTokens() public {
        bytes32 intentId = SwapIntentLib.calculateSwapIntentId(intent);

        token.mint(owner, intent.sourceAmount);
        IPermit2.PermitTransferFrom memory permit = IPermit2.PermitTransferFrom({
            permitted: IPermit2.TokenPermissions({
                token: IERC20(intent.sourceToken),
                amount: intent.sourceAmount
            }),
            nonce: uint256(keccak256(abi.encode(intent.nonceIndex, intent.nonceBitToFlip))),
            deadline: intent.deadline
        });

        bytes memory signature = _signPermit(permit, address(escrow), ownerKey);
        intent.sourcePermit2 = signature;

        escrow.lockTokens(intent);

        assertEq(escrow.tokenBalancesByUser(owner, address(token)), intent.sourceAmount);
        assertEq(token.balanceOf(address(escrow)), intent.sourceAmount);
        assertEq(token.balanceOf(owner), 0);
    }

    function test_cannotReusePermit() external {
        token.mint(owner, intent.sourceAmount);
        IPermit2.PermitTransferFrom memory permit = IPermit2.PermitTransferFrom({
            permitted: IPermit2.TokenPermissions({
                token: IERC20(intent.sourceToken),
                amount: intent.sourceAmount
            }),
            nonce: uint256(keccak256(abi.encode(intent.nonceIndex, intent.nonceBitToFlip))),
            deadline: intent.deadline
        });

        bytes memory signature = _signPermit(permit, address(escrow), ownerKey);
        intent.sourcePermit2 = signature;

        escrow.lockTokens(intent);
        vm.expectRevert(abi.encodeWithSelector(MockPermit2.InvalidNonce.selector));
        escrow.lockTokens(intent);
    }

    function test_cannotUseOthersPermit() external {
        token.mint(owner, intent.sourceAmount);
        IPermit2.PermitTransferFrom memory permit = IPermit2.PermitTransferFrom({
            permitted: IPermit2.TokenPermissions({
                token: IERC20(intent.sourceToken),
                amount: intent.sourceAmount
            }),
            nonce: uint256(keccak256(abi.encode(intent.nonceIndex, intent.nonceBitToFlip))),
            deadline: intent.deadline
        });

        bytes memory signature = _signPermit(permit, address(escrow), ownerKey);
        intent.sourcePermit2 = signature;

        vm.expectRevert(abi.encodeWithSelector(MockPermit2.InvalidSigner.selector));
        intent.author = IntentsLib._randomAddress();
        escrow.lockTokens(intent);
    }

    function test_cannotUseOtherTokenPermit() external {
        MockERC20 token2 = new MockERC20("USDC", "USDC", 18);
        token2.approve(address(permit2), type(uint256).max);
        token2.mint(owner, intent.sourceAmount);

        IPermit2.PermitTransferFrom memory permit = IPermit2.PermitTransferFrom({
            permitted: IPermit2.TokenPermissions({
                token: IERC20(address(token2)),
                amount: intent.sourceAmount
            }),
            nonce: uint256(keccak256(abi.encode(intent.nonceIndex, intent.nonceBitToFlip))),
            deadline: intent.deadline
        });

        bytes memory signature = _signPermit(permit, address(escrow), ownerKey);
        intent.sourcePermit2 = signature;

        vm.expectRevert(abi.encodeWithSelector(MockPermit2.InvalidSigner.selector));
        escrow.lockTokens(intent);
    }

     // Generate a signature for a permit message.
    function _signPermit(
        IPermit2.PermitTransferFrom memory permit,
        address spender,
        uint256 signerKey
    )
        internal
        returns (bytes memory sig)
    {
        (uint8 v, bytes32 r, bytes32 s) =
            vm.sign(signerKey, IntentsLib._getEIP712Hash(permit, spender, permit2.DOMAIN_SEPARATOR()));
        return abi.encodePacked(r, s, v);
    }
}