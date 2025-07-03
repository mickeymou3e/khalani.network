// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

interface ICommunityIssuance {
	// --- Events ---

	event TotalSPRIssuedUpdated(uint256 _totalSPRIssued);

	event SPRTransferred(address indexed _from, address indexed _to, uint256 _amount);

	// --- Functions ---

	function issueSPR() external returns (uint256);

	function sendSPR(address _account, uint256 _SPRamount) external;

	function transferSPR(address _from, address _to, uint256 _amount) external;

	function addFundToStabilityPool(uint256 _assignedSupply) external;

	function addFundToStabilityPoolFrom(uint256 _assignedSupply, address _spender) external;

	function setWeeklySprDistribution(uint256 _weeklyReward) external;
}
