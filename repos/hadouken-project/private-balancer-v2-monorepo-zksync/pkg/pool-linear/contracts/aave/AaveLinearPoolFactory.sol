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

import "@balancer-labs/v2-solidity-utils/contracts/openzeppelin/ReentrancyGuard.sol";

import "@balancer-labs/v2-pool-utils/contracts/factories/BasePoolFactory.sol";

import "./AaveLinearPool.sol";
import "./AaveLinearPoolRebalancer.sol";

contract AaveLinearPoolFactory is ReentrancyGuard, BasePoolFactory {
    mapping(address => bool) private _isPoolFromFactory;

    constructor(
        IVault vault,
        IProtocolFeePercentagesProvider protocolFeeProvider,
        uint256 initialPauseWindowDuration,
        uint256 bufferPeriodDuration
    ) BasePoolFactory(vault, protocolFeeProvider, initialPauseWindowDuration, bufferPeriodDuration) {}

    event PoolCreated(address indexed pool);

    /**
     * @dev Deploys a new `AaveLinearPool`.
     */

    function isPoolFromFactory(address pool) external view override returns (bool) {
        return _isPoolFromFactory[pool];
    }

    function create(
        string memory name,
        string memory symbol,
        IERC20 mainToken,
        IERC20 wrappedToken,
        uint256 upperTarget,
        uint256 swapFeePercentage,
        address owner,
        address assetManager
    ) external nonReentrant returns (AaveLinearPool) {
        // We are going to deploy both an AaveLinearPool and an AaveLinearPoolRebalancer set as its Asset Manager, but
        // this creates a circular dependency problem: the Pool must know the Asset Manager's address in order to call
        // `IVault.registerTokens` with it, and the Asset Manager must know about the Pool in order to store its Pool
        // ID, wrapped and main tokens, etc., as immutable variables.
        // We could forego immutable storage in the Rebalancer and simply have a two-step initialization process that
        // uses storage, but we can keep those gas savings by instead making the deployment a bit more complicated.
        //
        // Note that the Pool does not interact with the Asset Manager: it only needs to know about its address.
        // We therefore use create2 to deploy the Asset Manager, first computing the address where it will be deployed.
        // With that knowledge, we can then create the Pool, and finally the Asset Manager. The only issue with this
        // approach is that create2 requires the full creation code, including constructor arguments, and among those is
        // the Pool's address. To work around this, we have the Rebalancer fetch this address from `getLastCreatedPool`,
        // which will hold the Pool's address after we call `_create`.

        // address expectedRebalancerAddress = Create2.computeAddress(rebalancerSalt, keccak256(rebalancerCreationCode));

        (uint256 pauseWindowDuration, uint256 bufferPeriodDuration) = getPauseConfiguration();

        AaveLinearPool.ConstructorArgs memory args = AaveLinearPool.ConstructorArgs({
            vault: getVault(),
            name: name,
            symbol: symbol,
            mainToken: mainToken,
            wrappedToken: wrappedToken,
            assetManager: assetManager,
            upperTarget: upperTarget,
            swapFeePercentage: swapFeePercentage,
            pauseWindowDuration: pauseWindowDuration,
            bufferPeriodDuration: bufferPeriodDuration,
            owner: owner
        });

        AaveLinearPool pool = new AaveLinearPool(args);

        emit PoolCreated(address(pool));

        // LinearPools have a separate post-construction initialization step: we perform it here to
        // ensure deployment and initialization are atomic.
        pool.initialize();

        // Not that the Linear Pool's deployment is complete, we can deploy the Rebalancer, verifying that we correctly
        // predicted its deployment address.

        // We don't return the Rebalancer's address, but that can be queried in the Vault by calling `getPoolTokenInfo`.
        return pool;
    }
}
