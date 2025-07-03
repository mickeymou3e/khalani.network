// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";

contract SimulationTest is Test {
    address contractAddress = 0x173a00EC9a8255384E17508dD19C39a2f5B5D10b;

    address user;
    uint256 userKey;

    function setUp() public {
        user = address(0xc13113E56E00050327Be3AD164185103541f1903);
        userKey = vm.envUint("PRIVATE_KEY");
        // Check that the userKey corresponds to the user address
        address derivedAddress = vm.addr(userKey);
        assertEq(derivedAddress, user, "The derived address from the private key does not match the user address.");
        vm.startPrank(user);
    }

    function testSimulation1() public {        
        // Encode the calldata
        bytes memory _calldata = hex"cfe96c840000000000000000000000004722ce3a7195dee57cec78edf5ac9c542fbc46260000000000000000000000000000000000000000000000008ac7230489e80000000000000000000000000000000000000000000000000000000000006702ea4d000000000000000000000000000000000000000000000000000000006702f85d00000000000000000000000000000000000000000000000000000000000000a00000000000000000000000000000000000000000000000000000000000000041677acf5b3e7bd6556fd8afd8eb45d0c6b9d70771361da41c701a8389b614ad0d35e1916349be7c6d9dc21105a899907ff8beeaa9d0379405ad5c5aff7dac60b71b00000000000000000000000000000000000000000000000000000000000000";

        // Simulate sending Ether to the contract with the calldata
        (bool success, bytes memory returnData) = contractAddress.call{value: 0.05 ether}(_calldata);

        require(success, string(returnData));
    }
}

// Command to run:
// forge test --fork-url https://1rpc.io/holesky -vvvv --match-test testSimulation