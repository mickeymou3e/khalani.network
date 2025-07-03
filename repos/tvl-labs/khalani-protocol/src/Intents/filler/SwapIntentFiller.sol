pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./SwapIntentFillerEvents.sol";
import "../proof/EventProver.sol";
import "../intentbook/lib/SwapIntentLib.sol";
import "../libraries/SwapIntentEventLibrary.sol";

contract SwapIntentFiller is SwapIntentFillerEvents {

    error DeadlineExpired();

    EventProver public intentEventProver;

    constructor(EventProver _intentEventProver) {
        intentEventProver = _intentEventProver;
    }

    /**
     * @notice Executes the (partial) filling of a swap intent. It transfers
     * the `fillAmount` of the destination tokens to the intent's author. The tokens are sourced from
     * `msg.sender`, which can be either an EOA, a smart contract, or an account abstraction wallet.
     *
     * @dev This function assumes that the `msg.sender` has already approved this contract to spend the required amount of tokens.
     * @dev Emits a `Fill` event upon successful execution, logging details of the filled swap intent.
     * @dev Registers a `SwapIntentFilled` event upon successful execution.
     *
     * @param intent The swap intent object to be filled.
     * @param filler The address on Khalani Chain that will receive the reward for filling the swap intent. This can be the
     * `msg.sender` or any other address to receive the reward, depending on the strategy of the solver submitting this transaction.
     * @param fillAmount The amount of the intent's destination tokens to be transferred to the intent's author.
     */
    function fillSwapIntent(
        SwapIntentLib.SwapIntent memory intent,
        address filler,
        uint256 fillAmount
    ) public {
        validateIntent(intent);

        SafeERC20.safeTransferFrom(
            ERC20(intent.destinationToken),
            msg.sender,
            intent.author,
            fillAmount
        );

        bytes32 intentId = SwapIntentLib.calculateSwapIntentId(intent);

        SwapIntentEventLibrary.SwapIntentFilled memory swapIntentFilled = SwapIntentEventLibrary.SwapIntentFilled({
            intentId: intentId,
            filler: filler,
            fillAmount: fillAmount
        });

        //intentEventProver.registerSwapIntentFilledEvent(swapIntentFilled);
        intentEventProver.registerEvent(
            SwapIntentEventLibrary.calculateSwapIntentFilledEventHash(
                swapIntentFilled
            )
        );

        emit Fill(intentId, filler, intent.author, fillAmount);
    }

    function validateIntent(SwapIntentLib.SwapIntent memory intent) internal {
        if (block.timestamp > intent.deadline) {
            revert DeadlineExpired();
        }
    }
}