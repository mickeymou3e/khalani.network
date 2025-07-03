// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../FeeCollector.sol";

contract FeeCollectorTester is FeeCollector {

	bool public __routeToSPRStaking;

	function calcNewDuration(
		uint256 remainingAmount,
		uint256 remainingTimeToLive,
		uint256 addedAmount
	) external pure returns (uint256) {
		return _calcNewDuration(remainingAmount, remainingTimeToLive, addedAmount);
	}

	function setRouteToSPRStaking(bool ___routeToSPRStaking) external onlyOwner {
		__routeToSPRStaking = ___routeToSPRStaking;
	}

	function _routeToSPRStaking() internal view override returns (bool) {
		return __routeToSPRStaking;
	}
}
