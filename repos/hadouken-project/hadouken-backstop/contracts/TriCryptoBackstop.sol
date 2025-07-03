// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ILiquidation} from "./ILiquidation.sol";
import { SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/security/ReentrancyGuard.sol";


contract TriCryptoBackstop is ReentrancyGuard, Ownable, ERC20 {
    using SafeERC20 for IERC20;

    ILiquidation public liquidation;
    IERC20 public liquidationToken;

    event Deposit(address indexed user, uint amount, uint lpTokenAmountMint);
    event Withdraw(address indexed user, uint amount, uint lpTokenAmountBurn);
    event Liquidation(address indexed user, address debtToken, address collateralToken, uint256 repayAmount, uint256 profit);

    constructor(address _liquidationTokenAddress, ILiquidation _liquidation) ERC20("Hadouken Backstop Token", "HDKB") {
        liquidationToken = IERC20(_liquidationTokenAddress);
        liquidation = _liquidation;
    }

    function cBorrow() public view returns (address) {
        return address(liquidation);
    }

    function setLiquidation( ILiquidation _liquidation) external onlyOwner {
        liquidation = _liquidation;
    }

    function deposit(uint256 tokenAmount) external nonReentrant {
        uint256 lpTokens;

        if (this.totalSupply() == 0) {
            lpTokens = tokenAmount;
        } else {
            lpTokens = tokenAmount * this.totalSupply() / liquidationToken.balanceOf(address(this));
        }

        liquidationToken.safeTransferFrom(
            msg.sender,
            address(this),
            tokenAmount
        );

        _mint(msg.sender, lpTokens);

        emit Deposit(msg.sender, tokenAmount, lpTokens);
    }

    function withdraw(uint lpTokenAmount) external nonReentrant {
        uint256 totalShares = liquidationToken.balanceOf(address(this));
        uint256 totalLpTokens = this.totalSupply();

        require(totalLpTokens >= lpTokenAmount, "Not enought tokens in pool");

        uint256 amount = totalShares * lpTokenAmount / totalLpTokens;
        
        liquidationToken.safeTransfer(msg.sender, amount);

        _burn(msg.sender, lpTokenAmount);

        emit Withdraw(msg.sender, amount, lpTokenAmount);
    }

    function liquidate(
        address debtToken,
        address collateralToken,
        address user,
        uint repayAmount
    ) external nonReentrant returns (int256) {
        int256 delta = _liquidate(debtToken, collateralToken, user, repayAmount);

        require(delta > 0, 'Liquidation not profitable');

        emit Liquidation(user, debtToken, collateralToken, repayAmount, uint256(delta));

        return delta;
    }

    function canLiquidate(
        address debtToken,
        address collateralToken,
        address user,
        uint256 repayAmount
    ) external returns (bool) {
        if (msg.sender != address(this)) {
            // We perform an external call to ourselves, forwarding the same calldata. In this call, the else clause of
            // the preceding if statement will be executed instead.
            // solhint-disable-next-line avoid-low-level-calls
            (bool success, bytes memory result) = address(this).call(msg.data);

            // solhint-disable-next-line no-inline-assembly
            assembly {
                // This call should always revert to decode the actual asset deltas from the revert reason
                switch success
                case 0 {              
                    let error := and(
                        mload(add(result, 0x20)),
                        0xffffffff00000000000000000000000000000000000000000000000000000000
                    )

                    // If the first 4 bytes don't match with the expected signature, we return false.
                    // QueryError(int256) 0x72856601
                    if eq(
                        eq(
                            error,
                            0x7285660100000000000000000000000000000000000000000000000000000000
                        ),
                        0
                    ) {
                        mstore(0, 0)
                        return(0, 32)
                    }

                 
                    let delta := mload(add(result, 0x24))

                    if eq(sgt(delta, 0), 1) {
                        mstore(0, 1)
                        return(0, 32)
                    }

                    mstore(0, 0)
                    return(0, 32)
                }
                default {
                    // This call should always revert, but we fail nonetheless if that didn't happen
                    invalid()
                }
            }
        } else {
            int256 result = _liquidate(
                debtToken,
                collateralToken,
                user,
                repayAmount
            );

            // solhint-disable-next-line no-inline-assembly
            assembly {
                let resultPointer := 0x0

                mstore(
                    resultPointer,
                    0x7285660100000000000000000000000000000000000000000000000000000000
                )

                mstore(add(resultPointer, 0x4), result)

                // Revert with QueryError(int256) signature + result in256
                revert(resultPointer, 0x24)
            }
        }
    }

    function _liquidate(
        address debtToken,
        address collateralToken,
        address user,
        uint repayAmount
    ) private returns (int256) {
        uint256 lpTokensBefore = liquidationToken.balanceOf(address(this));

        liquidationToken.safeTransfer(address(liquidation), lpTokensBefore);
        liquidation.liquidate(debtToken, collateralToken, user, repayAmount);

        uint256 lpTokensAfter = liquidationToken.balanceOf(address(this));

        int256 delta = int256(lpTokensAfter) - int256(lpTokensBefore);

        return delta;
    }
}
