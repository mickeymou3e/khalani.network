// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import "forge-std/Test.sol";

import "../../src/event_system/apps/bridge/AssetReserves.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {MockERC20} from "./MockERC20.sol";
import {IPermit2} from "../../src/interfaces/IPermit2.sol";
import {Permit2Clone} from "../Permit2Clone.sol";
import {SpokeHandler} from "../../src/event_system/SpokeHandler.sol";
import {SpokePublisher} from "../../src/event_system/SpokePublisher.sol";
import {Utilities} from "../Utilities.utils.sol";
import {MockInterchainGasPaymaster} from "../MockInterchainGasPaymaster.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {EventVerifier} from "../../src/event_system/EventVerifier.sol";
import {HubHandler} from "../../src/event_system/HubHandler.sol";
import {EventProver} from "../../src/event_system/EventProver.sol";
import {XChainEvent, MTokenWithdrawal} from "../../src/types/Events.sol";
import {ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH} from "../../src/types/Events.sol";

contract MockGasOracle {
    function getGasAmount(uint32 sourceChainId, uint32 destinationChainId) external view returns (uint256) {
        return 100000;
    }
}

contract AssetReservesTest is Test {
    AssetReserves public assetReserves;
    MockERC20 public token;
    MockERC20 public unsupportedToken;
    MockERC20 sixDecimalToken;
    Permit2Clone permit2;
    SpokePublisher spokePublisher;
    SpokeHandler spokeHandler;
    Utilities utilities;
    MockMailbox spokeToHubOriginMailbox;
    MockMailbox spokeToHubDestinationMailbox;
    EventVerifier eventVerifierSpokeToHub;
    HubHandler hubHandler;
    MockGasOracle gasOracle;

    address public admin = address(0xA11CE);
    address public user = address(0xBEEF);
    address public agent = address(0xDEAD);

    bytes32 depositEventTypeHash = ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH;
    bytes32 depositEventHash;

    uint256 userKey;
    uint32 spokeChainId = 1;
    uint32 hubChainId = 2;

    bytes32 public constant REFUND_AGENT_ROLE = keccak256("REFUND_AGENT_ROLE");
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    function setUp() public {
        vm.chainId(1);
        utilities = new Utilities();
        admin = makeAddr("admin");
        userKey = utilities._randomUint256();
        user = vm.addr(userKey);

        // Deploy tokens
        token = new MockERC20("TestToken", "TT", 18);
        unsupportedToken = new MockERC20("Unsupported", "UNK", 18);
        sixDecimalToken = new MockERC20("SixDecimalToken", "SDT", 6);

        // Deploy Permit2 & publishers
        permit2 = new Permit2Clone();
        spokePublisher = new SpokePublisher(hubChainId);
        hubHandler = new HubHandler();

        // Setup mailbox
        spokeToHubOriginMailbox = new MockMailbox(spokeChainId);
        spokeToHubDestinationMailbox = new MockMailbox(hubChainId);
        spokeToHubOriginMailbox.addRemoteMailbox(hubChainId, spokeToHubDestinationMailbox);
        eventVerifierSpokeToHub = new EventVerifier(address(spokeToHubDestinationMailbox), address(hubHandler));

        MockInterchainGasPaymaster interchainGasPaymaster = new MockInterchainGasPaymaster();
        gasOracle = new MockGasOracle();
        EventProver proverSpokeToHub = new EventProver(
            address(spokeToHubOriginMailbox),
            address(eventVerifierSpokeToHub),
            hubChainId,
            address(interchainGasPaymaster),
            address(gasOracle)
        );

        spokeHandler = new SpokeHandler(2);

        // Deploy AssetReserves
        assetReserves = new AssetReserves(admin, address(spokePublisher), address(spokeHandler), address(permit2));

        // Register deposit event
        depositEventHash = keccak256(abi.encode(address(assetReserves), depositEventTypeHash));
        spokePublisher.addProducer(address(assetReserves));
        spokePublisher.registerEventOnProducer(address(assetReserves), depositEventHash);
        proverSpokeToHub.addEventPublisher(address(spokePublisher));
        spokePublisher.registerEventProver(hubChainId, address(proverSpokeToHub));

        vm.startPrank(admin);
        assetReserves.addAsset(address(token));
        assetReserves.addAsset(address(sixDecimalToken));
        vm.stopPrank();

        // Mint tokens to user
        token.mint(user, 10000e18);
        sixDecimalToken.mint(user, 1000000);
        unsupportedToken.mint(user, 5000e18);

        // Approve permit2
        vm.startPrank(user);
        token.approve(address(permit2), type(uint256).max);
        unsupportedToken.approve(address(permit2), type(uint256).max);
        sixDecimalToken.approve(address(permit2), type(uint256).max);
        vm.deal(user, 2 ether);
        vm.stopPrank();
    }

    // Helper function to deposit
    function deposit(uint256 amount, MockERC20 token, address recipient) public {
        token.approve(address(assetReserves), amount);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(token), amount, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        assetReserves.deposit{value: 1 ether}(address(token), amount, hubChainId, permitNonce, deadline, recipient, sig);
    }

    function testDepositWithStandardToken() public {
        vm.startPrank(user);
        deposit(1_100 ether, token, user);
        assertEq(
            assetReserves.reserves(address(token)), 1_100 ether, "Reserves should be 1100 ether for 18 decimal token"
        );
        assertEq(token.balanceOf(address(assetReserves)), 1_100 ether, "Contract balance should match reserves");
        vm.stopPrank();
    }

    function testWithdrawWithStandardToken() public {
        vm.startPrank(user);
        deposit(1_000 ether, token, user);
        vm.stopPrank();
        vm.startPrank(admin);
        uint256 balanceBefore = token.balanceOf(user);
        assetReserves.withdrawTo(address(token), 500 ether, user);

        assertEq(token.balanceOf(user), balanceBefore + 500 ether, "User should receive 500 ether");
        assertEq(assetReserves.reserves(address(token)), 500 ether, "Reserves should have 500 ether remaining");
        assertEq(token.balanceOf(address(assetReserves)), 500 ether, "Contract balance should match reserves");
        vm.stopPrank();
    }

    function testDepositWith6DecimalToken() public {
        vm.startPrank(user);
        uint256 depositAmount = 1_000_000; // 1M units in 6 decimals
        deposit(depositAmount, sixDecimalToken, user);

        assertEq(
            assetReserves.reserves(address(sixDecimalToken)),
            depositAmount * 10 ** 12,
            "Reserves should be 1M * 10^12 (converted to 18 decimals)"
        );
        assertEq(
            sixDecimalToken.balanceOf(address(assetReserves)),
            depositAmount,
            "Contract balance should be 1M in 6 decimals"
        );
        vm.stopPrank();
    }

    function testWithdrawWith6DecimalToken() public {
        vm.startPrank(user);
        uint256 depositAmount = 1_000_000; // 1M units in 6 decimals
        deposit(depositAmount, sixDecimalToken, user);

        uint256 withdrawAmount = 500_000 * 10 ** 12; // 500k in 18 decimals

        vm.stopPrank();
        vm.startPrank(admin);
        uint256 balanceBefore = sixDecimalToken.balanceOf(user);
        console.log("balanceBefore", balanceBefore);
        assetReserves.withdrawTo(address(sixDecimalToken), withdrawAmount, user);

        assertEq(
            sixDecimalToken.balanceOf(user), balanceBefore + 500_000, "User should receive 500k units in 6 decimals"
        );
        assertEq(
            assetReserves.reserves(address(sixDecimalToken)),
            500_000 * 10 ** 12,
            "Reserves should have 500k * 10^12 remaining (in 18 decimals)"
        );
        assertEq(
            sixDecimalToken.balanceOf(address(assetReserves)), 500_000, "Contract balance should be 500k in 6 decimals"
        );
        vm.stopPrank();
    }

    function testAgentRefundUser() public {
        vm.startPrank(user);
        deposit(2_000 ether, token, user);
        vm.stopPrank();

        vm.startPrank(admin);
        assetReserves.refundUser(user, address(token), 1_000 ether);
        vm.stopPrank();

        uint256 rAfter = assetReserves.getReserves(address(token));
        assertEq(rAfter, 1_000 ether, "Reserves should reduce by 1,000");
    }

    function testRefundUserRevertUnauthorized() public {
        vm.startPrank(user);
        deposit(500 ether, token, user);
        vm.stopPrank();

        vm.startPrank(agent);
        vm.expectRevert();
        assetReserves.refundUser(user, address(token), 500 ether);
        vm.stopPrank();
    }

    function testBalancesMatch() public {
        vm.startPrank(user);
        deposit(1_000 ether, token, user);
        vm.stopPrank();

        uint256 contractBalance = token.balanceOf(address(assetReserves));
        uint256 reservesBalance = assetReserves.getReserves(address(token));
        assertEq(contractBalance, reservesBalance, "Actual contract balance should match reserves");

        vm.startPrank(admin);
        assetReserves.refundUser(address(user), address(token), 400 ether);
        vm.stopPrank();

        uint256 contractBalance2 = token.balanceOf(address(assetReserves));
        uint256 reservesBalance2 = assetReserves.getReserves(address(token));
        assertEq(contractBalance2, reservesBalance2, "Balance after refund should still match");
    }

    // Test depositing a non-supported asset
    function testNonSupportedAssetReverts() public {
        vm.startPrank(user);

        uint256 amount = 500 ether;
        unsupportedToken.approve(address(assetReserves), amount);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;

        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(unsupportedToken), amount, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        vm.expectRevert(bytes("AssetReserves: unsupported asset"));
        assetReserves.deposit{value: 1 ether}(
            address(unsupportedToken), amount, hubChainId, permitNonce, deadline, user, sig
        );

        vm.stopPrank();
    }

    // Test insufficient reserves on refund
    function testInsufficientReservesRevertsOnRefund() public {
        vm.startPrank(admin);
        vm.expectRevert(bytes("AssetReserves: insufficient reserves"));
        assetReserves.refundUser(user, address(token), 100 ether);
        vm.stopPrank();
    }

    function testWithdrawUnauthorized() public {
        vm.startPrank(user);
        deposit(1000, token, user);
        vm.stopPrank();

        vm.startPrank(agent);
        vm.expectRevert("Ownable: caller is not the owner");
        assetReserves.withdraw(address(token), 500 ether);
        vm.stopPrank();
    }
}
