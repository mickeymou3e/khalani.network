// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "../SPR/CommunityIssuance.sol";

contract CommunityIssuanceTester is CommunityIssuance {

	function unprotectedAddSPRHoldings(address _account, uint256 _supply) external {
		sprHoldings[_account] += _supply;
	}

	function getLastUpdateTokenDistribution() external view returns (uint256) {
		return _getLastUpdateTokenDistribution();
	}

	function unprotectedIssueSPR() external returns (uint256) {
		return issueSPR();
	}
}
