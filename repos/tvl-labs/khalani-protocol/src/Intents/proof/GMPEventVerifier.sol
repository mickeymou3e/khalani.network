pragma solidity ^0.8.4;

import "./EventVerifier.sol";
import "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import "hyperlane-monorepo/solidity/contracts/interfaces/IMessageRecipient.sol";
import "openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol";
import "hyperlane-monorepo/solidity/contracts/interfaces/IInterchainSecurityModule.sol";

//TODO : deploy these contracts through minimal proxy on khalani chain and normally on spoke chains
/**
 * @title GMPEventVerifier
 * @dev A contract that extends EventVerifier and implements IMessageRecipient to handle event proofs via Hyperlane
 */
abstract contract GMPEventVerifier is EventVerifier, IMessageRecipient, AccessControlEnumerable {

    //role identifier for event registerers
    bytes32 internal constant EVENT_REGISTERER = keccak256("EVENT_REGISTERER");

    //public vars
    uint32 public proverChainDomain;
    address public mailbox;
    IInterchainSecurityModule public ism;

    mapping(bytes32 eventHash => bool) public provedEvents;

    event NewEventRegistered(bytes32 indexed eventHash);

    modifier onlyMailbox() {
        require(_msgSender() == mailbox, "invalid mailbox");
        _;
    }

    constructor(){
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    /**
     * @dev Initializes the contract setting up the spoke chain domain and mailbox address.
     * @param _proverChainDomain The domain identifier of the prover chain.
     * @param _mailbox The address of the mailbox contract.
     */
    function initialise(uint32 _proverChainDomain, address _mailbox, address _ism) external {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        proverChainDomain = _proverChainDomain;
        mailbox = _mailbox;
        ism = IInterchainSecurityModule(_ism);
    }

    /**
     * @dev provides a event registerer role to specified account
     * @param eventRegisterer The account address to be added as a event registerer
     */
    function addEventRegisterer(address eventRegisterer) external virtual {
        _checkRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(EVENT_REGISTERER, eventRegisterer);
    }

    /**
     * @notice This function is only applicable for GMP where we check wheater the event hash is registered or not
     * @dev Implements the verify function of the EventVerifier Contract
     * @param eventHash The hash of an event
     * @return A boolean indicating whether the eventHash is registered
     */
    function verify(bytes32 eventHash) external view override returns(bool) {
        return provedEvents[eventHash];
    }

    /**
     * @dev Registers an event by its event hash for proof.
     * @param eventHash The hash of the event to be registered.
     */
    function registerEvent(bytes32 eventHash) internal {
        provedEvents[eventHash] = true;
        emit NewEventRegistered(eventHash);
    }

    /**
     * @dev Handles incoming messages from the mailbox, and registers the decoded event hash
     * @param _origin The domain identifier of the origin chain.
     * @param _sender The sender's identifier on the origin chain.
     * @param _message The encoded message payload containing the event hash
     */
    function handle(
        uint32 _origin,
        bytes32 _sender,
        bytes calldata _message
    )  external payable override onlyMailbox {
        require(_origin == proverChainDomain, "invalid chain id");
        _checkRole(EVENT_REGISTERER, TypeCasts.bytes32ToAddress(_sender));
        bytes32 eventHash;
        eventHash = abi.decode(_message, (bytes32));
        registerEvent(eventHash);
    }
}