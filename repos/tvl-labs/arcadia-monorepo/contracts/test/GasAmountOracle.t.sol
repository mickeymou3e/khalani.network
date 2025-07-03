// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {Test} from "forge-std/Test.sol";
import {GasAmountOracle} from "../src/event_system/GasAmountOracle.sol";

contract GasAmountOracleTest is Test {
    GasAmountOracle public oracle;
    address public owner;
    address public user;
    // Test constants
    uint32 constant FUJI_CHAIN_ID = 43113;
    uint32 constant BNB_TESTNET_CHAIN_ID = 17000;
    uint32 constant SELECTOR = 1098411886;
    uint256 constant INITIAL_GAS_AMOUNT = 500000;
    uint256 constant NEW_GAS_AMOUNT = 750000;

    function setUp() public {
        owner = address(this);
        user = address(0x1234567890);
        oracle = new GasAmountOracle();
    }

    function test_InitialGasAmounts() public {
        assertEq(oracle.gasAmount(FUJI_CHAIN_ID, SELECTOR), INITIAL_GAS_AMOUNT, "Incorrect initial gas amount for Fuji");
        assertEq(
            oracle.gasAmount(BNB_TESTNET_CHAIN_ID, SELECTOR),
            INITIAL_GAS_AMOUNT,
            "Incorrect initial gas amount for BNB testnet"
        );
    }

    function test_SetGasAmount() public {
        oracle.setGasAmount(FUJI_CHAIN_ID, SELECTOR, NEW_GAS_AMOUNT);
        assertEq(oracle.getGasAmount(FUJI_CHAIN_ID, SELECTOR), NEW_GAS_AMOUNT, "Gas amount not updated correctly");
    }

    function test_GetGasAmount() public {
        uint256 amount = oracle.getGasAmount(FUJI_CHAIN_ID, SELECTOR);
        assertEq(amount, INITIAL_GAS_AMOUNT, "Retrieved gas amount does not match expected value");
    }

    function testRevertWhenSettingGasAmountNonOwner() public {
        vm.prank(user);
        vm.expectRevert("Ownable: caller is not the owner");
        oracle.setGasAmount(FUJI_CHAIN_ID, SELECTOR, NEW_GAS_AMOUNT);
    }

    function test_SetGasAmountNewChainPair() public {
        uint32 newSourceChain = 1;
        uint32 newDestChain = 2;

        // Initially should be 0
        assertEq(oracle.getGasAmount(newSourceChain, newDestChain), 0, "New chain pair should initially return 0");
        // Set new value
        oracle.setGasAmount(newSourceChain, newDestChain, NEW_GAS_AMOUNT);

        // Verify new value
        assertEq(oracle.getGasAmount(newSourceChain, newDestChain), NEW_GAS_AMOUNT, "New chain pair not set correctly");
    }
}
