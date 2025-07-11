pragma solidity ^0.8.0;

import "@hyperlane-xyz/core/contracts/interfaces/IMailbox.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IInterchainSecurityModule.sol";
import "@hyperlane-xyz/core/contracts/interfaces/IMessageRecipient.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import "../interfaces/IRequestProcessorFacet.sol";
import "../interfaces/IAdapter.sol";
import "../gasPayment/IGasPayMaster.sol";
import "../Errors.sol";

contract HyperlaneAdapter is IAdapter, IMessageRecipient, ReentrancyGuard {
    IMailbox public immutable mailbox;
    IInterchainSecurityModule public immutable interchainSecurityModule;
    IGasPayMaster public immutable interchainGasPaymaster;
    address public immutable nexus;

    constructor(address _mailbox, address _ism, address _nexus, address _igp){
        mailbox = IMailbox(_mailbox);
        interchainSecurityModule = IInterchainSecurityModule(_ism);
        nexus = _nexus;
        interchainGasPaymaster = IGasPayMaster(_igp);
    }

    modifier onlyMailbox() {
        if(msg.sender != address(mailbox)){
            revert InvalidInbox();
        }
        _;
    }

    modifier onlyNexus() {
        if(msg.sender != nexus){
            revert InvalidNexus();
        }
        _;
    }

    /**
    * @dev Relay a message to another chain
    * @param chain The destination chain
    * @param receiver The destination address
    * @param payload The message payload
    */
    function relayMessage(uint chain,bytes32 receiver, bytes calldata payload) external nonReentrant override onlyNexus returns (bytes32 messageId) {
        //call hyperlane's mailbox to send message to destination chain
        messageId = mailbox.dispatch(
            uint32(chain),
            receiver,
            payload
        );
    }

    /**
    * @dev Relay a message to another chain
    */
    function payRelayer(
        bytes32 _messageId,
        uint256 _destinationDomain,
        uint256 _numTokens,
        address _refundAddress
    ) external payable override {
        interchainGasPaymaster.payForGas{value : msg.value}(
            _messageId,
            uint32(_destinationDomain),
            _numTokens,
            _refundAddress
        );
    }

    /**
    * @dev wrapper function for interchainGasPaymaster.quoteGasPayment
    */
    function quoteSend(uint256 _destinationDomain, uint256 _numTokens) external view returns (uint256) {
        return interchainGasPaymaster.quoteSend(uint32(_destinationDomain), _numTokens);
    }

    /**
    * @dev hyperlane IMessageRecipient handle
    */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    )  external override onlyMailbox {
        //call nexus request processor facet
        IRequestProcessorFacet(nexus).processRequest(
            uint256(_origin),
            _sender,
            _message
        );
    }
}