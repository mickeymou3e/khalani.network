// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {VersionedInitializable} from '../libraries/aave-upgradeability/VersionedInitializable.sol';

import '../../dependencies/openzeppelin/contracts/Context.sol';
import {SafeERC20, IERC20} from '../../dependencies/openzeppelin/contracts/SafeERC20.sol';

contract HadoukenCollectorV2 is VersionedInitializable, Context {
  uint256 public constant REVISION = 2;
  using SafeERC20 for IERC20;
  address private _owner;
  event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

  modifier onlyOwner() {
    require(_owner == _msgSender(), 'Ownable: caller is not the owner');
    _;
  }

  function transferOwnership(address newOwner) public virtual onlyOwner {
    require(newOwner != address(0), 'Ownable: new owner is the zero address');
    emit OwnershipTransferred(_owner, newOwner);
    _owner = newOwner;
  }

  /**
   * @dev returns the revision of the implementation contract
   */
  function owner() public view returns (address) {
    return _owner;
  }

  /**
   * @dev returns the revision of the implementation contract
   */
  function getRevision() internal pure override returns (uint256) {
    return REVISION;
  }

  /**
   * @dev initializes the contract upon assignment to the InitializableAdminUpgradeabilityProxy
   */
  function initialize(address ownerAddress) external initializer {
    _owner = ownerAddress;
  }

  function transfer(address token, address recipient, uint256 amount) external onlyOwner {
    IERC20(token).safeTransfer(recipient, amount);
  }
}
