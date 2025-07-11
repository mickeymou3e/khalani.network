pragma solidity ^0.8.0;

import "./interfaces/IStrategy.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC4626.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * BaseStrategy implements all of the required base functionality allowing anyone to build a new ERC-4626 complaint
 * single strategy vault by inheriting this contract and overriding 3 functions: deployFunds, freeFunds , harvestAndReport
 */
abstract contract BaseStrategy is AccessControl, ReentrancyGuard, ERC4626 {
    using Math for uint256;

    uint256 public totalIdle; // The total amount of loose `asset` the strategy holds.
    uint256 public totalDebt; // The total amount `asset` that is currently deployed by the strategy.

    uint256 public profitUnlockingRate; // The rate at which locked profit is unlocking.
    uint256 public fullProfitUnlockDate; // The timestamp at which all locked shares will unlock.
    uint256 public lastReport; // The last time a {report} was called.
    uint256 public profitMaxUnlockTime; // The amount of seconds that the reported profit unlocks over.
    bool public shutdown; // Whether or not the strategy is shutdown.
    //------------------CONSTANTS---------------------------------//

    // Used for fee calculations.
    uint256 private constant MAX_BPS = 10_000;

    // Used for profit unlocking rate calculations.
    uint256 private constant MAX_BPS_EXTENDED = 1_000_000_000_000;

    // Seconds per year for max profit unlocking time.
    uint256 private constant SECONDS_PER_YEAR = 31_556_952; // 365.2425 days

    bytes32 private constant MANAGEMENT = keccak256("MANAGEMENT");
    bytes32 private constant KEEPER = keccak256("KEEPER");

    //------------------EVENTS---------------------------------//
    event Reported(uint256 profit, uint256 loss);
    event UpdateProfitMaxUnlockTime(uint256 newProfitMaxUnlockTime);

    constructor(
        IERC20 asset,
        string memory name,
        string memory symbol
    ) ERC4626(asset) ERC20(name, symbol) {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(MANAGEMENT, msg.sender);
        _setupRole(KEEPER, msg.sender);
        profitMaxUnlockTime = 7 days; //default to 7 days
        lastReport = block.timestamp; //setting last report to this block
    }

    //------------------MODIFIERS---------------------------------//
    modifier onlyManagement() {
        require(hasRole(MANAGEMENT, msg.sender), "only management");
        _;
    }

    modifier onlyKeeper() {
        require(hasRole(KEEPER, msg.sender), "only keeper");
        _;
    }

    //------------------VIEW FUNCTIONS---------------------------------//
    /**
     * @notice Get the price per share.
     * @dev This value offers limited precision. Integrations that require
     * exact precision should use convertToAssets or convertToShares instead.
     *
     * @return . The price per share.
     */
    function pricePerShare() external view returns (uint256) {
        return convertToAssets(10 ** decimals());
    }

    //------------------SETTERS---------------------------------//
    /**
     * @notice Sets the `keeper` role to `_keeper`.
     * @dev Can only be called by the current `management`.
     *
     * @param _keeper New `keeper` address.
     */
    function setKeeper(address _keeper) external onlyManagement {
        _setupRole(KEEPER, _keeper);
    }

    /**
     * @notice Sets the `management` role to `_management`.
     * @dev Can only be called by the current `management`.
     *
     * @param _management New `management` address.
     */
    function setManagement(address _management) external onlyManagement {
        _setupRole(MANAGEMENT, _management);
    }

    /**
     * @notice Sets the time for profits to be unlocked over.
     * @dev Can only be called by the current `management`.
     *
     * Denominated in seconds and cannot be greater than 1 year.
     *
     * `profitMaxUnlockTime` is stored as a uint32 for packing but can
     * be passed in as uint256 for simplicity.
     *
     * @param _profitMaxUnlockTime New `profitMaxUnlockTime`.
     */
    function setProfitMaxUnlockTime(
        uint256 _profitMaxUnlockTime
    ) external onlyManagement {
        // Must be greater than 0, and less than a year.
        require(_profitMaxUnlockTime != 0, "too short");
        require(_profitMaxUnlockTime <= SECONDS_PER_YEAR, "too long");
        profitMaxUnlockTime = _profitMaxUnlockTime;

        emit UpdateProfitMaxUnlockTime(_profitMaxUnlockTime);
    }

    //------------------Functions to override for different strategies---------------------------------//
    /**
     * @dev Should deploy up to '_amount' of 'asset' in the yield source.
     *
     * This function is called at the end of a {deposit} or {mint}
     * call.
     *
     * @param _amount The amount of 'asset' that the strategy should attempt
     * to deposit in the yield source.
     */
    function _deployFunds(uint256 _amount) internal virtual;

    /**
     * @dev Will attempt to free the '_amount' of 'asset'.
     *
     * The amount of 'asset' that is already loose has already
     * been accounted for.
     *
     * This function is called during {withdraw} and {redeem} calls.
     * Meaning that unless a whitelist is implemented it will be
     * entirely permissionless and thus can be sandwiched or otherwise
     * manipulated.
     *
     * Should not rely on asset.balanceOf(address(this)) calls other than
     * for diff accounting purposes.
     *
     * Any difference between `_amount` and what is actually freed will be
     * counted as a loss and passed on to the withdrawer. This means
     * care should be taken in times of illiquidity. It may be better to revert
     * if withdraws are simply illiquid so not to realize incorrect losses.
     *
     * @param _amount, The amount of 'asset' to be freed.
     */
    function _freeFunds(uint256 _amount) internal virtual;

    /**
     * @dev Internal function to harvest all rewards, redeploy any idle
     * funds and return an accurate accounting of all funds currently
     * held by the Strategy.
     *
     * This should do any needed harvesting, rewards selling, accrual,
     * redepositing etc. to get the most accurate view of current assets.
     *
     * NOTE: All applicable assets including loose assets should be
     * accounted for in this function.
     *
     * Care should be taken when relying on oracles or swap values rather
     * than actual amounts as all Strategy profit/loss accounting will
     * be done based on this returned value.
     *
     * This can still be called post a shutdown, a strategist can check
     * `TokenizedStrategy.isShutdown()` to decide if funds should be
     * redeployed or simply realize any profits/losses.
     *
     * @return _totalAssets A trusted and accurate account for the total
     * amount of 'asset' the strategy currently holds including idle funds.
     */
    function _harvestAndReport()
        internal
        virtual
        returns (uint256 _totalAssets);

    //------------------Default ERC-4626 functions overridden for basic strategy operation---------------------------------//
    /**
     * @dev Function to be called during {deposit} and {mint}.
     *
     * This function handles all logic including transfers,
     * minting and accounting.
     *
     * We do all external calls before updating any internal
     * values to prevent view reentrancy issues from the token
     * transfers or the _deployFunds() calls.
     */
    function _deposit(
        address caller,
        address receiver,
        uint256 assets,
        uint256 shares
    ) internal nonReentrant override {
        // Need to transfer before minting
        SafeERC20.safeTransferFrom(
            IERC20(asset()),
            caller,
            address(this),
            assets
        );

        // We will deposit up to current idle plus the new amount added
        uint256 toDeploy = totalIdle + assets;

        // Cache for post {deployFunds} checks
        uint256 beforeBalance = IERC20(asset()).balanceOf(address(this));

        //Deploy all loose funds
        _deployFunds(toDeploy);

        // Always get the actual amount deployed.
        // We double check the diff against toDeploy for complete accuracy.
        uint256 deployed = Math.min(
            beforeBalance - IERC20(asset()).balanceOf(address(this)),
            toDeploy
        );

        //Adjust total Assets
        totalDebt += deployed;
        totalIdle = toDeploy - deployed;

        //mint shares
        _mint(receiver, shares);

        emit Deposit(caller, receiver, assets, shares);
    }

    /**
     * @dev To be called during {redeem} and {withdraw}.
     *
     * This will handle all logic, transfers and accounting
     * in order to service the withdraw request.
     *
     * If we are not able to withdraw the full amount needed, it will
     * be counted as a loss and passed on to the user.
     */
    function _withdraw(
        address caller,
        address receiver,
        address owner,
        uint256 assets,
        uint256 shares,
        uint256 maxLoss
    ) private nonReentrant returns (uint256) {
        require(receiver != address(0), "Receiver cannot be zero address");
        if (caller != owner) {
            _spendAllowance(owner, caller, shares);
        }

        uint idle = totalIdle;

        //check if we need to withdraw funds.
        if (idle < assets) {
            // Cache before balance of diff checks.
            uint256 beforeBalance = IERC20(asset()).balanceOf(address(this));

            // Tell strategy to free up what we need
            _freeFunds(assets - idle);

            // Return the actual amount withdrawn. Adjust for potential overwithdraws.
            uint256 withdrawn = Math.min(
                IERC20(asset()).balanceOf(address(this)) - beforeBalance,
                totalDebt
            );

            idle += withdrawn;

            uint256 loss;
            // if we did not get enough funds out then we have a loss
            if (idle < assets) {
                loss = assets - idle;
                if (maxLoss < MAX_BPS) {
                    //make sure we are within the acceptable range
                    require(
                        loss <= (assets * maxLoss) / MAX_BPS,
                        "Loss exceeds maxLoss"
                    );
                }
                // lower the amount to be withdrawn
                assets = idle;
            }
            //update debt storage
            totalDebt -= (withdrawn + loss);
        }
        // update idle based on how much we took out.
        totalIdle = idle - assets;

        _burn(owner, shares);
        SafeERC20.safeTransfer(IERC20(asset()), receiver, assets);

        emit Withdraw(caller, receiver, owner, assets, shares);

        //return the actual amount of assets withdraw
        return assets;
    }

    /**
     * @notice Get the total amount of assets this strategy holds
     * as of the last report.
     *
     * We manually track debt and idle to avoid any PPS manipulation
     * from donations, touch values of debt etc.
     */
    function totalAssets() public view override(ERC4626) returns (uint256) {
            return totalIdle + totalDebt;
    }

    /**
     * @notice Get the current supply of the strategies shares.
     *
     * Locked shares issued to the strategy from profits are not
     * counted towards the full supply until they are unlocked.
     *
     * As more shares slowly unlock the totalSupply will decrease
     * causing the PPS of the strategy to increase.
     */
    function totalSupply() public view override(ERC20, IERC20) returns (uint256) {
        return super.totalSupply() - _unlockedShares();
    }

    /**
     * @notice Returns the current balance for a given '_account'.
     * @dev If the '_account` is the strategy then this will subtract
     * the amount of shares that have been unlocked since the last profit first.
     * @param account the address to return the balance for.
     * @return . The current balance in y shares of the '_account'.
     */
    function balanceOf(address account) public view override(ERC20, IERC20) returns (uint256) {
        if (account == address(this)) {
            return super.balanceOf(account) - _unlockedShares();
        }
        return super.balanceOf(account);
    }


    //------------------Profit locking---------------------------------//
    /**
     * @notice Function for keepers to call to harvest and record all profits accrued.
     * This will account for any gains/losses since the last report and charge fees accordingly
     * Any profits over the fee charged will be locked immediately so there us no change in PricePerShare. Then slowly unlocked over the
     * `maxProfitUnlockTime` each second based on the calculated `profitUnlockingRate`
     *
     * In case of a loss it will first attempt to offset the loss with many remaining time locked shares from the last report
     * in order to reduce any negative impact on the PricePerShare.
     *
     * Will then recalculate the new time to unlock profits over and the rate based on weighted average of any remaining time from the
     * last report and the new amount of shares to be locked
     *
     * @return profit The notional amount of gain if any since the last report in terms of `asset`
     * @return loss The notional amount of loss if any since the last report in terms of `asset`
     */
    function report() external onlyKeeper nonReentrant returns (uint256 profit, uint256 loss) {
        uint256 oldTotalAssets;

        oldTotalAssets = totalAssets();

        /**
         * Strategy report the real total asset it has, it should do all rewards selling and
         * redepositing now and account for deployed and loose asset so we can accurately account for all funds
         */
        uint256 newTotalAssets = _harvestAndReport();

        //burn _unlockedShares
        _burnUnlockedShares();

        uint256 sharesToLock;

        if (newTotalAssets > oldTotalAssets) {
            //we have a profit
            profit = newTotalAssets - oldTotalAssets;
            sharesToLock = convertToShares(profit);

            //mint shares to lock the strategy profit
            _mint(address(this), sharesToLock);
        } else {
            //we have a loss
            loss = oldTotalAssets - newTotalAssets;

            //check NPNL
            if (loss != 0) {
                // We will try and burn shares from any pending profit still unlocking
                // to offset the loss to prevent any PPS decline post report.
                uint256 sharesToBurn = Math.min(
                    convertToShares(loss),
                    balanceOf(address(this))
                );
                if (sharesToBurn > 0) {
                    _burn(address(this), sharesToBurn);
                    //loss -= convertToAsset(sharesToBurn); ??
                }
            }
        }

        // Update unlocking rate and time to fully unlocked
        uint256 totalLockedShares = balanceOf(address(this));
        if (totalLockedShares != 0) {
            uint256 prevLockedTime;
            if (fullProfitUnlockDate > block.timestamp) {
                prevLockedTime =
                    (fullProfitUnlockDate - block.timestamp) *
                    (totalLockedShares - sharesToLock);
            }

            // newProfitLockingPeriod is the weighted average between the remaining
            //time of the previously locked shares and the profitMaxUnlockTime.
            uint256 newProfitLockingPeriod = (prevLockedTime +
                sharesToLock *
                profitMaxUnlockTime) / totalLockedShares;

            //Calculate how many shares unlock per second.
            profitUnlockingRate =
                (totalLockedShares * MAX_BPS_EXTENDED) /
                newProfitLockingPeriod;

            fullProfitUnlockDate = uint128(
                block.timestamp + newProfitLockingPeriod
            );
        } else {
            // Only setting this to 0 will turn in the desired effect,
            // no need to update fullProfitUnlockDate.
            profitUnlockingRate = 0;
        }

        // Update storage we use the actual loose here since it should have
        // been accounted for in `harvestAndReport` and any airdropped amounts
        // would have been locked to prevent PPS manipulation.
        uint256 newIdle = IERC20(asset()).balanceOf(address(this));
        totalIdle = newIdle;
        totalDebt = newTotalAssets - newIdle;

        lastReport = uint128(block.timestamp);

        // Emit event with info
        emit Reported(profit, loss);
    }

    /**
     * Preserving Price Per Share (PPS):
     * By burning unlocked shares, the total number of shares in circulation reduces.
     * If the total assets remain the same but there are fewer shares, the value (or PPS) of each share goes up.
     * This helps in maintaining or even increasing the PPS especially when profits are locked.
     *
     * Profit Distribution:
     * When profits are made, they are represented by the minting of new shares.
     * By first burning unlocked shares, the protocol ensures that when new shares are minted for profits,
     * the dilution effect is minimized.
     * In other words, the newly minted shares for profits don't decrease the PPS
     * as much as they would have if unlocked shares were still in circulation.
     */
    function _burnUnlockedShares() private {
        uint256 unlockedShares = _unlockedShares();
        if (unlockedShares > 0) {
            if (fullProfitUnlockDate > block.timestamp) {
                lastReport = uint128(block.timestamp);
            }
            _burn(address(this), unlockedShares);
        }
    }

    function _unlockedShares() private view returns (uint256) {
        uint256 unlockedShares;
        if (fullProfitUnlockDate > block.timestamp) {
            uint256 timePassed = block.timestamp - lastReport;
            unlockedShares =
                (timePassed * profitUnlockingRate) /
                MAX_BPS_EXTENDED;
        } else if (fullProfitUnlockDate != 0) {
            unlockedShares = super.balanceOf(address(this));
        }
        return unlockedShares;
    }

    //------------------Non-standard ERC-4626 functions with loss param---------------------------------//
    function withdraw(
        uint256 assets,
        address receiver,
        address owner
    ) public override returns (uint256) {
        require(
            assets <= maxWithdraw(owner),
            "ERC4626: withdraw more than max"
        );

        uint256 shares = previewWithdraw(assets);
        _withdraw(_msgSender(), receiver, owner, assets, shares, 0);
        return shares;
    }

    // non standards function with maxLoss param
    function withdraw(
        uint256 assets,
        address receiver,
        address owner,
        uint256 maxLoss
    ) external returns (uint256) {
        require(
            assets <= maxWithdraw(owner),
            "ERC4626: withdraw more than max"
        );

        uint256 shares = previewWithdraw(assets);
        _withdraw(_msgSender(), receiver, owner, assets, shares, maxLoss);
        return shares;
    }

    function redeem(
        uint256 shares,
        address receiver,
        address owner
    ) public override returns (uint256) {
        require(shares <= maxRedeem(owner), "ERC4626: redeem more than max");

        uint256 assets = previewRedeem(shares);
        //default to not limiting a potential loss.
        _withdraw(_msgSender(), receiver, owner, assets, shares, MAX_BPS);
        return assets;
    }

    // non standards function with maxLoss param
    function redeem(
        uint256 shares,
        address receiver,
        address owner,
        uint256 maxLoss
    ) external returns (uint256) {
        require(shares <= maxRedeem(owner), "ERC4626: redeem more than max");

        uint256 assets = previewRedeem(shares);
        _withdraw(_msgSender(), receiver, owner, assets, shares, maxLoss);
        return assets;
    }


    //------------------Reverting to default behaviour---------------------------------//
    /**
     * @notice The amount of shares that the strategy would
     *  exchange for the amount of assets provided, in an
     * ideal scenario where all the conditions are met.
     *
     * @param assets The amount of underlying.
     * @return . Expected shares that `assets` represents.
     */
    function _convertToShares(uint256 assets, Math.Rounding rounding) internal view override returns (uint256) {
        // Saves an extra SLOAD if totalAssets() is non-zero.
        uint256 _totalAssets = totalAssets();
        uint256 _totalSupply = totalSupply();

        // If assets are 0 but supply is not PPS = 0.
        if (_totalAssets == 0) return _totalSupply == 0 ? assets : 0;

        return assets.mulDiv(_totalSupply, _totalAssets, rounding);
    }

    /**
     * @notice The amount of assets that the strategy would
     * exchange for the amount of shares provided, in an
     * ideal scenario where all the conditions are met.
     *
     * @param shares The amount of the strategies shares.
     * @return . Expected amount of `asset` the shares represents.
     */
    function _convertToAssets(uint256 shares, Math.Rounding rounding) internal view override returns (uint256) {
        // Saves an extra SLOAD if totalSupply() is non-zero.
        uint256 supply = totalSupply();

        return
            supply == 0
                ? shares
                : shares.mulDiv(totalAssets(), supply, rounding);
    }

}
