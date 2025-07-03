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
    address constant i_EventVerifier = 0x869Df16aEA0d1581c841f41983FB49F47E25f18b;
    address constant spokeToken = 0x4722ce3A7195dEe57CeC78eDf5Ac9c542fbc4626; // Mock token
    address constant owner = 0xc13113E56E00050327Be3AD164185103541f1903; // Owner address
    uint32 constant chainId = 17000; // Chain ID example
    uint256 constant amount = 1 ether; // Withdrawal amount

    function setUp() public {
        // Attach to deployed contract
        crossChainAdapter = MTokenCrossChainAdapter(contractAddress);
        eventVerifier = EventVerifier(payable(i_EventVerifier));
    }

    function testHoleskyWithdrawOnHubChain() public {
        vm.chainId(1098411886);
        vm.prank(i_IMTokenManager);
        vm.deal(i_IMTokenManager, 0.01 ether);
        crossChainAdapter.withdraw{value: 0.01 ether}(spokeToken, chainId, owner, amount);
        console.log("Withdraw called successfully on Hub chain");
    }

    function testHoleskyHandleOnSpokeChain() public {
        vm.chainId(17000);
        vm.prank(0x46f7C5D896bbeC89bE1B19e4485e59b4Be49e9Cc);
        vm.deal(0x46f7C5D896bbeC89bE1B19e4485e59b4Be49e9Cc, 0.01 ether);

        bytes32 sender = TypeCasts.addressToBytes32(owner);

        eventVerifier.handle{value: 0.01 ether}(
            chainId,
            sender,
            hex"0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000b8b96dd40372e4c00eb3d0ed9558dc0914450c860000000000000000000000000000000000000000000000000000000041786f6eb04a6ca9418db47d28ab590b6de6d0aa32f2f4da50ee0c90deb5c560d4ed16d7000000000000000000000000000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000800000000000000000000000004722ce3a7195dee57cec78edf5ac9c542fbc46260000000000000000000000000000000000000000000000000de0b6b3a7640000000000000000000000000000c13113e56e00050327be3ad164185103541f19030000000000000000000000000000000000000000000000000000000000000000"
        );
        console.log("Handle called successfully on Spoke Chain");
    }
}

// forge test -vvvv --rpc-url https://rpc.khalani.network --match-test testHoleskyWithdrawOnHubChain
// forge test -vvvv --rpc-url https://1rpc.io/holesky --match-test testHoleskyHandleOnSpokeChain
