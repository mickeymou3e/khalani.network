// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "forge-std/Test.sol";
import "../src/hub/IntentBook.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../src/types/Intent.sol";
import "../src/types/Events.sol";
import "../src/types/Solution.sol";
import "../src/types/Receipt.sol";
import "../src/hub/MTokenManager.sol";
import "../src/hub/MToken.sol";
import "../src/hub/ReceiptManager.sol";
import "../src/modules/MTokenRegistry.sol";
import {Utilities} from "./Utilities.utils.sol";
import {Receipt as ReceiptStruct} from "../src/hub/ReceiptManager.sol";
import {console} from "forge-std/console.sol";
import {SignatureLib} from "../src/libraries/SignatureLib.sol";
import {SolutionLib} from "../src/libraries/SolutionLib.sol";
import {AccessManager} from "@oz5/contracts/access/manager/AccessManager.sol";
import {RolesLib} from "../src/libraries/RolesLib.sol";

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
    IntentBook public intentBook;
    MToken public mToken;
    MockERC20 public spokeToken;
    MToken public mToken2;
    MockERC20 public spokeToken2;
    MTokenManager public mTokenManager;
    ReceiptManager public receiptManager;
    MTokenRegistry public mTokenRegistry;
    SolutionLib public solutionLib;
    AccessManager public accessManager;

    address public owner = address(0x1);
    address public user1 = address(0x2);
    address public user2 = address(0x3);
    address public contractsManager = makeAddr("contractsManager");
    address public solver = makeAddr("solver");
    address public medusa = makeAddr("medusa");
    address public mtokenMinter = makeAddr("mtokenMinter");

    address public addr;
    uint256 public key;
    address public addr2;
    uint256 public key2;
    address mTokenAddress;

    function setUp() public override {
        super.setUp();
        vm.startPrank(owner);
        accessManager = new AccessManager(owner);
        accessManager.grantRole(RolesLib.CONTRACTS_MANAGER_ROLE, contractsManager, 0);
        accessManager.grantRole(RolesLib.INTENT_UPDATER_ROLE, medusa, 0);
        accessManager.grantRole(RolesLib.INTENT_PUBLISHER_ROLE, medusa, 0);
        accessManager.grantRole(RolesLib.MTOKEN_MINTER_ROLE, mtokenMinter, 0);
        accessManager.grantRole(RolesLib.MTOKEN_REMOTE_WITHDRAWER_ROLE, medusa, 0);
        accessManager.grantRole(RolesLib.INTENT_CANCELLER_ROLE, medusa, 0);
        mTokenManager = new MTokenManager(address(accessManager));
        mTokenRegistry = new MTokenRegistry(address(mTokenManager), address(accessManager));
        solutionLib = new SolutionLib();
        intentBook = new IntentBook(address(solutionLib), address(accessManager));
        receiptManager = new ReceiptManager(address(intentBook), address(mTokenManager), address(accessManager));

        bytes4[] memory mTokenRegistrySelectors = new bytes4[](4);
        bytes4[] memory mTokenManagerSelectors = new bytes4[](5);
        bytes4[] memory mTokenManagerWithdrawSelectors = new bytes4[](4);
        bytes4[] memory intentBookUpdaterSelectors = new bytes4[](4);
        bytes4[] memory intentBookPublisherSelectors = new bytes4[](4);
        bytes4[] memory intentBookCancellerSelectors = new bytes4[](2);
        bytes4[] memory intentBookSelectors = new bytes4[](5);
        bytes4[] memory mtokenMinterSelectors = new bytes4[](4);

        mTokenRegistrySelectors[0] = mTokenRegistry.createMToken.selector;
        mTokenRegistrySelectors[1] = mTokenRegistry.pauseMToken.selector;
        mTokenRegistrySelectors[2] = mTokenRegistry.unpauseMToken.selector;
        mTokenRegistrySelectors[3] = mTokenRegistry.destroyMToken.selector;
        accessManager.setTargetFunctionRole(
            address(mTokenRegistry), mTokenRegistrySelectors, RolesLib.CONTRACTS_MANAGER_ROLE
        );

        mTokenManagerSelectors[0] = mTokenManager.setIntentBook.selector;
        mTokenManagerSelectors[1] = mTokenManager.setReceiptManager.selector;
        mTokenManagerSelectors[2] = mTokenManager.setTokenRegistry.selector;
        mTokenManagerSelectors[3] = mTokenManager.setWithdrawalHandler.selector;
        mTokenManagerWithdrawSelectors[0] = mTokenManager.withdrawMToken.selector;
        mTokenManagerWithdrawSelectors[1] = mTokenManager.withdrawIntentBalance.selector;

        mtokenMinterSelectors[0] = mTokenManager.mintMToken.selector;
        accessManager.setTargetFunctionRole(address(mTokenManager), mtokenMinterSelectors, RolesLib.MTOKEN_MINTER_ROLE);
        accessManager.setTargetFunctionRole(
            address(mTokenManager), mTokenManagerSelectors, RolesLib.CONTRACTS_MANAGER_ROLE
        );

        accessManager.setTargetFunctionRole(
            address(mTokenManager), mTokenManagerWithdrawSelectors, RolesLib.MTOKEN_REMOTE_WITHDRAWER_ROLE
        );
        intentBookUpdaterSelectors[0] = intentBook.lockIntent.selector;

        intentBookUpdaterSelectors[1] = intentBook.solve.selector;

        intentBookPublisherSelectors[0] = intentBook.publishIntent.selector;

        intentBookSelectors[0] = intentBook.setReceiptManager.selector;
        intentBookSelectors[1] = intentBook.setTokenManager.selector;
        intentBookSelectors[2] = intentBook.setMinimumFillPercentage.selector;
        intentBookSelectors[3] = intentBook.setMaxLockDuration.selector;
        intentBookSelectors[4] = intentBook.addPublisher.selector;

        intentBookCancellerSelectors[0] = intentBook.cancelIntent.selector;
        intentBookCancellerSelectors[1] = intentBook.cancelIntentForAuthor.selector;

        accessManager.setTargetFunctionRole(address(intentBook), intentBookSelectors, RolesLib.CONTRACTS_MANAGER_ROLE);

        accessManager.setTargetFunctionRole(
            address(intentBook), intentBookPublisherSelectors, RolesLib.INTENT_PUBLISHER_ROLE
        );

        accessManager.setTargetFunctionRole(
            address(intentBook), intentBookUpdaterSelectors, RolesLib.INTENT_UPDATER_ROLE
        );

        accessManager.setTargetFunctionRole(
            address(intentBook), intentBookCancellerSelectors, RolesLib.INTENT_CANCELLER_ROLE
        );

        vm.startPrank(contractsManager);
        mTokenManager.setTokenRegistry(address(mTokenRegistry));
        intentBook.setReceiptManager(address(receiptManager));
        intentBook.setTokenManager(address(mTokenManager));
        mTokenManager.setIntentBook(address(intentBook));
        mTokenManager.setReceiptManager(address(receiptManager));
        intentBook.addPublisher(medusa);
        vm.stopPrank();

        vm.startPrank(owner);

        spokeToken = new MockERC20("SpokeToken", "STK", 18);
        spokeToken2 = new MockERC20("SpokeToken2", "STK2", 18);

        vm.stopPrank();

        vm.startPrank(contractsManager);

        mTokenAddress = mTokenRegistry.createMToken("MockToken", "MTK", address(spokeToken), originChainId);
        mToken = MToken(mTokenAddress);
        mToken2 = MToken(mTokenRegistry.createMToken("MockToken2", "MTK2", address(spokeToken2), originChainId));

        spokeToken.mint(user1, 1000 * 10 ** 18);
        spokeToken.mint(user2, 1000 * 10 ** 18);

        (addr, key) = makeAddrAndKey("1337");
        user1 = addr;
        (addr2, key2) = makeAddrAndKey("1338");
        user2 = addr2;
        vm.stopPrank();
        vm.startPrank(mtokenMinter);

        mTokenManager.mintMToken(user1, mTokenAddress, 1000 * 10 ** 18);

        uint256 userBalance = mToken.balanceOf(user1);
        assertEq(userBalance, 1000 * 10 ** 18, "User1 balance should be 1000 MTokens");

        mTokenManager.mintMToken(user2, address(mToken2), 1000 * 10 ** 18);

        uint256 userBalance2 = mToken2.balanceOf(user2);
        assertEq(userBalance2, 1000 * 10 ** 18, "User2 balance should be 1000 MTokens");
        vm.stopPrank();
    }
}
