// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AssetRegistry} from "./AssetRegistry.sol";
import {IEventPublisher} from "../../interfaces/IEventPublisher.sol";
import {IEventProducer} from "../../interfaces/IEventProducer.sol";
import {IEventProcessor} from "../../interfaces/IEventProcessor.sol";
import {AssetReserveDeposit} from "../../../types/Events.sol";
import {XChainEvent, MTokenWithdrawal} from "../../../types/Events.sol";
import {IEventHandler} from "../../interfaces/IEventHandler.sol";
import {IPermit2} from "../../../interfaces/IPermit2.sol";
import {ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH} from "../../../types/Events.sol";
// Producer on spoke chains to send deposit events to hub
// Processor on spoke chains to handle withdrawal events sent from the hub

contract AssetReserves is AssetRegistry, IEventProducer, IEventProcessor {
    using SafeERC20 for IERC20;

    // ***************** //
    // *** ERRORS *** //
    // ***************** //
    error AssetReserves__EventAlreadyProcessed(bytes32 eventHash);
    error AssetReserves__OnlyEventHandlerCanCall();

    // ***************** //
    // *** EVENTS *** //
    // ***************** //

    event AssetDeposited(address indexed token, address indexed depositor, uint256 amount);
    event AssetWithdrawn(address indexed token, address indexed recipient, uint256 amount);
    event Refunded(address indexed agent, address indexed user, address indexed token, uint256 amount);
    event EventProcessed(bytes32 indexed eventHash);

    // ***************** //
    // *** VARIABLES *** //
    // ***************** //

    IEventPublisher public spokePublisher;
    IEventHandler public spokeHandler;
    IPermit2 public immutable PERMIT2;

    mapping(address => uint256) public reserves;
    mapping(bytes32 => bool) public processedEvents;
    mapping(bytes32 => bool) public producedEvents;

    uint256 public nonce;

    bytes32 public immutable i_depositEventTypeHash;
    bytes32 public immutable i_depositEventType;

    // ***************** //
    // *** MODIFIERS *** //
    // ***************** //

    modifier onlyEventHandler() {
        if (msg.sender != address(spokeHandler)) {
            revert AssetReserves__OnlyEventHandlerCanCall();
        }
        _;
    }

    // ***************** //
    // *** FUNCTIONS *** //
    // ***************** //
    constructor(address admin, address _spokePublisher, address _spokeHandler, address _permit2Address)
        AssetRegistry(admin)
    {
        i_depositEventTypeHash = ASSET_RESERVE_DEPOSIT_STRUCT_TYPE_HASH;
        i_depositEventType = keccak256(abi.encode(address(this), i_depositEventTypeHash));

        require(_spokePublisher != address(0), "SpokePublisher address cannot be 0");
        require(_spokeHandler != address(0), "SpokeHandler address cannot be 0");
        require(_permit2Address != address(0), "Permit2 address cannot be 0");

        spokePublisher = IEventPublisher(_spokePublisher);
        spokeHandler = IEventHandler(_spokeHandler);
        PERMIT2 = IPermit2(_permit2Address);
    }
    // ***************** //
    // **** EXTERNAL **** //
    // ***************** //

    function processEvent(XChainEvent calldata _event, uint32 originChain) external onlyEventHandler {
        require(msg.sender == address(spokeHandler), "AssetReserves: unauthorized");
        bytes32 eventHash = keccak256(abi.encode(_event));
        if (processedEvents[eventHash]) {
            revert AssetReserves__EventAlreadyProcessed(eventHash);
        }
        processedEvents[eventHash] = true;
        bytes memory eventData = _event.eventData;

        MTokenWithdrawal memory withdrawalEvent = abi.decode(eventData, (MTokenWithdrawal));
        emit EventProcessed(eventHash);
        _withdraw(withdrawalEvent.token, withdrawalEvent.amount, withdrawalEvent.withdrawer);
    }

    function deposit(address token, uint256 amount, uint32 destChain) external payable {
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");
        uint256 scaledAmount = _scaleUpAmount(token, amount);
        reserves[token] = reserves[token] + scaledAmount;
        nonce++;

        AssetReserveDeposit memory depositEvent = AssetReserveDeposit(token, scaledAmount, msg.sender);
        bytes memory eventData = abi.encode(depositEvent, nonce);
        emit AssetDeposited(token, msg.sender, scaledAmount);

        // Keep amount here, rather than scaled amount, since scaling is required when the amount is not at expected precision in arcadia.
        // Therefore, when interacting directly with the token, we need to use the token's native precision.
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        spokePublisher.publishEvent{value: msg.value}(eventData, i_depositEventType, destChain);
    }

    function deposit(
        address token,
        uint256 amount,
        uint32 destChain,
        uint256 permitNonce,
        uint256 deadline,
        address recipient,
        bytes calldata signature
    ) external payable {
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");
        uint256 scaledAmount = _scaleUpAmount(token, amount);
        reserves[token] = reserves[token] + scaledAmount;
        nonce++;

        AssetReserveDeposit memory depositEvent = AssetReserveDeposit(token, scaledAmount, recipient);
        bytes memory eventData = abi.encode(depositEvent, nonce);

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

        spokePublisher.publishEvent{value: msg.value}(eventData, i_depositEventType, destChain);

        emit AssetDeposited(token, recipient, scaledAmount);
    }

    function setEventHandler(address _eventHandler) external onlyOwner {
        spokeHandler = IEventHandler(_eventHandler);
    }

    // For testing purposes only
    function withdraw(address token, uint256 amount) external onlyOwner {
        _withdraw(token, amount, msg.sender);
    }

    function refundUser(address user, address token, uint256 amount) external onlyOwner {
        _refundInternal(msg.sender, user, token, amount);
    }

    // ***************** //
    // **** INTERNAL **** //
    // ***************** //

    function withdrawTo(address token, uint256 amount, address to) external onlyOwner {
        _withdraw(token, amount, to);
    }

    function _withdraw(address token, uint256 amount, address to) internal {
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");
        require(reserves[token] >= amount, "AssetReserves: insufficient reserves");

        reserves[token] = reserves[token] - amount;

        uint256 transferAmount = _scaleDownAmount(token, amount);
        IERC20(token).safeTransfer(to, transferAmount);

        emit AssetWithdrawn(token, to, amount);
    }

    function _refundInternal(address agent, address user, address token, uint256 amount) internal {
        require(isSupportedAsset(token), "AssetReserves: unsupported asset");
        require(reserves[token] >= amount, "AssetReserves: insufficient reserves");

        reserves[token] = reserves[token] - amount;

        uint256 transferAmount = _scaleDownAmount(token, amount);
        IERC20(token).safeTransfer(user, transferAmount);
        emit Refunded(agent, user, token, amount);
    }

    // ***************** //
    // ** VIEW & PURE ** //
    // ***************** //

    function didProduceEvent(bytes32 eventHash) external view returns (bool) {
        return producedEvents[eventHash];
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
