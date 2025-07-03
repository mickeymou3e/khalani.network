pragma solidity ^0.8.4;

import "forge-std/Test.sol";
import "../src/LiquidityReserves/remote/AssetReserves.sol";
import {GMPIntentEventProver} from "../src/Intents/proof/impl/GMPIntentEventProver.sol";
import {GMPEventVerifier} from "../src/Intents/proof/GMPEventVerifier.sol";
import "../src/LiquidityReserves/khalani/LiquidityProjectorV2.sol";
import "./Mock/MockIntentEventProverAndVerifier.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {GMPVerifierRegistry} from "../src/Intents/registry/GMPVerifierRegistry.sol";
import {GMPProverRegistry} from "../src/Intents/registry/GMPProverRegistry.sol";
import "../src/Tokens/ERC20MintableBurnable.sol";

contract AssetReservesTest is Test {

    //------Contracts------//
    AssetReserves public assetReserves;
    LiquidityProjectorV2 public liquidityProjector;

    //------Provers and Verifiers------//
    EventProver public eventProver;
    EventVerifier public eventVerifier;

    //------Registries------//
    VerifierRegistry public verifierRegistry;
    ProverRegistry public proverRegistry;

    //------Tokens------//
    ERC20 public spokeChainToken;
    ERC20MintableBurnable public mirrorToken;

    address user;

    function setUp() public {
        MockIntentEventProverAndVerifier mockIntentEventProverAndVerifier = new MockIntentEventProverAndVerifier();
        eventProver = EventProver(address(mockIntentEventProverAndVerifier));
        eventVerifier = EventVerifier(address(mockIntentEventProverAndVerifier));
        assetReserves = new AssetReserves(eventProver, eventVerifier);
        verifierRegistry = new GMPVerifierRegistry();
        proverRegistry = new GMPProverRegistry();
        verifierRegistry.addVerifierForChain(1, address(eventVerifier));
        proverRegistry.addProverForChain(1, address(eventProver));
        liquidityProjector = new LiquidityProjectorV2(verifierRegistry, proverRegistry);
        spokeChainToken = new ERC20("SpokeChainToken", "SCT");
        mirrorToken = new ERC20MintableBurnable("MirrorToken", "MCT");
        mirrorToken.addMinterRole(address(liquidityProjector));
        assetReserves.addAsset(address(spokeChainToken));
        liquidityProjector.registerToken(1, address(spokeChainToken), address(mirrorToken));
        user = address(0x1);
        deal(address(spokeChainToken), user, 100e18);
    }

    function test_AssetReserves_lockAsset() public {

        uint nonce = 0;
        uint amount = 100e18;
        assertEq(spokeChainToken.balanceOf(address(assetReserves)), 0);
        assertEq(spokeChainToken.balanceOf(user), amount);


        bytes32 intentId = SlowBridgeIntentsLibrary.calculateLockTokenIntentId(
            nonce,
            block.chainid,
            user,
            address(spokeChainToken),
            amount,
            user
        );
        bytes32 eventHash = TokenEventLibrary.calculateLockTokenEventHash(
            TokenEventLibrary.LockTokenEvent(
                intentId
            )
        );
        assertFalse(eventVerifier.verify(eventHash));

        vm.startPrank(user);
        spokeChainToken.approve(address(assetReserves), amount);
        vm.expectEmit(address (assetReserves));
        emit TokenEventLibrary.LockToken(
            intentId,
            nonce,
            address(spokeChainToken),
            amount
        );
        assetReserves.lockAsset(user, address(spokeChainToken), amount);
        vm.stopPrank();

        assertEq(spokeChainToken.balanceOf(address(assetReserves)), amount);
        assertEq(spokeChainToken.balanceOf(user), 0);
        assertTrue(eventVerifier.verify(eventHash));
        assertEq(assetReserves.nonce(), 1);
    }

    function test_AssetReserves_lockAsset_InvalidAsset() public {
        address invalidAsset = address(0x2);
        vm.expectRevert("AssetReserves: Asset not whitelisted");
        assetReserves.lockAsset(user, invalidAsset, 100e18);
    }

    function test_LiquidityProjector_mintToken() public {

        uint32 chainId = 1;
        vm.chainId(chainId);
        uint nonce = 0;
        uint amount = 100e18;

        assertEq(spokeChainToken.balanceOf(address(assetReserves)), 0);
        assertEq(spokeChainToken.balanceOf(user), amount);
        assertEq(mirrorToken.balanceOf(user), 0);
        assertEq(assetReserves.nonce(), 0);
        assertEq(liquidityProjector.nonce(), 0);

        bytes32 intentId = SlowBridgeIntentsLibrary.calculateLockTokenIntentId(
            nonce,
            chainId,
            user,
            address(spokeChainToken),
            amount,
            user
        );
        bytes32 eventHash = TokenEventLibrary.calculateLockTokenEventHash(
            TokenEventLibrary.LockTokenEvent(
                intentId
            )
        );

        assertFalse(eventVerifier.verify(eventHash));

        //------Spoke Chain Flow------//
        vm.startPrank(user);
        spokeChainToken.approve(address(assetReserves), amount);
        vm.expectEmit(address (assetReserves));
        emit TokenEventLibrary.LockToken(
            intentId,
            nonce,
            address(spokeChainToken),
            amount
        );
        assetReserves.lockAsset(user, address(spokeChainToken), amount);
        vm.stopPrank();

        //------Hub Chain Flow------//
        vm.chainId(2);

        vm.prank(user);
        liquidityProjector.mintToken(nonce, user, chainId, user, address(mirrorToken), amount);

        assertEq(mirrorToken.balanceOf(user), amount);
        assertEq(mirrorToken.balanceOf(address(liquidityProjector)), 0);
        assertEq(spokeChainToken.balanceOf(address(assetReserves)), amount);
        assertEq(spokeChainToken.balanceOf(user), 0);
        assertTrue(eventVerifier.verify(eventHash));
        assertEq(assetReserves.nonce(), 1);
        assertEq(liquidityProjector.nonce(), 0);
    }

    //testing unlocking tokens.. lets say users already holds 100e18 mirror tokens, burns it then it should be able to unlock 100e18 spokechain tokens
    function test_AssetReserves_unlockAsset() public {
        uint amount = 100e18;
        uint nonce = 0;
        uint32 spokeChainId = 1;
        uint32 hubChainId = 2;
        deal(address(spokeChainToken), address(assetReserves), amount);

        //------Hub Chain Flow------//
        vm.chainId(hubChainId);
        deal(address(mirrorToken), user, amount);
        vm.startPrank(user);
        mirrorToken.approve(address(liquidityProjector), amount);
        liquidityProjector.burnToken(spokeChainId, address(mirrorToken), amount, user);
        vm.stopPrank();
        //------Spoke Chain Flow------//
        vm.chainId(spokeChainId);
        bytes32 intentId = SlowBridgeIntentsLibrary.calculateUnlockTokenIntentId(
            nonce,
            spokeChainId,
            user,
            address(spokeChainToken),
            amount,
            user
        );
        bytes32 eventHash = TokenEventLibrary.calculateUnlockTokenEventHashForRemoteChain(
            TokenEventLibrary.UnlockTokenEvent(
                intentId
            ),
            spokeChainId
        );
        assertTrue(eventVerifier.verify(eventHash));

        assetReserves.unlockAsset(nonce, user, user, address(spokeChainToken), amount);
        vm.prank(user);
        assert(spokeChainToken.transferFrom(address(assetReserves), user, amount));
    }
}