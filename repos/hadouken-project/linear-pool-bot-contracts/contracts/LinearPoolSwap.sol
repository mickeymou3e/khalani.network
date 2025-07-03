// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;
import {IERC20} from "./interfaces/IERC20.sol";
import {IVault} from "./interfaces/IVault.sol";
import {IAsset} from "./interfaces/IAsset.sol";
import {IStaticATokenLM} from "./interfaces/IStaticATokenLM.sol";
import {ILendingPool} from "./interfaces/ILendingPool.sol";
import {IFlashLoanReceiver} from "./interfaces/IFlashLoanReceiver.sol";
import {DataTypes} from "./interfaces/DataTypes.sol";
import {ILinearPool} from "./interfaces/ILinearPool.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract LinearPoolSwap is IFlashLoanReceiver {
    IVault private vault;
    IERC20 private token;
    IStaticATokenLM private wrappedHToken;
    bytes32 private poolId;
    ILendingPool private lendingPool;
    ILinearPool private linearPool;
    uint256 constant UINT256_MAX = type(uint256).max;
    enum op {
        WIND,
        UNWIND,
        NOTHING
    }

    constructor(
        address vaultAddress,
        address lendingPoolAddress,
        address tokenAddress,
        address wrappedHTokenAddress,
        address linearPoolAddress,
        bytes32 _poolId
    ) {
        vault = IVault(vaultAddress);
        lendingPool = ILendingPool(lendingPoolAddress);
        token = IERC20(tokenAddress);
        wrappedHToken = IStaticATokenLM(wrappedHTokenAddress);
        linearPool = ILinearPool(linearPoolAddress);
        poolId = _poolId;
    }

    function getBalancingOperation(
        uint256 threshold
    ) public view returns (op operation, uint256 amount) {
        (uint256 _lowerTarget, uint256 _upperTarget) = linearPool.getTargets();
        uint256 lowerTarget = (_lowerTarget / (10 ** (18 - token.decimals())));
        uint256 upperTarget = (_upperTarget / (10 ** (18 - token.decimals())));
        (uint256 balance, , , ) = vault.getPoolTokenInfo(poolId, token);
        uint256 midTarget = (upperTarget + lowerTarget) / 2;
        (uint256 avaibleToSwap, , , ) = vault.getPoolTokenInfo(
            poolId,
            wrappedHToken
        );

        if (balance < lowerTarget) {
            operation = op.UNWIND;
            amount = Math.min(
                midTarget - balance,
                (avaibleToSwap * 9500) / 10000
            );
            amount = amount > threshold ? amount : 0;
        } else if (balance > upperTarget) {
            operation = op.WIND;
            amount = balance - midTarget;
        } else {
            operation = op.NOTHING;
            amount = 0;
        }
    }

    function checkIfPoolIsOutsideRange(
        uint256 threshold
    ) public view returns (bool) {
        (op operation, uint256 amount) = getBalancingOperation(threshold);
        return (operation != op.NOTHING);
    }

    function balancePool(uint256 threshold) public {
        (op operation, uint256 amount) = getBalancingOperation(threshold);
        IERC20 aToken = wrappedHToken.ATOKEN();
        uint256 availableLiquidity = token.balanceOf(address(aToken));
        if (operation == op.UNWIND) {
            availableLiquidity = amount > (availableLiquidity * 30) / 100
                ? (availableLiquidity * 30) / 100
                : availableLiquidity;
        }
        uint256 counter = Math.min((amount / availableLiquidity) + 1, 10);

        uint256 amountToBorrow = amount / counter;

        address[] memory tokens = new address[](1);
        tokens[0] = address(token);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amountToBorrow;

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        bytes memory params = abi.encode(operation, msg.sender, counter);

        lendingPool.flashLoan(
            address(this),
            tokens,
            amounts,
            modes,
            address(this),
            params,
            0
        );
    }

    function windXTimes(uint8 counter, uint256 amount) public {
        token.transferFrom(msg.sender, address(this), amount);

        for (uint8 i = 0; i < counter; i++) {
            wind();
        }

        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    // Decrease main tokens in pool and increase wrapped tokens
    function wind() private {
        token.approve(address(wrappedHToken), UINT256_MAX);

        wrappedHToken.deposit(
            address(this),
            token.balanceOf(address(this)),
            0,
            true
        );
        wrappedHToken.approve(address(vault), UINT256_MAX);

        bytes memory userDataEncoded = "";

        IVault.SingleSwap memory singleSwap = IVault.SingleSwap(
            poolId,
            IVault.SwapKind.GIVEN_IN,
            IAsset(address(wrappedHToken)),
            IAsset(address(token)),
            wrappedHToken.balanceOf(address(this)),
            userDataEncoded
        );
        IVault.FundManagement memory fundManagement = IVault.FundManagement(
            address(this),
            false,
            payable(address(this)),
            false
        );

        uint256 limit = (wrappedHToken.balanceOf(address(this)) * 90) / 100;
        vault.swap(singleSwap, fundManagement, limit, UINT256_MAX);
    }

    function unwindXTimes(uint8 counter, uint256 amount) public {
        token.transferFrom(msg.sender, address(this), amount);

        for (uint8 i = 0; i < counter; i++) {
            unwind();
        }

        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    // Increase base tokens in pool and decrease wrapped tokens
    function unwind() private {
        token.approve(address(vault), UINT256_MAX);

        bytes memory userDataEncoded = "";

        IVault.SingleSwap memory singleSwap = IVault.SingleSwap(
            poolId,
            IVault.SwapKind.GIVEN_IN,
            IAsset(address(token)),
            IAsset(address(wrappedHToken)),
            token.balanceOf(address(this)),
            userDataEncoded
        );
        IVault.FundManagement memory fundManagement = IVault.FundManagement(
            address(this),
            false,
            payable(address(this)),
            false
        );

        uint256 limit = (token.balanceOf(address(this)) * 90) / 100;
        vault.swap(singleSwap, fundManagement, limit, UINT256_MAX);

        wrappedHToken.withdraw(
            address(this),
            wrappedHToken.balanceOf(address(this)),
            true
        );
    }

    function flashLoanWind(uint8 counter, uint256 amount) public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(token);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        bytes memory params = abi.encode(op.WIND, msg.sender, counter);

        lendingPool.flashLoan(
            address(this),
            tokens,
            amounts,
            modes,
            address(this),
            params,
            0
        );
    }

    // counter should be up to 10 because of gas limit
    function flashLoanUnwind(uint8 counter, uint256 amount) public {
        address[] memory tokens = new address[](1);
        tokens[0] = address(token);

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        uint256[] memory modes = new uint256[](1);
        modes[0] = 0;

        bytes memory params = abi.encode(op.UNWIND, msg.sender, counter);

        lendingPool.flashLoan(
            address(this),
            tokens,
            amounts,
            modes,
            address(this),
            params,
            0
        );
    }

    function executeOperation(
        address[] calldata assets,
        uint256[] calldata amounts,
        uint256[] calldata premiums,
        address initiator,
        bytes calldata params
    ) external override returns (bool) {
        op decodedData;
        address originalSender;
        uint8 counter;
        (decodedData, originalSender, counter) = abi.decode(
            params,
            (op, address, uint8)
        );

        if (decodedData == op.WIND) {
            for (uint8 i = 0; i < counter; i++) {
                wind();
            }
        } else if (decodedData == op.UNWIND) {
            for (uint8 i = 0; i < counter; i++) {
                unwind();
            }
        }

        uint256 currentBalance = token.balanceOf(address(this));
        uint256 returnValue = amounts[0] + premiums[0];

        if (returnValue > currentBalance) {
            revert("Negative profit!");
        } else if (returnValue < currentBalance) {
            token.transfer(originalSender, currentBalance - returnValue);
        }

        token.approve(address(lendingPool), returnValue);
        return true;
    }
}
