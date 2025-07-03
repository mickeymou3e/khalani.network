// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AssetRegistry} from "./AssetRegistry.sol";
import {IEventProver} from "../interfaces/IEventProver.sol";
import {IEventVerifier} from "../interfaces/IEventVerifier.sol";
import {AIPEventPublisher} from "../common/AIPEventPublisher.sol";
import {AssetReserveDeposit} from "../types/Events.sol";
import {AIPEventHandler} from "../common/AIPEventHandler.sol";
import {XChainEvent, DEPOSIT_EVENT} from "../types/Events.sol";
import {AbstractAIPEventHandler} from "../common/AbstractAIPEventHandler.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IPermit2} from "../interfaces/IPermit2.sol";

contract AssetReserves is AssetRegistry, AccessControl {
    using SafeERC20 for IERC20;

    AIPEventPublisher public aipEventPublisher;
    AbstractAIPEventHandler public eventHandler;
    IPermit2 public immutable PERMIT2;

    mapping(address => uint256) public reserves;
    uint256 public nonce;

    bytes32 public constant DEPOSIT_EVENT_ID = keccak256("DEPOSIT_EVENT");
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    event AssetDeposited(address indexed token, address indexed depositor, uint256 amount);
    event AssetWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    constructor(address admin, address _aipEventPublisher, address _eventHandler, address _permit2Address)
        AssetRegistry(admin)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WITHDRAW_ROLE, admin);

        aipEventPublisher = AIPEventPublisher(_aipEventPublisher);
        eventHandler = AbstractAIPEventHandler(_eventHandler);
        PERMIT2 = IPermit2(_permit2Address);
    }

    function deposit(address token, uint256 amount, uint256 permitNonce, uint256 deadline, bytes calldata signature)
        external
        payable
    {
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");

        PERMIT2.permitTransferFrom(
            IPermit2.PermitTransferFrom({
                permitted: IPermit2.TokenPermissions({token: IERC20(token), amount: amount}),
                nonce: permitNonce,
                deadline: deadline
            }),
            IPermit2.SignatureTransferDetails({to: address(this), requestedAmount: amount}),
            msg.sender,
            signature
        );

        reserves[token] += amount;

        AssetReserveDeposit memory depositEvent = AssetReserveDeposit(token, amount, msg.sender);
        bytes memory eventData = abi.encode(depositEvent, nonce);
        aipEventPublisher.publishEvent{value: msg.value}(eventData, DEPOSIT_EVENT);

        emit AssetDeposited(token, msg.sender, amount);
        nonce++;
    }

    function withdraw(address token, uint256 amount) external onlyRole(WITHDRAW_ROLE) {
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");
        require(reserves[token] >= amount, "AssetReserves: insufficient reserves");

        reserves[token] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);

        emit AssetWithdrawn(token, msg.sender, amount);
    }

    function getReserves(address token) external view returns (uint256) {
        return reserves[token];
    }

    // Function to handle cross-chain withdrawals (to be called by AIPEventHandler)
    function handleCrossChainWithdrawal(address token, address recipient, uint256 amount) external {
        require(msg.sender == address(eventHandler), "AssetReserves: unauthorized");
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");
        require(reserves[token] >= amount, "AssetReserves: insufficient reserves");

        reserves[token] -= amount;
        IERC20(token).safeTransfer(recipient, amount);

        emit AssetWithdrawn(token, recipient, amount);
    }
}
