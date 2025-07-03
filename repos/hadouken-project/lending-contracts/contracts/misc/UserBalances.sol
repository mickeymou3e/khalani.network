// SPDX-License-Identifier: agpl-3.0
pragma solidity 0.6.12;

import {IERC20} from '../dependencies/openzeppelin/contracts/IERC20.sol';
import {IScaledBalanceToken} from '../interfaces/tokens/IScaledBalanceToken.sol';

import {IAToken} from '../interfaces/tokens/IAToken.sol';
import {IStableDebtToken} from '../interfaces/tokens/IStableDebtToken.sol';
import {IVariableDebtToken} from '../interfaces/tokens/IVariableDebtToken.sol';
import {StableDebtToken} from '../protocol/tokenization/StableDebtToken.sol';
import {VariableDebtToken} from '../protocol/tokenization/VariableDebtToken.sol';

contract UserBalances {
  function balancesOf(
    address user,
    address[] memory erc20Tokens,
    address[] memory hTokens,
    address[] memory hsTokens,
    address[] memory hsvTokens
  ) external view returns (uint256[] memory balances) {
    balances = new uint256[](
      erc20Tokens.length + hTokens.length + hsTokens.length + hsvTokens.length
    );

    for (uint256 i = 0; i < erc20Tokens.length; i++) {
      IERC20 erc20 = IERC20(erc20Tokens[i]);
      balances[i] = erc20.balanceOf(user);
    }

    for (uint256 i = 0; i < hTokens.length; i++) {
      IAToken hToken = IAToken(hTokens[i]);
      balances[erc20Tokens.length + i] = hToken.scaledBalanceOf(user);
    }

    for (uint256 i = 0; i < hsTokens.length; i++) {
      IStableDebtToken hsToken = IStableDebtToken(hsTokens[i]);
      balances[erc20Tokens.length + hTokens.length + i] = hsToken.principalBalanceOf(user);
    }

    for (uint256 i = 0; i < hsvTokens.length; i++) {
      IVariableDebtToken hsvToken = IVariableDebtToken(hsvTokens[i]);
      balances[erc20Tokens.length + hTokens.length + hsTokens.length + i] = hsvToken
        .scaledBalanceOf(user);
    }

    return balances;
  }

  function balancesOfWithEarnings(
    address user,
    address[] memory erc20Tokens,
    address[] memory hTokens,
    address[] memory hsTokens,
    address[] memory hsvTokens
  ) external view returns (uint256[] memory balances) {
    balances = new uint256[](
      erc20Tokens.length + hTokens.length + hsTokens.length + hsvTokens.length
    );

    for (uint256 i = 0; i < erc20Tokens.length; i++) {
      IERC20 erc20 = IERC20(erc20Tokens[i]);
      balances[i] = erc20.balanceOf(user);
    }

    for (uint256 i = 0; i < hTokens.length; i++) {
      IAToken hToken = IAToken(hTokens[i]);
      balances[erc20Tokens.length + i] = hToken.balanceOf(user);
    }

    for (uint256 i = 0; i < hsTokens.length; i++) {
      StableDebtToken hsToken = StableDebtToken(hsTokens[i]);
      balances[erc20Tokens.length + hTokens.length + i] = hsToken.balanceOf(user);
    }

    for (uint256 i = 0; i < hsvTokens.length; i++) {
      VariableDebtToken hsvToken = VariableDebtToken(hsvTokens[i]);
      balances[erc20Tokens.length + hTokens.length + hsTokens.length + i] = hsvToken.balanceOf(
        user
      );
    }

    return balances;
  }
}
