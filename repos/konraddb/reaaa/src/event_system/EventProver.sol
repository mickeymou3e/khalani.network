// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

import {IEventProver} from "./interfaces/IEventProver.sol";
import {XChainEvent} from "../types/Events.sol";
import {IMailbox} from "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import {IInterchainGasPaymaster} from "@hyperlane-xyz/core/contracts/interfaces/IInterchainGasPaymaster.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import {IGasPriceOracle} from "../interfaces/IGasPriceOracle.sol";
import {GasAmountOracle} from "./GasAmountOracle.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract EventProver is IEventProver, Ownable {
    error EventProver__UnauthorizedEventPublisher();
    error EventProver__EventAlreadyRegistered();

    IMailbox public immutable mailbox;
    IInterchainGasPaymaster public immutable interchainGasPaymaster;
    GasAmountOracle public immutable gasAmountOracle;

    uint32 public immutable localDomain;
    address public immutable i_remoteVerifier;
    uint32 public immutable i_destinationChainId;
    address private s_eventPublisher;

    mapping(bytes32 => bool) private registeredEvents;

    modifier onlyEventPublisher() {
        if (msg.sender != s_eventPublisher) {
            revert EventProver__UnauthorizedEventPublisher();
        }
        _;
    }

    constructor(
        address _mailbox,
        address _remoteVerifier,
        uint32 _destinationChainId,
        address _interchainGasPaymaster,
        address _gasAmountOracle
    ) Ownable() {
        mailbox = IMailbox(_mailbox);
        localDomain = mailbox.localDomain();
        i_destinationChainId = _destinationChainId;
        i_remoteVerifier = _remoteVerifier;
        interchainGasPaymaster = IInterchainGasPaymaster(_interchainGasPaymaster);
        gasAmountOracle = GasAmountOracle(_gasAmountOracle);
    }

    function addEventPublisher(address _eventPublisher) external onlyOwner {
        s_eventPublisher = _eventPublisher;
    }

    function registerEvent(XChainEvent calldata _event) external payable override onlyEventPublisher {
        bytes32 eventHash = keccak256(abi.encode(_event));
        if (isEventRegistered(eventHash)) {
            revert EventProver__EventAlreadyRegistered();
        }
        registeredEvents[eventHash] = true;

        uint256 fee = mailbox.quoteDispatch(
            i_destinationChainId, TypeCasts.addressToBytes32(i_remoteVerifier), abi.encode(_event)
        );
        // Dispatch the message and retrieve the message ID
        bytes32 messageId = mailbox.dispatch{value: fee}(
            i_destinationChainId, TypeCasts.addressToBytes32(i_remoteVerifier), abi.encode(_event)
        );

        uint256 gasAmount = estimateGasAmount();
        uint256 gasPayment = interchainGasPaymaster.quoteGasPayment(uint32(i_destinationChainId), gasAmount);

        // Pay for gas after message dispatch, using the messageId and proper calculations
        interchainGasPaymaster.payForGas{value: gasPayment}(
            messageId, uint32(i_destinationChainId), estimateGasAmount(), msg.sender
        );
    }

    function estimateGasAmount() public view returns (uint256 gasAmount) {
        gasAmount = gasAmountOracle.getGasAmount(localDomain, i_destinationChainId);
        require(gasAmount > 0, "GasAmountOracle: Gas amount not set");
    }

    function isEventRegistered(bytes32 eventHash) public view returns (bool) {
        return registeredEvents[eventHash];
    }
}
