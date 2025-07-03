// SPDX-License-Identifier: GPL-3.0-or-later
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

pragma solidity ^0.7.0;
pragma experimental ABIEncoderV2;

import "./interfaces/ITriCryptoBackstop.sol";
import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";

import "@balancer-labs/v2-solidity-utils/contracts/openzeppelin/Address.sol";
import "@balancer-labs/v2-solidity-utils/contracts/openzeppelin/SafeERC20.sol";

import "./IBaseRelayerLibrary.sol";

/**
 * @title BackstopWrapping
 */
abstract contract BackstopWrapping is IBaseRelayerLibrary {
    using Address for address payable;
    using SafeERC20 for IERC20;

    function depositToBackstop(
        ITriCryptoBackstop backstop,
        address sender,
        address recipient,
        uint256 amount
    ) external payable returns (uint256) {
        if (_isChainedReference(amount)) {
            amount = _getChainedReferenceValue(amount);
        }

        IERC20 triCryptoToken = backstop.liquidationToken();

        // The wrap caller is the implicit sender of tokens, so if the goal is for the tokens
        // to be sourced from outside the relayer, we must first pull them here.
        if (sender != address(this)) {
            require(sender == msg.sender, "Incorrect sender");
            _pullToken(sender, triCryptoToken, amount);
        }

        triCryptoToken.approve(address(backstop), amount);
        backstop.deposit(amount);

        uint256 backstopLpTokensAmount = backstop.balanceOf(address(this));

        backstop.transfer(recipient, backstopLpTokensAmount);

        return backstopLpTokensAmount;
    }
}
