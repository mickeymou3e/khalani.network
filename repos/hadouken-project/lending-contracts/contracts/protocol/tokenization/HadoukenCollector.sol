// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import { VersionedInitializable } from '../libraries/aave-upgradeability/VersionedInitializable.sol';

contract HadoukenCollector is  VersionedInitializable {

  uint256 public constant REVISION = 1;

  /**
   * @dev returns the revision of the implementation contract
   */
  function getRevision() internal override pure returns (uint256) {
    return REVISION;
  }

  /**
   * @dev initializes the contract upon assignment to the InitializableAdminUpgradeabilityProxy
   */
  function initialize() external initializer {
  }
}