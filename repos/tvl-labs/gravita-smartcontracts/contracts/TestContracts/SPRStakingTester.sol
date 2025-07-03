// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;
import "../SPR/SPRStaking.sol";

contract SPRStakingTester is SPRStaking {
	function requireCallerIsVesselManager() external view callerIsVesselManager {}
}
