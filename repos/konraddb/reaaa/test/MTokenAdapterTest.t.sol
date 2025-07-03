// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";

contract MTokenAdapterTest is Test {
    // Contract and addresses
    address constant contractAddress = 0xBEf04f9789E48470F3ae8e0D7AA3D9ab2C7D7153;
    MTokenCrossChainAdapter crossChainAdapter;
    MTokenCrossChainAdapter localCrossChainAdapter;

    address constant owner = 0xc13113E56E00050327Be3AD164185103541f1903;
    bytes32 constant withdrawalEventTypeHash =
        keccak256("MTokenWithdrawal(address token, uint256 amount, address withdrawer)");

    function setUp() public {
        vm.deal(owner, 1 ether);
        vm.startPrank(owner);
        // Attach to deployed contract
        crossChainAdapter = MTokenCrossChainAdapter(contractAddress);
        localCrossChainAdapter = new MTokenCrossChainAdapter(address(0x2), address(0x3), address(0x4));

        vm.stopPrank();
    }

    // If running testGetWithdrawEventType, run it like so:
    // forge test -vvvv --rpc-url https://rpc.khalani.network --match-test testGetWithdrawEventType
    function testGetWithdrawEventType() public {
        // vm.chainId(1098411886);
        // bytes32 eventType = crossChainAdapter.getWithdrawEventType();
        // console.logBytes32(eventType);
    }

    function testGetWithdrawEventTypeLocal() public {
        bytes32 withdrawType = localCrossChainAdapter.getWithdrawEventType();
        bytes32 expectedWithdrawType = keccak256(abi.encode(owner, withdrawalEventTypeHash));
        assertEq(withdrawType, expectedWithdrawType);
    }
}
