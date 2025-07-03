// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;
import "../Interfaces/ISPRStaking.sol";

contract SPRStakingScript {
	ISPRStaking immutable sprStaking;

	constructor(address _SPRStakingAddress) {
		sprStaking = ISPRStaking(_SPRStakingAddress);
	}

	function stake(uint256 _SPRamount) external {
		ISPRStaking(sprStaking).stake(_SPRamount);
	}
}
