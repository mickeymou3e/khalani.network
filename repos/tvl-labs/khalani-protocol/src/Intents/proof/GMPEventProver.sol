pragma solidity ^0.8.4;

import "./EventProver.sol";
import "openzeppelin-contracts/contracts/access/AccessControlEnumerable.sol";
import "hyperlane-monorepo/solidity/contracts/interfaces/IInterchainGasPaymaster.sol";
import "hyperlane-monorepo/solidity/contracts/interfaces/IMailbox.sol";
import "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";

/**
 * @title GMPEventProver
 * @dev A contract that extends EventProver to send event proofs via Hyperlane.
 */
abstract contract GMPEventProver is EventProver, AccessControlEnumerable {

    // Role identifier for a event registerer
    bytes32 internal constant EVENT_REGISTERER = keccak256("EVENT_REGISTERER");

    // Address of the GMPEventVerifier contract on the destination chain
    address public gmpEventVerifierDestination;

    // Hyperlane Contracts
    IMailbox public hyperlaneMailbox;
    IInterchainGasPaymaster public hyperlaneIgp;

    // Domain of the destination chain
    uint32 public destinationChainDomain;

    constructor(address _gmpEventVerifier, address _hyperlaneMailbox, address _hyperlaneIgp, uint32 _destinationChainDomain) {
        _grantRole(DEFAULT_ADMIN_ROLE,  _msgSender());
        gmpEventVerifierDestination = _gmpEventVerifier;
        hyperlaneMailbox = IMailbox(_hyperlaneMailbox);
        hyperlaneIgp = IInterchainGasPaymaster(_hyperlaneIgp);
        destinationChainDomain = _destinationChainDomain;
    }

    /**
     * @dev provides a event registerer role to specified account
     * @param eventRegisterer The account address to be added as a event registerer
     */
    function addEventRegisterer(address eventRegisterer) public virtual {
        _checkRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _grantRole(EVENT_REGISTERER, eventRegisterer);
    }

    /**
     * @dev Registers an event hash to the hub chain via Hyperlane.
     * @param eventHash The hash of the event to be registered.
     */
    function registerEvent(bytes32 eventHash) public override {
        _checkRole(EVENT_REGISTERER);

        bytes32 dispatchId = hyperlaneMailbox.dispatch(
            destinationChainDomain,
            TypeCasts.addressToBytes32(gmpEventVerifierDestination),
            abi.encode(eventHash)
        );
        //TODO : pay for gas ? , if protocol pays for gas then this contract address should be funded we need to think about "quote for gas" in this case
    }
}
