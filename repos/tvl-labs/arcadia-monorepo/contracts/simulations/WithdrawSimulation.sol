// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {EventVerifier} from "../src/event_system/EventVerifier.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

contract WithdrawSimulation is Test {
    // Contract and addresses
    address constant contractAddress = 0x2dcCb2fd5Ef3244B865C46232556269d56e13390;
    MTokenCrossChainAdapter crossChainAdapter;
    EventVerifier eventVerifier;

    address constant i_IMTokenManager = 0x468cF3aA1F274EF044914D29995bd4f1f6D0A419; // Token Manager
    address constant i_EventVerifier = 0xcfeF1912628Ad9710f8135810d378B8D6835a93F;
    address constant spokeToken = 0x083F108e8302138230fAf206B6d3965C1969b6FA; // Mock token
    address constant owner = 0xc13113E56E00050327Be3AD164185103541f1903; // Owner address
    uint32 constant chainId = 43113; // Chain ID example
    uint256 constant amount = 15 ether; // Withdrawal amount

    function setUp() public {
        // Attach to deployed contract
        crossChainAdapter = MTokenCrossChainAdapter(contractAddress);
        eventVerifier = EventVerifier(i_EventVerifier);
    }

    function testWithdrawOnHubChain() public {
        vm.chainId(1098411886);
        vm.prank(i_IMTokenManager);
        vm.deal(i_IMTokenManager, 1 ether);
        crossChainAdapter.withdraw{value: 1 ether}(
            spokeToken,
            chainId,
            owner,
            amount
        );
        console.log("Withdraw called successfully on Hub chain");
    }

    function testHandleOnSpokeChain() public {
        vm.chainId(43113);
        vm.prank(0x5b6CFf85442B851A8e6eaBd2A4E4507B5135B3B0);
        vm.deal(0x5b6CFf85442B851A8e6eaBd2A4E4507B5135B3B0, 0.1 ether);

        bytes32 sender = TypeCasts.addressToBytes32(owner);

        eventVerifier.handle{value: 0.1 ether}(
            chainId,
            sender,
            hex"0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b8b96dd40372e4c00eb3d0ed9558dc0914450c860000000000000000000000000000000000000000000000000000000041786f6eb04a6ca9418db47d28ab590b6de6d0aa32f2f4da50ee0c90deb5c560d4ed16d700000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000083f108e8302138230faf206b6d3965c1969b6fa000000000000000000000000000000000000000000000000d02ab486cedc0000000000000000000000000000c13113e56e00050327be3ad164185103541f19030000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log("Handle called successfully on Spoke Chain");
    }
}

// forge test -vvvv --rpc-url https://rpc.khalani.network --match-test testWithdrawOnHubChain
// forge test -vvvv --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --match-test testHandleOnSpokeChain