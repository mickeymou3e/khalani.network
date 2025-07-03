pragma solidity ^0.8.4;

import "./interfaces/IRewarder.sol";
import "openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol";

abstract contract BaseRewarder is IRewarder, AccessControlEnumerable {

    bytes32 internal constant SETTLEMENT_REACTOR = keccak256("SETTLEMENT_REACTOR");
    address public rewardSource;

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function setRewardSource(address _rewardSource) external {
        _checkRole(DEFAULT_ADMIN_ROLE);
        rewardSource = _rewardSource;
    }

    function addSettlementReactor(address settlementReactor) external {
        _checkRole(DEFAULT_ADMIN_ROLE);
        _grantRole(SETTLEMENT_REACTOR, settlementReactor);
    }

}