// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/hub/IntentBook.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/types/Intent.sol";
import "../src/types/Events.sol";
import "../src/types/Solution.sol";
import "../src/types/Receipt.sol";
import "../src/hub/MTokenManager.sol";
import "../src/hub/MToken.sol";
import "../src/common/AIPEventPublisher.sol";
import "../src/common/AIPEventHandler.sol";
import "../src/common/EventProver.sol";
import "../src/common/EventVerifier.sol";
import "../src/hub/ReceiptManager.sol";
import "../src/modules/MTokenRegistry.sol";
import "../src/modules/AuthorizationManager.sol";
import {Utilities} from "./Utilities.sol";
import {AbstractAIPEventHandler} from "../src/common/AbstractAIPEventHandler.sol";
import {MockSpokeChainAIPEventHandler} from "./MockSpokeChainAIPEventHandler.sol";
import {MockArcadiaAIPEventHandler} from "./MockArcadiaAIPEventHandler.sol";
import {Receipt as ReceiptStruct} from "../src/hub/ReceiptManager.sol";
import {console} from "forge-std/console.sol";
import {InterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/hooks/igp/InterchainGasPaymaster.sol";
import {SignatureLib} from "../src/libraries/SignatureLib.sol";
import {SolutionLib} from "../src/libraries/SolutionLib.sol";

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

contract SystemState is Utilities {
    IntentBook intentBook;
    MToken mToken;
    MockERC20 spokeToken;
    MToken mToken2;
    MockERC20 spokeToken2;
    AIPEventPublisher arcadiaEventPublisher;
    MockArcadiaAIPEventHandler arcadiaEventHandler;
    MTokenManager mTokenManager;
    ReceiptManager receiptManager;
    EventProver arcadiaEventProver; // arcadia == arcadia chain == destinationChain
    EventVerifier spokeEventVerifier; // spoke == spoke chain == originChain
    EventProver spokeEventProver;
    EventVerifier arcadiaEventVerifier;
    MockSpokeChainAIPEventHandler spokeEventHandler;
    AIPEventPublisher spokeEventPublisher;
    AssetReserves spokeAssetReserves;
    MTokenRegistry mTokenRegistry;
    IInterchainGasPaymaster interchainGasPaymaster;
    SolutionLib solutionLib;

    address owner = address(0x1);
    address user1 = address(0x2);
    address user2 = address(0x3);
    address public addr;
    uint256 public key;
    address public addr2;
    uint256 public key2;
    address mTokenAddress;

    function setUp() public override {
        super.setUp();
        vm.startPrank(owner);
        interchainGasPaymaster = new InterchainGasPaymaster();

        arcadiaEventHandler = new MockArcadiaAIPEventHandler(address(destinationMailbox), owner);
        spokeEventHandler =
            new MockSpokeChainAIPEventHandler(address(originMailbox), address(arcadiaEventVerifier), owner);

        arcadiaEventVerifier = new EventVerifier(address(destinationMailbox), address(arcadiaEventHandler));
        spokeEventVerifier = new EventVerifier(address(originMailbox), address(spokeEventHandler));
        arcadiaEventHandler.registerEventVerifier(address(arcadiaEventVerifier));
        spokeEventHandler.registerEventVerifier(address(spokeEventVerifier));

        // Event Prover on Arcadia chain (destinationChain)
        arcadiaEventProver = new EventProver(
            address(destinationMailbox), address(spokeEventVerifier), originChainId, address(interchainGasPaymaster), address(0)
        );
        // Event Prover on Spoke chain (originChain)
        spokeEventProver = new EventProver(
            address(originMailbox), address(arcadiaEventVerifier), destinationChainId, address(interchainGasPaymaster), address(0)
        );

        arcadiaEventPublisher = new AIPEventPublisher(address(arcadiaEventProver));
        spokeEventPublisher = new AIPEventPublisher(address(spokeEventProver));
        spokeEventProver.addEventPublisher(address(spokeEventPublisher));
        arcadiaEventProver.addEventPublisher(address(arcadiaEventPublisher));
        mTokenManager = new MTokenManager();
        mTokenRegistry = new MTokenRegistry(address(mTokenManager));
        mTokenManager.setTokenRegistry(address(mTokenRegistry));
        solutionLib = new SolutionLib();
        intentBook = new IntentBook(address(solutionLib));
        receiptManager = new ReceiptManager(address(intentBook), address(mTokenManager));
        intentBook.setReceiptManager(address(receiptManager));
        intentBook.setTokenManager(address(mTokenManager));
        mTokenManager.setIntentBook(address(intentBook));
        mTokenManager.setReceiptManager(address(receiptManager));
        spokeToken = new MockERC20("SpokeToken", "STK", 18);
        spokeToken2 = new MockERC20("SpokeToken2", "STK2", 18);

        mTokenAddress = mTokenRegistry.createMToken("MockToken", "MTK", address(spokeToken), originChainId);
        mToken = MToken(mTokenAddress);
        mToken2 = MToken(mTokenRegistry.createMToken("MockToken2", "MTK2", address(spokeToken2), originChainId));

        spokeToken.mint(user1, 1000 * 10 ** 18);
        spokeToken.mint(user2, 1000 * 10 ** 18);

        (addr, key) = makeAddrAndKey("1337");
        user1 = addr;
        (addr2, key2) = makeAddrAndKey("1338");
        user2 = addr2;
        mTokenManager.addAuthorizedMinter(user1);
        mTokenManager.addAuthorizedMinter(user2);
        mTokenManager.addAuthorizedMinter(address(receiptManager));
        mTokenManager.addAuthorizedMinter(address(intentBook));
        mTokenManager.addAuthorizedMinter(address(mTokenManager));

        vm.stopPrank();

        vm.startPrank(user1);
        mTokenManager.mintMToken(user1, mTokenAddress, 1000 * 10 ** 18);

        uint256 userBalance = mToken.balanceOf(user1);
        assertEq(userBalance, 1000 * 10 ** 18, "User1 balance should be 1000 MTokens");
        vm.stopPrank();
        vm.startPrank(user2);
        mTokenManager.mintMToken(user2, address(mToken2), 1000 * 10 ** 18);

        uint256 userBalance2 = mToken2.balanceOf(user2);
        assertEq(userBalance2, 1000 * 10 ** 18, "User2 balance should be 1000 MTokens");
        vm.stopPrank();
    }
}
