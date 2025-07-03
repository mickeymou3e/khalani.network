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
pragma experimental ABIEncoderV2;

import "@balancer-labs/v2-interfaces/contracts/vault/IVault.sol";
import "@balancer-labs/v2-interfaces/contracts/standalone-utils/IProtocolFeePercentagesProvider.sol";
import "@balancer-labs/v2-interfaces/contracts/pool-utils/IBasePoolFactory.sol";
import "@balancer-labs/v2-solidity-utils/contracts/helpers/SingletonAuthentication.sol";

import "./FactoryWidePauseWindow.sol";

/**
 * @notice Base contract for Pool factories.
 *
 * Pools are deployed from factories to allow third parties to reason about them. Unknown Pools may have arbitrary
 * logic: being able to assert that a Pool's behavior follows certain rules (those imposed by the contracts created by
 * the factory) is very powerful.
 *
 * @dev By using the split code mechanism, we can deploy Pools with creation code so large that a regular factory
 * contract would not be able to store it.
 *
 * Since we expect to release new versions of pool types regularly - and the blockchain is forever - versioning will
 * become increasingly important. Governance can deprecate a factory by calling `disable`, which will permanently
 * prevent the creation of any future pools from the factory.
 */
abstract contract BasePoolFactory is
    IBasePoolFactory,
    SingletonAuthentication,
    FactoryWidePauseWindow
{
    IProtocolFeePercentagesProvider private immutable _protocolFeeProvider;

    bool private _disabled;

    event FactoryDisabled();

    constructor(
        IVault vault,
        IProtocolFeePercentagesProvider protocolFeeProvider,
        uint256 initialPauseWindowDuration,
        uint256 bufferPeriodDuration
    )
        SingletonAuthentication(vault)
        FactoryWidePauseWindow(initialPauseWindowDuration, bufferPeriodDuration)
    {
        _protocolFeeProvider = protocolFeeProvider;
    }

    function isDisabled() public view override returns (bool) {
        return _disabled;
    }

    function disable() external override authenticate {
        _ensureEnabled();

        _disabled = true;

        emit FactoryDisabled();
    }

    function _ensureEnabled() internal view {
        _require(!isDisabled(), Errors.DISABLED);
    }

    function getProtocolFeePercentagesProvider() public view returns (IProtocolFeePercentagesProvider) {
        return _protocolFeeProvider;
    }
}
