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

import "../utils/IERC20.sol";
import "../utils/Ownable.sol";
import "../interfaces/IBasePool.sol";
import "../interfaces/IVault.sol";
import "../interfaces/IBasePool.sol";
import "../interfaces/IAsset.sol";

contract HadoukenLockdrop is Ownable(msg.sender) {
    enum LockLength { TwoWeeks, OneMonth, FourMonths, OneYear }

    enum Phase { PreludiumOne, One, InterludiumOne, Two, InterludiumTwo, Three }

    struct PhaseOneCommitment {
        address token;
        address owner;
        uint256 amount;
        LockLength lockLength;
        uint256 weight;
        uint256 timestamp;
        bool claimedHDK;
        bool isLocked;
    }

    IERC20 public immutable husdToken;
    IERC20 public immutable triCryptoToken;
    IERC20 public immutable hdkToken;
    IERC20 public immutable priceToken;

    uint256 public husdPrice;
    uint256 public triCryptoPrice;
    uint256 public constant PRICE_DECIMALS = 10**18;
    uint256 public constant DUST = 10**9;

    mapping(LockLength => uint256) public lockDurations;
    mapping(LockLength => uint256) public lockLengthMultipliers;
    mapping(uint256 => uint256) public lockDayMultipliers;

    uint256 public lastLockId;
    mapping(uint256 => PhaseOneCommitment) public phaseOneCommitments;

    mapping(address => uint256) public depositedPriceToken;
    mapping(address => uint256) public depositedHDK;

    uint256 public constant PHASE_ONE_DURATION = 3 days;
    uint256 public PHASE_ONE_START_TIME;
    uint256 public PHASE_ONE_END_TIME;

    uint256 public constant PHASE_TWO_DURATION = 3 days;
    uint256 public PHASE_TWO_START_TIME;
    uint256 public PHASE_TWO_END_TIME;

    uint256 public PHASE_THREE_START_TIME;
    uint256 public WITHDRAW_LP_END_TIME;
    uint256 public WITHDRAW_LP_DURATION_TIME = 90 days;

    uint256 public constant MULTIPLIER_DECIMALS = 4;
    uint256 public constant PRECISION = 10**18;

    IVault public vault;
    IBasePool basePool;

    uint256 public availableHDKLiquidity = 0;
    uint256 public TVLWeighted = 0;
    uint256 public phaseTwoTotalBpt = 0;
    uint256 public bonusHdk = 0;
    uint256 public priceTokenJoined = 0;
    uint256 public totalDepositedHDK = 0;
    mapping(address => uint256) public totalLPWithdrawn;

    event LockdropCreated(address indexed husdToken, address indexed triCryptoToken, uint256 phaseOneStartTime);
    event Locked(
        uint256 lockId,
        address indexed owner,
        address token,
        uint256 amount,
        LockLength lockLength,
        uint256 weight,
        uint256 time
    );
    event Unlocked(uint256 lockId, address indexed owner, address token);
    event ClaimedHDKTokens(uint256 lockId, address indexed user, uint256 amount, uint256 time);
    event DepositedHDK(address indexed user, uint256 amount, uint256 time);
    event DepositedPriceToken(address indexed user, uint256 amount, uint256 time);
    event FinalizePhaseOne(
        uint256 phaseStartTime,
        address husdToken,
        uint256 husdPrice,
        address triCryptoToken,
        uint256 triCryptoPrice
    );
    event FinalizePhaseTwo(uint256 phaseStartTime, uint256 hdkAmount, uint256 priceTokenAmount, uint256 totalBpt);

    constructor(
        uint256 phaseOneStartTime,
        IERC20 _husdToken,
        IERC20 _triCryptoToken,
        IERC20 _hdkToken,
        IERC20 _priceToken,
        IVault _vault
    ) {
        lockDurations[LockLength.TwoWeeks] = 14 days;
        lockDurations[LockLength.OneMonth] = 30 days;
        lockDurations[LockLength.FourMonths] = 120 days;
        lockDurations[LockLength.OneYear] = 365 days;

        lockLengthMultipliers[LockLength.TwoWeeks] = 2000;
        lockLengthMultipliers[LockLength.OneMonth] = 6000;
        lockLengthMultipliers[LockLength.FourMonths] = 10000;
        lockLengthMultipliers[LockLength.OneYear] = 20000;

        lockDayMultipliers[0] = 20000;
        lockDayMultipliers[1] = 15000;
        lockDayMultipliers[2] = 10000;

        PHASE_ONE_START_TIME = phaseOneStartTime;
        PHASE_ONE_END_TIME = phaseOneStartTime + PHASE_ONE_DURATION;

        lastLockId = 0;
        husdToken = _husdToken;
        triCryptoToken = _triCryptoToken;
        hdkToken = _hdkToken;
        priceToken = _priceToken;
        vault = _vault;

        emit LockdropCreated(address(_husdToken), address(_triCryptoToken), phaseOneStartTime);
    }

    function setPhaseOneStartTime(uint256 startTime) public onlyOwner {
        PHASE_ONE_START_TIME = startTime;
    }

    function setPhaseOneEndTime(uint256 endTime) public onlyOwner {
        PHASE_ONE_END_TIME = endTime;
    }

    function setPhaseTwoStartTime(uint256 startTime) public onlyOwner {
        PHASE_TWO_START_TIME = startTime;
    }

    function setPhaseTwoEndTime(uint256 endTime) public onlyOwner {
        PHASE_TWO_END_TIME = endTime;
    }

    function setPhaseThreeStartTime(uint256 startTime) public onlyOwner {
        PHASE_THREE_START_TIME = startTime;
    }

    function setPhaseThreeEndTime(uint256 endTime) public onlyOwner {
        WITHDRAW_LP_END_TIME = endTime;
    }

    modifier isPhaseOne() {
        require(block.timestamp >= PHASE_ONE_START_TIME, "phase one has not started");
        require(block.timestamp <= PHASE_ONE_END_TIME, "phase one has ended");
        _;
    }

    modifier phaseOneHasEnded() {
        require(block.timestamp > PHASE_ONE_END_TIME, "phase one has not ended");
        _;
    }

    modifier phaseTwoHasStarted() {
        require(block.timestamp >= PHASE_TWO_START_TIME, "phase two has not started");
        _;
    }

    modifier isPhaseTwo() {
        require(block.timestamp >= PHASE_TWO_START_TIME, "phase two has not started");
        require(block.timestamp <= PHASE_TWO_END_TIME, "phase two has ended");
        _;
    }

    modifier phaseTwoHasEnded() {
        require(block.timestamp > PHASE_TWO_END_TIME, "phase two has not ended");
        _;
    }

    modifier phaseThreeHasStarted() {
        require(block.timestamp >= PHASE_THREE_START_TIME, "phase three has not started");
        _;
    }

    function getCurrentPhase() public view returns (Phase) {
        if (block.timestamp <= PHASE_ONE_START_TIME) {
            return Phase.PreludiumOne;
        } else if (block.timestamp >= PHASE_ONE_START_TIME && block.timestamp <= PHASE_ONE_END_TIME) {
            return Phase.One;
        } else if (
            (block.timestamp > PHASE_ONE_END_TIME && block.timestamp <= PHASE_TWO_START_TIME) ||
            (block.timestamp > PHASE_ONE_END_TIME && PHASE_TWO_START_TIME == 0)
        ) {
            return Phase.InterludiumOne;
        } else if (block.timestamp >= PHASE_TWO_START_TIME && block.timestamp <= PHASE_TWO_END_TIME) {
            return Phase.Two;
        } else if (
            (block.timestamp > PHASE_TWO_END_TIME && block.timestamp <= PHASE_THREE_START_TIME) ||
            (block.timestamp > PHASE_TWO_END_TIME && PHASE_THREE_START_TIME == 0)
        ) {
            return Phase.InterludiumTwo;
        } else {
            return Phase.Three;
        }
    }

    function generateNextLockId() internal returns (uint256) {
        return lastLockId++;
    }

    function calcWeight(
        uint256 lockedAmount,
        LockLength lockLength,
        uint256 dayOfLockDrop
    ) public view returns (uint256) {
        uint256 weightDecimals = 10**(2 * MULTIPLIER_DECIMALS);
        uint256 userWeight = (lockedAmount * lockLengthMultipliers[lockLength] * lockDayMultipliers[dayOfLockDrop]) /
            weightDecimals;
        require(userWeight != 0, "User weight is zero");
        return userWeight;
    }

    /**
     * @dev   Locks up the value sent to contract
     * @param amount  tokenAmount
     * @param lockLength lock time
     */
    function lock(
        address token,
        uint256 amount,
        LockLength lockLength
    ) external isPhaseOne {
        require(token == address(husdToken) || token == address(triCryptoToken), "Token is not supported");
        require(lockDurations[lockLength] != 0, "Wrong lock length");
        require(amount != 0, "Lock amount cannot be zero");

        IERC20(token).transferFrom(msg.sender, address(this), amount);

        uint256 dayOfLockDrop = (block.timestamp - PHASE_ONE_START_TIME) / 1 days;
        uint256 weight = calcWeight(amount, lockLength, dayOfLockDrop);
        uint256 lockId = generateNextLockId();

        PhaseOneCommitment memory commitment = PhaseOneCommitment(
            token,
            msg.sender,
            amount,
            lockLength,
            weight,
            block.timestamp,
            false,
            true
        );
        phaseOneCommitments[lockId] = commitment;

        emit Locked(lockId, msg.sender, token, amount, lockLength, weight, block.timestamp);
    }

    /**
     * @dev  Unlock
     * @param lockIndex lock index
     */
    function unlock(uint256 lockIndex) public phaseTwoHasEnded {
        require(phaseOneCommitments[lockIndex].owner == msg.sender, "Only owner can unlock tokens");
        require(phaseOneCommitments[lockIndex].isLocked, "Locked tokens can be unlocked only once");

        address lockedToken = phaseOneCommitments[lockIndex].token;
        LockLength lockLength = phaseOneCommitments[lockIndex].lockLength;
        uint256 unlockTimestamp = phaseOneCommitments[lockIndex].timestamp + lockDurations[lockLength];
        require(block.timestamp > unlockTimestamp, "cannot unlock lock before its end");

        IERC20(lockedToken).transfer(msg.sender, phaseOneCommitments[lockIndex].amount);

        phaseOneCommitments[lockIndex].isLocked = false;

        emit Unlocked(lockIndex, msg.sender, lockedToken);
    }

    function multiUnlock(uint256[] memory lockIds) external phaseTwoHasStarted {
        for (uint256 i; i < lockIds.length; ++i) {
            unlock(lockIds[i]);
        }
    }

    function finalizePhaseOne(
        uint256 _availableHDKLiquidity,
        uint256 _TVLWeighted,
        uint256 phaseTwoStartTime,
        uint256 _husdPrice,
        uint256 _triCryptoPrice
    ) external onlyOwner phaseOneHasEnded {
        require(phaseTwoStartTime > block.timestamp, "Phase 2 cannot start in the past");
        require(PHASE_TWO_START_TIME == 0, "Phase 2 has been already initialized");
        availableHDKLiquidity = _availableHDKLiquidity;
        TVLWeighted = _TVLWeighted;
        husdPrice = _husdPrice;
        triCryptoPrice = _triCryptoPrice;

        hdkToken.transferFrom(msg.sender, address(this), _availableHDKLiquidity + DUST);

        PHASE_TWO_START_TIME = phaseTwoStartTime;
        PHASE_TWO_END_TIME = PHASE_TWO_START_TIME + PHASE_TWO_DURATION;
        emit FinalizePhaseOne(
            phaseTwoStartTime,
            address(husdToken),
            _husdPrice,
            address(triCryptoToken),
            _triCryptoPrice
        );
    }

    function claimHDKTokens(uint256 lockId) public phaseTwoHasStarted {
        require(!phaseOneCommitments[lockId].claimedHDK, "no drop tokens to claim");
        require(phaseOneCommitments[lockId].owner == msg.sender, "Only owner can unlock");

        uint256 tokenPrice = 0;
        if (phaseOneCommitments[lockId].token == address(husdToken)) {
            tokenPrice = husdPrice;
        } else if (phaseOneCommitments[lockId].token == address(triCryptoToken)) {
            tokenPrice = triCryptoPrice;
        } else {
            revert("No price avaible for locked token");
        }
        uint256 userWeight = phaseOneCommitments[lockId].weight;
        uint256 userVL = userWeight * tokenPrice;

        uint256 tokensToClaim = ((availableHDKLiquidity * userVL) / TVLWeighted) / PRICE_DECIMALS;
        hdkToken.transfer(msg.sender, tokensToClaim);
        phaseOneCommitments[lockId].claimedHDK = true;

        emit ClaimedHDKTokens(lockId, msg.sender, tokensToClaim, block.timestamp);
    }

    function multiClaimHDKTokens(uint256[] memory lockIds) external phaseTwoHasStarted {
        for (uint256 i; i < lockIds.length; ++i) {
            claimHDKTokens(lockIds[i]);
        }
    }

    function depositPhaseTwo(uint256 hdkTokenAmount, uint256 priceTokenAmount) external payable isPhaseTwo {
        require(hdkTokenAmount > 0 || priceTokenAmount > 0, "Amounts are 0");

        if (hdkTokenAmount > 0) {
            hdkToken.transferFrom(msg.sender, address(this), hdkTokenAmount);
            depositedHDK[msg.sender] += hdkTokenAmount;
            totalDepositedHDK += hdkTokenAmount;
            emit DepositedHDK(msg.sender, hdkTokenAmount, block.timestamp);
        }

        if (priceTokenAmount > 0) {
            priceToken.transferFrom(msg.sender, address(this), priceTokenAmount);
            depositedPriceToken[msg.sender] += priceTokenAmount;
            emit DepositedPriceToken(msg.sender, priceTokenAmount, block.timestamp);
        }
    }

    function finalizePhaseTwo(
        uint256 phaseThreeStartTime,
        IBasePool _basePool,
        uint256 _bonusHdk
    ) external phaseTwoHasEnded onlyOwner {
        require(phaseThreeStartTime > block.timestamp, "Phase 3 cannot start in the past");
        require(PHASE_THREE_START_TIME == 0, "Phase 3 has been already initialized");
        PHASE_THREE_START_TIME = phaseThreeStartTime;
        WITHDRAW_LP_END_TIME = phaseThreeStartTime + WITHDRAW_LP_DURATION_TIME;
        basePool = _basePool;

        IBasePool pool = IBasePool(_basePool);
        bytes32 id = pool.getPoolId();
        (IERC20[] memory tokens, , ) = vault.getPoolTokens(id);
        bonusHdk = _bonusHdk;
        uint256 hdkAmount = totalDepositedHDK + bonusHdk;
        priceTokenJoined = IERC20(priceToken).balanceOf(address(this));

        hdkToken.transferFrom(msg.sender, address(this), bonusHdk + DUST);

        IERC20(hdkToken).approve(address(vault), hdkAmount);
        IERC20(priceToken).approve(address(vault), priceTokenJoined);

        uint256[] memory maxAmountsIn = new uint256[](2);
        IAsset[] memory assets = new IAsset[](2);

        for (uint8 i = 0; i < tokens.length; i++) {
            if (address(tokens[i]) == address(hdkToken)) {
                maxAmountsIn[i] = hdkAmount;
                assets[i] = IAsset(address(hdkToken));
            } else {
                maxAmountsIn[i] = priceTokenJoined;
                assets[i] = IAsset(address(priceToken));
            }
        }

        bytes memory data = abi.encode(0, maxAmountsIn);

        IVault.JoinPoolRequest memory request = IVault.JoinPoolRequest({
            assets: assets,
            maxAmountsIn: maxAmountsIn,
            userData: data,
            fromInternalBalance: false
        });

        vault.joinPool(id, address(this), address(this), request);

        phaseTwoTotalBpt = IERC20(address(pool)).balanceOf(address(this));

        emit FinalizePhaseTwo(phaseThreeStartTime, hdkAmount, priceTokenJoined, phaseTwoTotalBpt);
    }

    function getUserTotalLP(address user) public view returns (uint256) {
        uint256 rate = (totalDepositedHDK * PRECISION) / priceTokenJoined;
        uint256 userTotalHDK = depositedHDK[user] + ((depositedPriceToken[user] * rate) / PRECISION);
        uint256 poolTotalHDK = totalDepositedHDK + ((priceTokenJoined * rate) / PRECISION);

        uint256 userTotalLP = ((phaseTwoTotalBpt * userTotalHDK) / poolTotalHDK);

        return userTotalLP;
    }

    function getUserAvaibleToWithdrawLP(address user) public view returns (uint256) {
        uint256 userTotalLP = getUserTotalLP(user);
        uint256 lastWithdrawAmount = totalLPWithdrawn[user];

        uint256 currentTime = block.timestamp;
        if (block.timestamp > WITHDRAW_LP_END_TIME) {
            currentTime = WITHDRAW_LP_END_TIME;
        }
        // Calculate the number of tokens locked linearly
        uint256 timeElapsed = currentTime - PHASE_THREE_START_TIME;
        uint256 totalTime = WITHDRAW_LP_END_TIME - PHASE_THREE_START_TIME;

        // Calculate the locked tokens based on the linear function
        uint256 lockedTokens = (userTotalLP * (totalTime - timeElapsed)) / totalTime;
        uint256 avaibleToWithdraw = userTotalLP - lockedTokens - lastWithdrawAmount;

        return avaibleToWithdraw;
    }

    function withdrawPhaseThree() external phaseThreeHasStarted {
        uint256 avaibleToWithdraw = getUserAvaibleToWithdrawLP(msg.sender);
        IERC20(address(basePool)).transfer(msg.sender, avaibleToWithdraw);

        uint256 lastWithdrawAmount = totalLPWithdrawn[msg.sender];
        totalLPWithdrawn[msg.sender] = lastWithdrawAmount + avaibleToWithdraw;
    }
}
