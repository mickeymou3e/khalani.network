// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import {MTokenCrossChainAdapter} from "../src/event_system/apps/bridge/MTokenCrossChainAdapter.sol";
import {EventVerifier} from "../src/event_system/EventVerifier.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

contract WithdrawSimulation is Test {
    // Contract and addresses
    address constant contractAddress = 0xfFe843766b7eebDCa753347266BF7835da07C914;
    MTokenCrossChainAdapter crossChainAdapter;
    EventVerifier eventVerifier;

    address constant i_IMTokenManager = 0x60e18B9Ab467bA5724f322727787F636B70E1b26; // Token Manager
    address constant i_EventVerifier = 0xC2d6B823115a11Ad9D5a5d8221bF287f9212B57a;
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
            hex"0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000f03cedb43bdeeb358a80dc22f32cde418c6cd28c0000000000000000000000000000000000000000000000000000000041786f6e1bd0df9a48fa1fb693ea2e0c0a5849f6f68edcd970b9c91720817a3d5b36d7f500000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000080000000000000000000000000277caac382cb1b1087598e710bcf96baf218f9f9000000000000000000000000000000000000000000000000d02ab486cedc0000000000000000000000000000c13113e56e00050327be3ad164185103541f19030000000000000000000000000000000000000000000000000000000000000004"
        );
        console.log("Handle called successfully on Spoke Chain");
    }
}

// forge test -vvvv --rpc-url https://rpc.khalani.network --match-test testWithdrawOnHubChain
// forge test -vvvv --rpc-url https://avalanche-fuji-c-chain-rpc.publicnode.com --match-test testHandleOnSpokeChain