// SPDX-License-Identifier: AGPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "../BaseStrategy.sol";
import "./IPool.sol";

/**
* @title AaveV3Strategy
* @notice A strategy for Aave V3 that deposits and withdraws funds from the lending pool.
*/
contract AaveV3Strategy is BaseStrategy {
    using SafeERC20 for IERC20;

    // The pool to deposit and withdraw through.
    IPool public immutable lendingPool;

    // The token that we get in return for deposits.
    IERC20 public immutable aToken;

    constructor(
        IERC20 _asset,
        string memory _name,
        string memory _symbol,
        IPool _lendingPool
    ) BaseStrategy(_asset, _name, _symbol) {
        // Set the aToken based on the asset we are using.
        lendingPool = _lendingPool;
        aToken = IERC20(lendingPool.getReserveData(address(_asset)).aTokenAddress);

        // Make sure its a real token.
        require(address(aToken) != address(0), "!aToken");

        // Make approve the lending pool for cheaper deposits.
        _asset.safeApprove(address(lendingPool), type(uint256).max);
    }

    //---------------------- Overriden for Aave strategy ----------------------//

    /**
    * @notice supplies asset to Aave lending pool
    * @param _amount the amount of asset to supply
    */
    function _deployFunds(uint256 _amount) internal override {
        lendingPool.supply(asset(), _amount, address(this), 0);
    }

    /**
    * @notice withdraws asset from Aave lending pool
    * @param _amount the amount of asset to withdraw
    */
    function _freeFunds(uint256 _amount) internal override {
        // We dont check available liquidity because we need the tx to
        // revert if there is not enough liquidity so we dont improperly
        // pass a loss on to the user withdrawing.
        lendingPool.withdraw(
            asset(),
            Math.min(aToken.balanceOf(address(this)), _amount),
            address(this)
        );
    }

    /**
    * @dev Harvests and reports the total assets managed by the contract.
    * If the contract is in shutdown mode, any loose funds are deposited back
    * to the lending pool. The total assets are then calculated as the sum
    * of the balance held in aTokens and the balance of the asset directly
    * in the contract.
    *
    * This function can only be called internally.
    *
    * @return _totalAssets The total amount of assets managed by the contract.
    * This is the sum of the aToken balance (adjusted balance for the user that factors in not
    * just the number of tokens they have but also a multiplier based on the underlying asset's
    * normalized income and the asset balance.
    */
    function _harvestAndReport()
    internal
    override
    returns (uint256 _totalAssets)
    {
        address _asset = asset();
        if (shutdown) {
            // deposit any loose funds
            uint256 looseAsset = IERC20(_asset).balanceOf(address(this));
            if (looseAsset > 0) {
                lendingPool.supply(_asset, looseAsset, address(this), 0);
            }
        }

        _totalAssets =
            aToken.balanceOf(address(this)) +
            IERC20(_asset).balanceOf(address(this));
    }
}