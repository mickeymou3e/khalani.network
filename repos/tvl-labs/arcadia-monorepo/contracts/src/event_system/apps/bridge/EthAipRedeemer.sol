// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract EthAipRedeemer is Ownable {
    using SafeERC20 for IERC20;

    error EthAipRedeemer__NotEnoughEth();
    error EthAipRedeemer__NotAuthorized();
    error EthAipRedeemer__InvalidTokenAddress();
    error EthAipRedeemer__InvalidDepositAmount();
    error EthAipRedeemer__ZeroRateNotAllowed();
    error EthAipRedeemer__InvalidRedeemerAddress();

    event Redeemed(address indexed redeemer, uint256 indexed amount);
    event Deposited(address indexed depositor, uint256 indexed amount);

    address public s_ethMToken;
    uint256 public s_aipBalance;
    uint256 public s_aipEthRate;
    mapping(address redeemer => bool authorized) public s_redeemers;

    constructor(address _ethMToken) Ownable() {
        if (_ethMToken == address(0)) {
            revert EthAipRedeemer__InvalidTokenAddress();
        }
        s_ethMToken = _ethMToken;
    }

    function depositEthMToken(uint256 amount) external {
        if (amount == 0) {
            revert EthAipRedeemer__InvalidDepositAmount();
        }
        IERC20(s_ethMToken).safeTransferFrom(msg.sender, address(this), amount);
        emit Deposited(msg.sender, amount);
    }

    function redeemAip() external payable {
        if (!s_redeemers[msg.sender]) {
            revert EthAipRedeemer__NotAuthorized();
        }
        if (s_aipEthRate == 0) {
            revert EthAipRedeemer__ZeroRateNotAllowed();
        }

        uint256 ethAmount = (msg.value * s_aipEthRate) / 1e18;
        if (ethAmount > IERC20(s_ethMToken).balanceOf(address(this))) {
            revert EthAipRedeemer__NotEnoughEth();
        }

        s_aipBalance += msg.value;
        IERC20(s_ethMToken).safeTransfer(msg.sender, ethAmount);
        emit Redeemed(msg.sender, msg.value);
    }

    function addRedeemer(address _redeemer) external onlyOwner {
        if (_redeemer == address(0)) {
            revert EthAipRedeemer__InvalidRedeemerAddress();
        }
        s_redeemers[_redeemer] = true;
    }

    function removeRedeemer(address _redeemer) external onlyOwner {
        if (!s_redeemers[_redeemer]) {
            revert EthAipRedeemer__NotAuthorized();
        }
        s_redeemers[_redeemer] = false;
    }

    function setEthMToken(address _ethMToken) external onlyOwner {
        if (_ethMToken == address(0)) {
            revert EthAipRedeemer__InvalidTokenAddress();
        }
        s_ethMToken = _ethMToken;
    }

    function setAipEthRate(uint256 rate) external onlyOwner {
        if (rate == 0) {
            revert EthAipRedeemer__ZeroRateNotAllowed();
        }
        s_aipEthRate = rate;
    }
}
