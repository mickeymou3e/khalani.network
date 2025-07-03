// SPDX-License-Identifier: MIT

pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/token/ERC20/utils/SafeERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "../Dependencies/BaseMath.sol";
import "../Dependencies/GravitaMath.sol";

import "../Interfaces/ICommunityIssuance.sol";
import "../Interfaces/IStabilityPool.sol";

contract CommunityIssuance is ICommunityIssuance, OwnableUpgradeable, BaseMath {
	using SafeERC20Upgradeable for IERC20Upgradeable;

	string public constant NAME = "CommunityIssuance";

	uint256 public constant DISTRIBUTION_DURATION = 7 days / 60;
	uint256 public constant SECONDS_IN_ONE_MINUTE = 60;

	uint256 public totalSPRIssued;
	uint256 public lastUpdateTime;
	uint256 public SPRSupplyCap;
	uint256 public sprDistribution;

	IStabilityPool public stabilityPool;

	address public staking;
	address public adminContract;
	bool public isSetupInitialized;

	// mapping to maintain the accounting of SPR holdings, similar to `balanceOf` of
	// SPR token.
	mapping(address => uint256) public sprHoldings;

	modifier isController() {
		require(msg.sender == owner() || msg.sender == adminContract, "Invalid Permission");
		_;
	}

	modifier isStabilityPool(address _pool) {
		require(address(stabilityPool) == _pool, "CommunityIssuance: caller is not SP");
		_;
	}

	modifier onlyStabilityPool() {
		require(address(stabilityPool) == msg.sender, "CommunityIssuance: caller is not SP");
		_;
	}

	modifier onlyStaking() {
		require(staking == msg.sender, "CommunityIssuance: caller is not SPRStaking");
		_;
	}

	// --- Initializer ---

	function initialize() public initializer {
		__Ownable_init();
	}

	// --- Functions ---
	function setAddresses(
		address stakingAddress,
		address _stabilityPoolAddress,
		address _adminContract
	) external onlyOwner {
		require(!isSetupInitialized, "Setup is already initialized");
		staking = stakingAddress;
		adminContract = _adminContract;
		stabilityPool = IStabilityPool(_stabilityPoolAddress);
		isSetupInitialized = true;
	}

	function setAdminContract(address _admin) external onlyOwner {
		require(_admin != address(0));
		adminContract = _admin;
	}

	function addFundToStabilityPool(uint256 _assignedSupply) external override isController {
		_addFundToStabilityPoolFrom(_assignedSupply, msg.sender);
	}

	function removeFundFromStabilityPool(uint256 _fundToRemove) external onlyOwner {
		uint256 newCap = SPRSupplyCap - _fundToRemove;
		require(totalSPRIssued <= newCap, "CommunityIssuance: Stability Pool doesn't have enough supply.");

		SPRSupplyCap -= _fundToRemove;

		sprHoldings[address(this)] -= _fundToRemove;
		sprHoldings[msg.sender] += _fundToRemove;
	}

	function addFundToStabilityPoolFrom(uint256 _assignedSupply, address _spender) external override isController {
		_addFundToStabilityPoolFrom(_assignedSupply, _spender);
	}

	function _addFundToStabilityPoolFrom(uint256 _assignedSupply, address _spender) internal {
		if (lastUpdateTime == 0) {
			lastUpdateTime = block.timestamp;
		}

		SPRSupplyCap += _assignedSupply;
		sprHoldings[_spender] -= _assignedSupply;
		sprHoldings[address(this)] += _assignedSupply;
	}

	function issueSPR() public override onlyStabilityPool returns (uint256) {
		uint256 maxPoolSupply = SPRSupplyCap;

		if (totalSPRIssued >= maxPoolSupply) return 0;

		uint256 issuance = _getLastUpdateTokenDistribution();
		uint256 totalIssuance = issuance + totalSPRIssued;

		if (totalIssuance > maxPoolSupply) {
			issuance = maxPoolSupply - totalSPRIssued;
			totalIssuance = maxPoolSupply;
		}

		lastUpdateTime = block.timestamp;
		totalSPRIssued = totalIssuance;
		emit TotalSPRIssuedUpdated(totalIssuance);

		return issuance;
	}

	function _getLastUpdateTokenDistribution() internal view returns (uint256) {
		require(lastUpdateTime != 0, "Stability pool hasn't been assigned");
		uint256 timePassed = (block.timestamp - lastUpdateTime) / SECONDS_IN_ONE_MINUTE;
		uint256 totalDistribuedSinceBeginning = sprDistribution * timePassed;

		return totalDistribuedSinceBeginning;
	}

	function sendSPR(address _account, uint256 _SPRamount) external override onlyStabilityPool {
		uint256 balanceSPR = sprHoldings[address(this)];
		uint256 safeAmount = balanceSPR >= _SPRamount ? _SPRamount : balanceSPR;

		if (safeAmount == 0) {
			return;
		}

		sprHoldings[address(this)] -= safeAmount;
		sprHoldings[_account] += safeAmount;
	}

	// called by staking contract to update the transfers of spr
	function transferSPR(address _from, address _to, uint256 _amount) external onlyStaking {
		require(_from != address(0), "CommunityIssuance: SPR Transfer from Zero Address.");
		require(_to != address(0), "CommunityIssuance: SPR Transfer to Zero Address.");

		uint256 fromHoldings = sprHoldings[_from];
		require(fromHoldings >= _amount, "CommunityIssuance: transfer amount exceeds");
		unchecked {
			sprHoldings[_from] = fromHoldings - _amount;
			sprHoldings[_to] += _amount;
		}
		emit SPRTransferred(_from, _to, _amount);
	}

	function setWeeklySprDistribution(uint256 _weeklyReward) external isController {
		sprDistribution = _weeklyReward / DISTRIBUTION_DURATION;
	}
}
