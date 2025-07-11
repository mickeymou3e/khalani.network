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

pragma solidity ^0.8.19;

interface IMockEulerProtocol {
    /**
     * @notice Triggers a transferFrom call `from` msg.sender
     * @dev This mimics the requirement to ensure the euler protocol
     * is allowed to transfer from msg.sender
     */
    function requestUnderlyingFromRelayer(
        address underlying,
        uint256 amount,
        address msgSender
    ) external;

    /**
     * @notice Sends tokens from EulerProtocol to relayer
     * @dev This is a simple ERC20.transfer
     */
    function sendUnderlyingToRelayer(
        address wrappedToken,
        uint256 amount,
        address relayer
    ) external;
}
