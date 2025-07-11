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

import "@balancer-labs/v2-interfaces/contracts/standalone-utils/IstETH.sol";
import "@balancer-labs/v2-interfaces/contracts/standalone-utils/IwstETH.sol";

import "@balancer-labs/v2-solidity-utils/contracts/openzeppelin/Address.sol";

import "./IBaseRelayerLibrary.sol";

/**
 * @title LidoWrapping
 * @notice Allows users to wrap and unwrap stETH
 * @dev All functions must be payable so they can be called from a multicall involving ETH
 */
abstract contract LidoWrapping is IBaseRelayerLibrary {
    using Address for address payable;

    IstETH private immutable _stETH;
    IwstETH private immutable _wstETH;

    /**
     * @dev The zero address may be passed as wstETH to safely disable this module
     * @param wstETH - the address of Lido's wrapped stETH contract
     */
    constructor(IERC20 wstETH) {
        // Safely disable stETH wrapping if no address has been passed for wstETH
        _stETH = wstETH != IERC20(address(0)) ? IwstETH(address(wstETH)).stETH() : IstETH(address(0));
        _wstETH = IwstETH(address(wstETH));
    }

    function wrapStETH(
        address sender,
        address recipient,
        uint256 amount,
        uint256 outputReference
    ) external payable {
        amount = _resolveAmountPullTokenAndApproveSpender(_stETH, address(_wstETH), amount, sender);

        uint256 result = IwstETH(_wstETH).wrap(amount);

        _transferAndSetChainedReference(_wstETH, recipient, result, outputReference);
    }

    function unwrapWstETH(
        address sender,
        address recipient,
        uint256 amount,
        uint256 outputReference
    ) external payable {
        amount = _resolveAmountAndPullToken(_wstETH, amount, sender);

        // No approval is needed here, as wstETH is burned directly from the relayer's account
        uint256 result = _wstETH.unwrap(amount);

        _transferAndSetChainedReference(_stETH, recipient, result, outputReference);
    }

    function stakeETH(
        address recipient,
        uint256 amount,
        uint256 outputReference
    ) external payable {
        amount = _resolveAmount(amount);

        uint256 result = _stETH.submit{ value: amount }(address(this));

        _transferAndSetChainedReference(_stETH, recipient, result, outputReference);
    }

    function stakeETHAndWrap(
        address recipient,
        uint256 amount,
        uint256 outputReference
    ) external payable {
        amount = _resolveAmount(amount);

        // We must query this separately, since the wstETH contract doesn't return how much wstETH is minted.
        uint256 result = _wstETH.getWstETHByStETH(amount);

        // The fallback function on the wstETH contract automatically stakes and wraps any ETH sent to it.
        // We can then send the ETH safely, and only have to ensure that the call doesn't revert.
        //
        // This would be dangerous if `_wstETH` were set to the zero address. However, in this scenario,
        // this function would have already reverted during the call to `getWstETHByStETH`, preventing loss of funds.
        payable(address(_wstETH)).sendValue(amount);

        _transferAndSetChainedReference(_wstETH, recipient, result, outputReference);
    }
}
