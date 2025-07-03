// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AssetRegistry} from "./AssetRegistry.sol";
import {IEventProver} from "../../interfaces/IEventProver.sol";
import {IEventVerifier} from "../../interfaces/IEventVerifier.sol";
import {IEventPublisher} from "../../interfaces/IEventPublisher.sol";
import {IEventProducer} from "../../interfaces/IEventProducer.sol";
import {IEventProcessor} from "../../interfaces/IEventProcessor.sol";
import {SpokeHandler} from "../../SpokeHandler.sol";
import {SpokePublisher} from "../../SpokePublisher.sol";
import {AssetReserveDeposit} from "../../../types/Events.sol";
import {XChainEvent, MTokenWithdrawal} from "../../../types/Events.sol";
import {IEventHandler} from "../../interfaces/IEventHandler.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IPermit2} from "../../../interfaces/IPermit2.sol";

// Producer on spoke chains to send deposit events to hub
// Processor on spoke chains to handle withdrawal events sent from the hub
contract AssetReserves is AssetRegistry, AccessControl, IEventProducer, IEventProcessor {
    using SafeERC20 for IERC20;

    IEventPublisher public spokePublisher;
    IEventHandler public spokeHandler;
    IPermit2 public immutable PERMIT2;

    mapping(address => uint256) public reserves;
    uint256 public nonce;

    bytes32 public constant DEPOSIT_EVENT_ID = keccak256("DEPOSIT_EVENT");
    bytes32 public constant WITHDRAW_ROLE = keccak256("WITHDRAW_ROLE");

    event AssetDeposited(address indexed token, address indexed depositor, uint256 amount);
    event AssetWithdrawn(address indexed token, address indexed recipient, uint256 amount);

    constructor(address admin, address _spokePublisher, address _spokeHandler, address _permit2Address)
        AssetRegistry(admin)
    {
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(WITHDRAW_ROLE, admin);

        spokePublisher = IEventPublisher(_spokePublisher);
        spokeHandler = IEventHandler(_spokeHandler);
        PERMIT2 = IPermit2(_permit2Address);
    }

    function produceEvent(bytes calldata eventData, uint32 destChain) external payable override {
        spokePublisher.publishEvent{value: msg.value}(eventData, DEPOSIT_EVENT_ID, destChain);
    }

    function processEvent(XChainEvent calldata _event, uint32 originChain) external {
        require(msg.sender == address(spokeHandler), "AssetReserves: unauthorized");
        bytes memory eventData = _event.eventData;
        MTokenWithdrawal memory withdrawalEvent = abi.decode(eventData, (MTokenWithdrawal));
        withdraw(withdrawalEvent.token, withdrawalEvent.amount, withdrawalEvent.withdrawer);
    }

    function withdraw(address token, uint256 amount, address to) private {
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");
        require(reserves[token] >= amount, "AssetReserves: insufficient reserves");

        reserves[token] -= amount;
        uint256 transferAmount = _scaleDownAmount(token, amount);
        IERC20(token).safeTransfer(to, transferAmount);

        emit AssetWithdrawn(token, to, amount);
    }

    function deposit(
        address token,
        uint256 amount,
        uint32 destChain,
        uint256 permitNonce,
        uint256 deadline,
        bytes calldata signature
    ) external payable {
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

        uint256 scaledAmount = _scaleUpAmount(token, amount);
        reserves[token] += scaledAmount;

        AssetReserveDeposit memory depositEvent = AssetReserveDeposit(token, scaledAmount, msg.sender);
        bytes memory eventData = abi.encode(depositEvent, nonce);
        spokePublisher.publishEvent{value: msg.value}(eventData, DEPOSIT_EVENT_ID, destChain);

        emit AssetDeposited(token, msg.sender, scaledAmount);
        nonce++;
    }

    function getReserves(address token) external view returns (uint256) {
        return reserves[token];
    }

    function _scaleUpAmount(address token, uint256 amount) internal view returns (uint256) {
        uint8 decimals = tokenDecimals[token];

        if (decimals < 18) {
            return amount * (10 ** (18 - decimals));
        } else if (decimals > 18) {
            return amount / (10 ** (decimals - 18));
        } else {
            return amount;
        }
    }

    function _scaleDownAmount(address token, uint256 amount) internal view returns (uint256) {
        uint8 decimals = tokenDecimals[token];

        if (decimals < 18) {
            return amount / (10 ** (18 - decimals));
        } else if (decimals > 18) {
            return amount * (10 ** (decimals - 18));
        } else {
            return amount;
        }
    }
}
