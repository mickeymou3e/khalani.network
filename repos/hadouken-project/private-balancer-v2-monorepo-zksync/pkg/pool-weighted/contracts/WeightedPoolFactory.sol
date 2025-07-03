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

import "@balancer-labs/v2-pool-utils/contracts/factories/BasePoolFactory.sol";

import "./WeightedPool.sol";

contract WeightedPoolFactory is BasePoolFactory {
    mapping(address => bool) private _isPoolFromFactory;

    event PoolCreated(address indexed pool);

    constructor(
        IVault vault,
        IProtocolFeePercentagesProvider protocolFeeProvider,
        uint256 initialPauseWindowDuration,
        uint256 bufferPeriodDuration
    )
        BasePoolFactory(
            vault,
            protocolFeeProvider,
            initialPauseWindowDuration,
            bufferPeriodDuration
        )
    {
        // solhint-disable-previous-line no-empty-blocks
    }

    function isPoolFromFactory(address pool) external view override returns (bool) {
        return _isPoolFromFactory[pool];
    }

    /**
     * @dev Deploys a new `WeightedPool`.
     */
    function create(
        string memory name,
        string memory symbol,
        IERC20[] memory tokens,
        uint256[] memory normalizedWeights,
        IRateProvider[] memory rateProviders,
        uint256 swapFeePercentage,
        address owner
    ) external returns (address) {
        (uint256 pauseWindowDuration, uint256 bufferPeriodDuration) = getPauseConfiguration();

        _ensureEnabled();

          WeightedPool.NewPoolParams memory params =  WeightedPool.NewPoolParams({
            name: name,
            symbol: symbol,
            tokens: tokens,
            normalizedWeights: normalizedWeights,
            rateProviders: rateProviders,
            assetManagers: new address[](tokens.length), // Don't allow asset managers,
            swapFeePercentage: swapFeePercentage
        });

        address pool = address(new WeightedPool(params, getVault(),
            getProtocolFeePercentagesProvider(),
            pauseWindowDuration,
            bufferPeriodDuration,
            owner
        )); 

        _isPoolFromFactory[pool] = true;

        emit PoolCreated(pool);

        return pool;
    }
}
