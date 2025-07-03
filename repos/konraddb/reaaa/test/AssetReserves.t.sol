// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "../src/spoke/AssetReserves.sol";
import "../src/types/Intent.sol";
import "../src/types/Events.sol";
import "../src/common/AIPEventPublisher.sol";
import "../src/common/AIPEventHandler.sol";
import "../src/common/EventProver.sol";
import "../src/common/EventVerifier.sol";
import {Utilities} from "./Utilities.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {MockInterchainGasPaymaster} from "./MockInterchainGasPaymaster.sol";
import {AbstractAIPEventHandler} from "../src/common/AbstractAIPEventHandler.sol";
import {GasAmountOracle} from "../src/common/GasAmountOracle.sol";
import {MockSpokeChainAIPEventHandler} from "./MockSpokeChainAIPEventHandler.sol";
import {MockArcadiaAIPEventHandler} from "./MockArcadiaAIPEventHandler.sol";
import {IPermit2} from "../src/interfaces/IPermit2.sol";
import {Permit2Clone} from "./Permit2Clone.sol";

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

contract AssetReservesTest is Test {
    MockMailbox originMailbox;
    MockMailbox destinationMailbox;
    MockERC20 spokeToken;
    MockERC20 spokeToken2;
    AIPEventPublisher arcadiaEventPublisher;
    MockArcadiaAIPEventHandler arcadiaEventHandler;
    AssetReserves assetReserves;
    EventProver arcadiaEventProver;
    EventVerifier spokeEventVerifier;
    EventProver spokeEventProver;
    EventVerifier arcadiaEventVerifier;
    MockSpokeChainAIPEventHandler spokeEventHandler;
    AIPEventPublisher spokeEventPublisher;
    AssetReserves spokeAssetReserves;
    Permit2Clone permit2;
    Utilities utilities;
    MockInterchainGasPaymaster interchainGasPaymaster;
    GasAmountOracle gasAmountOracle;

    uint32 constant originChainId = 1;
    uint32 constant destinationChainId = 2;

    address mTokenAddress;
    uint256 ownerKey;
    address owner;
    uint256 userKey;
    address user1;
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    function setUp() public {
        vm.chainId(1);
        utilities = new Utilities();
        ownerKey = utilities._randomUint256();
        userKey = ownerKey = utilities._randomUint256();
        user1 = vm.addr(userKey);

        vm.startPrank(owner);

        interchainGasPaymaster = new MockInterchainGasPaymaster();
        gasAmountOracle = new GasAmountOracle();
        gasAmountOracle.setGasAmount(originChainId, destinationChainId, 500000);

        originMailbox = new MockMailbox(originChainId);
        destinationMailbox = new MockMailbox(destinationChainId);
        originMailbox.addRemoteMailbox(destinationChainId, destinationMailbox);

        arcadiaEventVerifier = new EventVerifier(address(destinationMailbox), address(spokeEventHandler));
        spokeEventProver = new EventProver(address(originMailbox), address(arcadiaEventVerifier), destinationChainId, address(interchainGasPaymaster), address(gasAmountOracle));

        spokeEventPublisher = new AIPEventPublisher(address(spokeEventProver));
        spokeEventPublisher.registerEventProver(originChainId, address(spokeEventProver));
        spokeEventHandler =
            new MockSpokeChainAIPEventHandler(address(originMailbox), address(arcadiaEventVerifier), owner);
        spokeEventVerifier = new EventVerifier(address(originMailbox), address(spokeEventHandler));
        spokeEventHandler.registerEventVerifier(address(spokeEventVerifier));
        permit2 = new Permit2Clone();
        assetReserves =
            new AssetReserves(owner, address(spokeEventPublisher), address(spokeEventHandler), address(permit2));
        spokeToken = new MockERC20("SpokeToken", "STK", 18);
        spokeToken2 = new MockERC20("SpokeToken2", "STK", 18);

        assetReserves.addAsset(address(spokeToken));
        assetReserves.addAsset(address(spokeToken2));
        assertEq(assetReserves.isSupportedAsset(address(spokeToken)), true, "spoken token is supported");
        assertEq(assetReserves.isSupportedAsset(address(spokeToken2)), true, "spoken token2 is supported");

        spokeToken.mint(user1, 1000);
        spokeToken2.mint(user1, 1000);
        vm.stopPrank();

        vm.startPrank(user1);
        spokeToken.approve(address(permit2), type(uint256).max);
        spokeToken2.approve(address(permit2), type(uint256).max);
        vm.deal(user1, 1 ether);
        vm.stopPrank();
    }

    function testDeposit() public {
        vm.startPrank(user1);
        spokeToken.approve(address(assetReserves), 1000);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(spokeToken), 1000, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        uint256 gasAmount = spokeEventProver.estimateGasAmount();
        uint256 gasPayment = interchainGasPaymaster.quoteGasPayment(destinationChainId, gasAmount);

        assetReserves.deposit{value: gasPayment}(address(spokeToken), 1000, permitNonce, deadline, sig);
        assertEq(assetReserves.reserves(address(spokeToken)), 1000);
        vm.stopPrank();
    }

    function testCannotDepositOtherToken() public {
        vm.startPrank(user1);
        spokeToken.approve(address(assetReserves), 1000);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(spokeToken), 1000, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        vm.expectRevert(Permit2Clone.InvalidSigner.selector);
        assetReserves.deposit(address(spokeToken2), 1000, permitNonce, deadline, sig);
        vm.stopPrank();
    }

    function testUnauthorizedWithdrawReverts() public {
        vm.startPrank(user1);
        spokeToken.approve(address(assetReserves), 1000);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(spokeToken), 1000, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        string memory accountStr = Strings.toHexString(uint160(user1), 20);
        string memory roleStr = Strings.toHexString(uint256(WITHDRAW_ROLE), 32);
        string memory expectedRevertMessage =
            string(abi.encodePacked("AccessControl: account ", accountStr, " is missing role ", roleStr));
        bytes memory expectedRevertBytes = abi.encodePacked(expectedRevertMessage);

        uint256 gasAmount = spokeEventProver.estimateGasAmount();
        uint256 gasPayment = interchainGasPaymaster.quoteGasPayment(destinationChainId, gasAmount);

        assetReserves.deposit{value: gasPayment}(address(spokeToken), 1000, permitNonce, deadline, sig);
        vm.expectRevert(expectedRevertBytes);
        assetReserves.withdraw(address(spokeToken), 500);
        vm.stopPrank();
    }

    function testAuthorizedWithdraw() public {
        vm.startPrank(owner);
        assetReserves.grantRole(WITHDRAW_ROLE, user1);
        vm.stopPrank();

        vm.startPrank(user1);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(spokeToken), 1000, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        uint256 gasAmount = spokeEventProver.estimateGasAmount();
        uint256 gasPayment = interchainGasPaymaster.quoteGasPayment(destinationChainId, gasAmount);

        assetReserves.deposit{value: gasPayment}(address(spokeToken), 1000, permitNonce, deadline, sig);

        uint256 reserves = assetReserves.getReserves(address(spokeToken));
        assertEq(reserves, 1000);
        assertEq(spokeToken.balanceOf(user1), 0);
        assertEq(spokeToken.balanceOf(address(assetReserves)), 1000);
        assetReserves.withdraw(address(spokeToken), 500);
        assertEq(spokeToken.balanceOf(user1), 500);
        assertEq(assetReserves.reserves(address(spokeToken)), 500);
        vm.stopPrank();
    }

    function testWithdrawInsufficientReservesReverts() public {
        vm.startPrank(owner);
        assetReserves.grantRole(WITHDRAW_ROLE, user1);

        vm.startPrank(user1);
        spokeToken.approve(address(assetReserves), 1000);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(spokeToken), 1000, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        uint256 gasAmount = spokeEventProver.estimateGasAmount();
        uint256 gasPayment = interchainGasPaymaster.quoteGasPayment(destinationChainId, gasAmount);

        assetReserves.deposit{value: gasPayment}(address(spokeToken), 1000, permitNonce, deadline, sig);

        vm.expectRevert("AssetReserves: insufficient reserves");
        assetReserves.withdraw(address(spokeToken), 1500);
        vm.stopPrank();
    }

    function testCrossChainWithdrawal() public {
        vm.startPrank(user1);
        spokeToken.approve(address(assetReserves), 1000);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(spokeToken), 1000, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        uint256 gasAmount = spokeEventProver.estimateGasAmount();
        uint256 gasPayment = interchainGasPaymaster.quoteGasPayment(destinationChainId, gasAmount);

        assetReserves.deposit{value: gasPayment}(address(spokeToken), 1000, permitNonce, deadline, sig);
        vm.stopPrank();

        vm.startPrank(address(spokeEventHandler));
        assetReserves.handleCrossChainWithdrawal(address(spokeToken), user1, 500);
        vm.stopPrank();

        assertEq(spokeToken.balanceOf(user1), 500);
        assertEq(assetReserves.reserves(address(spokeToken)), 500);
    }

    function testRevokeRolePreventsWithdraw() public {
        vm.startPrank(owner);
        assetReserves.grantRole(WITHDRAW_ROLE, user1);

        vm.startPrank(user1);
        spokeToken.approve(address(assetReserves), 1000);

        uint256 permitNonce = 1;
        uint256 deadline = block.timestamp + 1 hours;
        IPermit2.PermitTransferFrom memory permit =
            utilities.createPermitTransferFrom(address(spokeToken), 1000, permitNonce, deadline);
        bytes memory sig = utilities._signPermit(permit, address(assetReserves), userKey);

        uint256 gasAmount = spokeEventProver.estimateGasAmount();
        uint256 gasPayment = interchainGasPaymaster.quoteGasPayment(destinationChainId, gasAmount);

        assetReserves.deposit{value: gasPayment}(address(spokeToken), 1000, permitNonce, deadline, sig);
        assetReserves.withdraw(address(spokeToken), 500);

        vm.stopPrank();
        vm.startPrank(owner);
        assetReserves.revokeRole(WITHDRAW_ROLE, user1);
        vm.stopPrank();

        vm.startPrank(user1);
        string memory accountStr = Strings.toHexString(uint160(user1), 20);
        string memory roleStr = Strings.toHexString(uint256(WITHDRAW_ROLE), 32);
        string memory expectedRevertMessage =
            string(abi.encodePacked("AccessControl: account ", accountStr, " is missing role ", roleStr));
        bytes memory expectedRevertBytes = abi.encodePacked(expectedRevertMessage);
        vm.expectRevert(expectedRevertBytes);
        assetReserves.withdraw(address(spokeToken), 500);
        vm.stopPrank();
    }
}
