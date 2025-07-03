pragma solidity ^0.8.4;

import "./KhalaniAssetRegistry.sol";
import {SlowBridgeIntentValidator} from "../SlowBridgeIntentValidator.sol";
import "../../Intents/registry/VerifierRegistry.sol";
import "../../Intents/registry/ProverRegistry.sol";
import "../../Intents/libraries/TokenEventLibrary.sol";
import "../SlowBridgeIntentsLibrary.sol";

//mint burn token based on proofs
contract LiquidityProjectorV2 is KhalaniAssetRegistry, SlowBridgeIntentValidator {

    VerifierRegistry public verifierRegistry;
    ProverRegistry public proverRegistry;
    address public localRewarder;
    uint256 public nonce;

    modifier onlyRewarder() {
        require(msg.sender == localRewarder, "LiquidityProjectorV2: Only rewarder can call this function");
        _;
    }

    constructor(VerifierRegistry _verifierRegistry, ProverRegistry _proverRegistry) {
        verifierRegistry = _verifierRegistry;
        proverRegistry = _proverRegistry;
    }

    function setVerifierRegistry(address _verifierRegistry) external onlyOwner {
        verifierRegistry = VerifierRegistry(_verifierRegistry);
    }

    function setProverRegistry(address _proverRegistry) external onlyOwner {
        proverRegistry = ProverRegistry(_proverRegistry);
    }

    function setLocalRewarder(address _localRewarder) external onlyOwner {
        localRewarder = _localRewarder;
    }

    //function to mint mirror token if TokenEventLibrary.LockToken event is verified
    function mintToken(uint256 intentNonce, address author, uint32 sourceChainId, address receiver, address mirrorToken, uint256 amount) external {

        address sourceToken = getSourceToken(sourceChainId, mirrorToken);

        bytes32 intentId = SlowBridgeIntentsLibrary.calculateLockTokenIntentId(
            intentNonce,
            sourceChainId,
            author,
            sourceToken,
            amount,
            receiver
        );

        //validate if intent is not settled
        require(!isSettled(intentId), "LiquidityProjectorV2: Intent already settled");

        //mark intent as settled
        _markIntentSettled(intentId);

        //verify token lock event
        require(verifierRegistry.proofVerifierForChain(sourceChainId).verify(
            TokenEventLibrary.calculateLockTokenEventHashFromRemoteChain(
                TokenEventLibrary.LockTokenEvent(
                    intentId
                ),
                sourceChainId
            )
        ), "LiquidityProjectorV2: Invalid proof");

        //mint mirror token
        _mintToken(mirrorToken, amount, receiver);
    }

    //function to burn mirror token  and register TokenEventLibrary.UnlockToken event
    function burnToken(uint32 exitChainId, address mirrorToken, uint256 amount, address receiver) external {
        _burnToken(mirrorToken, amount);

        address sourceToken = getSourceToken(exitChainId, mirrorToken);

        //create intent id
        bytes32 intentId = SlowBridgeIntentsLibrary.calculateUnlockTokenIntentId(
            nonce,
            exitChainId,
            msg.sender,
            sourceToken,
            amount,
            receiver
        );

        //create the event hash
        bytes32 eventHash = TokenEventLibrary.calculateUnlockTokenEventHashForRemoteChain(
            TokenEventLibrary.UnlockTokenEvent(
                intentId
            ),
            exitChainId
        );

        //register the event
        proverRegistry.proverForChain(exitChainId).registerEvent(eventHash);
        nonce++;
    }

    function mint(uint32 chainId, address sourceToken, uint256 amount, address to) external onlyRewarder {
        address mirrorToken = getMirrorToken(chainId, sourceToken);
        _mintToken(mirrorToken, amount, to);
    }

    function _mintToken(address mirrorToken, uint256 amount, address receiver) internal {
        IERC20MintableBurnable(mirrorToken).mint(receiver, amount);
        emit TokenMinted(mirrorToken, receiver, amount);
    }

    function _burnToken(address mirrorToken, uint256 amount) internal {
        IERC20MintableBurnable(mirrorToken).burnFrom(msg.sender, amount);
        emit TokenBurned(mirrorToken, amount);
    }

}