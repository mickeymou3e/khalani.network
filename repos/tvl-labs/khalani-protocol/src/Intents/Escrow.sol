pragma solidity 0.8.19;

import "./intentbook/lib/SwapIntentLib.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import {IPermit2} from "./interfaces/IPermit2.sol";
import "./proof/EventProver.sol";
import "./libraries/SwapIntentEventLibrary.sol";

contract Escrow is ReentrancyGuard {
    event TokensLocked(bytes32 intentId);
    IPermit2 public immutable PERMIT2;
    EventProver public intentEventProver;

    mapping (address => mapping (address => uint256)) public tokenBalancesByUser;

    constructor(IPermit2 permit_, EventProver _intentEventProver) {
        PERMIT2 = permit_;
        intentEventProver = _intentEventProver;
    }

    function lockTokens(SwapIntentLib.SwapIntent calldata intent) external nonReentrant {
        bytes32 intentId = SwapIntentLib.calculateSwapIntentId(intent);

        tokenBalancesByUser[intent.author][intent.sourceToken] += intent.sourceAmount;

        PERMIT2.permitTransferFrom(
            IPermit2.PermitTransferFrom({
                permitted: IPermit2.TokenPermissions({
                    token: IERC20(intent.sourceToken),
                    amount: intent.sourceAmount
                }),
                nonce: uint256(keccak256(abi.encode(intent.nonceIndex, intent.nonceBitToFlip))),
                deadline: intent.deadline
            }),
            IPermit2.SignatureTransferDetails({
                to: address(this),
                requestedAmount: intent.sourceAmount
            }),
            intent.author,
            intent.sourcePermit2
        );

        bytes32 eventHash = SwapIntentEventLibrary.calculateSwapIntentTokenLockEventHash(
            SwapIntentEventLibrary.SwapIntentTokenLock(
                intentId
            )
        );

        //register event
        intentEventProver.registerEvent(eventHash);
        emit TokensLocked(intentId);
    }

}
