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

import "@balancer-labs/v2-interfaces/contracts/pool-linear/IStaticAToken.sol";

import "@balancer-labs/v2-pool-utils/contracts/lib/ExternalCallLib.sol";
import "@balancer-labs/v2-solidity-utils/contracts/helpers/Version.sol";

import "../LinearPool.sol";

contract AaveLinearPool is LinearPool, Version {
    ILendingPool private immutable _lendingPool;

    struct ConstructorArgs {
        IVault vault;
        string name;
        string symbol;
        IERC20 mainToken;
        IERC20 wrappedToken;
        address assetManager;
        uint256 upperTarget;
        uint256 swapFeePercentage;
        uint256 pauseWindowDuration;
        uint256 bufferPeriodDuration;
        address owner;
        string version;
    }

    constructor(ConstructorArgs memory args)
        LinearPool(
            args.vault,
            args.name,
            args.symbol,
            args.mainToken,
            args.wrappedToken,
            args.upperTarget,
            _toAssetManagerArray(args),
            args.swapFeePercentage,
            args.pauseWindowDuration,
            args.bufferPeriodDuration,
            args.owner
        )
        Version(args.version)
    {
        _require(address(args.mainToken) == IStaticAToken(address(args.wrappedToken)).ASSET(), Errors.TOKENS_MISMATCH);
        _lendingPool = IStaticAToken(address(args.wrappedToken)).LENDING_POOL();
    }

    function _toAssetManagerArray(ConstructorArgs memory args) private pure returns (address[] memory) {
        // We assign the same asset manager to both the main and wrapped tokens.
        address[] memory assetManagers = new address[](2);
        assetManagers[0] = args.assetManager;
        assetManagers[1] = args.assetManager;

        return assetManagers;
    }

    function _getWrappedTokenRate() internal view override returns (uint256) {
        // This pulls in the implementation of `rate` used in the StaticAToken contract
        // except avoiding storing relevant variables in storage for gas reasons.
        // solhint-disable-next-line max-line-length
        // see: https://github.com/aave/protocol-v2/blob/ac58fea62bb8afee23f66197e8bce6d79ecda292/contracts/protocol/tokenization/StaticATokenLM.sol#L255-L257
        try _lendingPool.getReserveNormalizedIncome(address(getMainToken())) returns (uint256 rate) {
            // This function returns a 18 decimal fixed point number, but `rate` has 27 decimals (i.e. a 'ray' value)
            // so we need to convert it.
            return rate / 10**9;
        } catch (bytes memory revertData) {
            // By maliciously reverting here, Aave (or any other contract in the call stack) could trick the Pool into
            // reporting invalid data to the query mechanism for swaps/joins/exits.
            // We then check the revert data to ensure this doesn't occur.
            ExternalCallLib.bubbleUpNonMaliciousRevert(revertData);
        }
    }
}