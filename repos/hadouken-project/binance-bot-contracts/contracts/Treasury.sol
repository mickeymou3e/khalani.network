// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import { Initializable } from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import { OwnableUpgradeable } from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import { UUPSUpgradeable } from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import { AccessControlUpgradeable } from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

import { IERC20 } from "./interfaces/IERC20.sol";
import { IVault } from "./interfaces/IVault.sol";
import { IAsset } from "./interfaces/IAsset.sol";

contract Treasury is Initializable, OwnableUpgradeable, UUPSUpgradeable, AccessControlUpgradeable {
  IVault public vault;
  bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");
  uint256 public constant nativeTokenTreshold = 500 * 10 ** 18;
  uint256 public constant targetBalance = 5000 * 10 ** 18;
  IERC20 public constant nativeToken = IERC20(0x7538C85caE4E4673253fFd2568c1F1b48A71558a);

  /// @custom:oz-upgrades-unsafe-allow constructor
  constructor() {
    _disableInitializers();
  }

  modifier reimburseSender() {
    _;
    uint256 callerBalance = nativeToken.balanceOf(msg.sender);
    uint contractBalance = nativeToken.balanceOf(address(this));
    if (callerBalance < nativeTokenTreshold && contractBalance > targetBalance) {
      nativeToken.transfer(msg.sender, targetBalance - callerBalance);
    }
  }

  function initialize(address vaultAddress) public initializer {
    __Ownable_init();
    __UUPSUpgradeable_init();
    vault = IVault(vaultAddress);
    _grantRole(OPERATOR_ROLE, msg.sender);
  }

  function addOperator(address operatorAddress) public onlyOwner {
    _grantRole(OPERATOR_ROLE, operatorAddress);
  }

  function removeOperator(address operatorAddress) public onlyOwner {
    _revokeRole(OPERATOR_ROLE, operatorAddress);
  }

  function sendToken(address tokenAddress, uint256 amount, address recipient) public onlyOwner {
    IERC20 token = IERC20(tokenAddress);
    token.transfer(recipient, amount);
  }

  function batchSwap(
    IVault.SwapKind kind,
    IVault.BatchSwapStep[] memory swaps,
    IAsset[] memory assets,
    IVault.FundManagement memory funds,
    int256[] memory limits,
    uint256 deadline,
    address tokenIn,
    uint256 amount
  ) public onlyRole(OPERATOR_ROLE) reimburseSender {
    IERC20 token = IERC20(tokenIn);
    token.approve(address(vault), amount);

    vault.batchSwap(kind, swaps, assets, funds, limits, deadline);
  }

  function _authorizeUpgrade(address) internal override onlyOwner {}
}
