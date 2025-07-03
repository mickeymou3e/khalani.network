// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../types/Intent.sol";
import "../types/Receipt.sol";
import "../types/Solution.sol";
import "../types/Events.sol";
import {IntentLib} from "./IntentLib.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract SolutionLib {
    using IntentLib for Intent;

    // **************** //
    // **** ERRORS **** //
    // **************** //
    error SolutionLib__EmptyIntentsAndReceipts();
    error SolutionLib__InputOutputMismatch(uint256 sumInput, uint256 sumIntentOutput, uint256 sumReceiptOutput);
    error SolutionLib__SolutionMintsTokens();
    error SolutionLib__InputOutputTokenTypeMismatch(address inputMToken, address outputMToken);
    error SolutionLib__IntentAmountMismatch();
    error SolutionLib__ReceiptAmountMismatch();
    error SolutionLib__UnsupportedOutcomeStructure();
    error SolutionLib__UnsupportedFillStructure();
    error SolutionLib__InvalidFillGraphForEASIntent();
    error SolutionLib__ExactAnySingleMustBeFulfilledWithReceipts(FillRecord fillRec);
    error SolutionLib__MismatchBetweenInputAndOutputOwners();
    error SolutionLib__InsufficientReceiptsToFillPASIntent(uint256 expectedReceiptTotal, uint256 actualReceiptTotal);

    function verifySolutionInvariants(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts,
        MoveRecord[] memory spendGraph,
        FillRecord[] memory
    ) external pure {
        // Validate that at least one output (intent or receipt) exists
        validateNotEmpty(createdIntents, createdReceipts);

        // Validate resource usage (inputs vs outputs)
        validateResourceInvariants(consumedIntents, createdIntents, createdReceipts, spendGraph);
    }

    function validateNotEmpty(Intent[] memory createdIntents, Receipt[] memory createdReceipts) internal pure {
        if (createdIntents.length == 0 && createdReceipts.length == 0) {
            revert SolutionLib__EmptyIntentsAndReceipts();
        }
    }

    function validateResourceInvariants(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts,
        MoveRecord[] memory spendGraph
    ) internal pure {
        uint256 sumInput = 0;
        uint256 sumReceiptOutput = 0;
        uint256 sumIntentOutput = 0;
        uint256[] memory intentBalancesSpent = new uint256[](consumedIntents.length);

        // Sum input amounts
        sumInput = sumInputAmounts(consumedIntents, intentBalancesSpent);

        // Validate spend graph
        (sumIntentOutput, sumReceiptOutput) =
            validateSpendGraph(consumedIntents, createdIntents, createdReceipts, spendGraph, intentBalancesSpent);

        // Ensure that total inputs match total outputs
        if (sumIntentOutput + sumReceiptOutput != sumInput) {
            revert SolutionLib__InputOutputMismatch(sumInput, sumIntentOutput, sumReceiptOutput);
        }
    }

    function sumInputAmounts(Intent[] memory consumedIntents, uint256[] memory intentBalancesSpent)
        internal
        pure
        returns (uint256)
    {
        uint256 sumInput = 0;
        for (uint256 i = 0; i < consumedIntents.length; i++) {
            uint256 currIntentAmt = consumedIntents[i].srcAmount;
            intentBalancesSpent[i] = currIntentAmt;
            sumInput += currIntentAmt;
        }
        return sumInput;
    }

    function validateSpendGraph(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts,
        MoveRecord[] memory spendGraph,
        uint256[] memory intentBalancesSpent
    ) internal pure returns (uint256 sumIntentOutput, uint256 sumReceiptOutput) {
        for (uint256 i = 0; i < spendGraph.length; i++) {
            MoveRecord memory moveRec = spendGraph[i];
            uint64 currIdx = moveRec.srcIdx;

            if (currIdx >= consumedIntents.length) {
                revert SolutionLib__SolutionMintsTokens();
            }

            Intent memory currIntent = consumedIntents[currIdx];
            uint256 quantitySpent = moveRec.qty;
            uint256 intentSrcQuantity = intentBalancesSpent[currIdx];

            // Check if tokens are being minted by ensuring no overspending
            if (intentSrcQuantity < quantitySpent) {
                revert SolutionLib__SolutionMintsTokens();
            }

            // Validate intent or receipt outputs
            if (moveRec.outputIdx.outType == OutType.Intent && createdIntents.length > 0) {
                Intent memory spendingIntent = createdIntents[moveRec.outputIdx.outIdx];
                if (currIntent.srcMToken != spendingIntent.srcMToken) {
                    revert SolutionLib__InputOutputTokenTypeMismatch(currIntent.srcMToken, spendingIntent.srcMToken);
                }
                if (spendingIntent.srcAmount < quantitySpent) {
                    revert SolutionLib__IntentAmountMismatch();
                }

                sumIntentOutput += quantitySpent;
            } else {
                Receipt memory spendingReceipt = createdReceipts[moveRec.outputIdx.outIdx];
                if (currIntent.srcMToken != spendingReceipt.mToken) {
                    revert SolutionLib__InputOutputTokenTypeMismatch(currIntent.srcMToken, spendingReceipt.mToken);
                }
                if (spendingReceipt.mTokenAmount < quantitySpent) {
                    revert SolutionLib__ReceiptAmountMismatch();
                }

                sumReceiptOutput += quantitySpent;
            }

            // Update the balance of the consumed intent
            intentBalancesSpent[currIdx] -= quantitySpent;
        }
    }

    function checkIntentSatisfaction(
        Intent[] memory consumedIntents,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts,
        FillRecord[] memory fillGraph
    ) external pure {
        for (uint256 i = 0; i < consumedIntents.length; i++) {
            FillRecord[] memory fillersForCurrInput = getAllFillersFor(i, fillGraph);

            Intent memory inputIntent = consumedIntents[i];
            _checkIntentSatisfaction(inputIntent, fillersForCurrInput, createdIntents, createdReceipts);
        }
    }

    function _checkIntentSatisfaction(
        Intent memory inputIntent,
        FillRecord[] memory fillersForCurrInput,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts
    ) internal pure {
        if (inputIntent.outcome.outcomeAssetStructure == OutcomeAssetStructure.AnySingle) {
            if (inputIntent.outcome.fillStructure == FillStructure.Exactly) {
                _checkFilledEAS(inputIntent, fillersForCurrInput, createdIntents, createdReceipts);
            } else if (inputIntent.outcome.fillStructure == FillStructure.PctFilled) {
                _checkFilledPAS(inputIntent, fillersForCurrInput, createdIntents, createdReceipts);
            } else {
                revert SolutionLib__UnsupportedFillStructure();
            }
        } else {
            revert SolutionLib__UnsupportedOutcomeStructure();
        }
    }

    function _checkFilledEAS(
        Intent memory inputIntent,
        FillRecord[] memory fillersForCurrInput,
        Intent[] memory, /*createdIntents*/
        Receipt[] memory createdReceipts
    ) internal pure {
        if (fillersForCurrInput.length != 1) {
            revert SolutionLib__InvalidFillGraphForEASIntent();
        }
        FillRecord memory currFiller = fillersForCurrInput[0];
        if (currFiller.outType == OutType.Intent) {
            revert SolutionLib__ExactAnySingleMustBeFulfilledWithReceipts(currFiller);
        }
        Receipt memory fillerReceipt = createdReceipts[currFiller.outIdx];
        if (inputIntent.outcome.mTokens[0] != fillerReceipt.mToken) {
            revert SolutionLib__InputOutputTokenTypeMismatch(inputIntent.outcome.mTokens[0], fillerReceipt.mToken);
        }
        if (inputIntent.outcome.mAmounts[0] != fillerReceipt.mTokenAmount) {
            revert SolutionLib__IntentAmountMismatch();
        }
        if (inputIntent.author != fillerReceipt.owner) {
            revert SolutionLib__MismatchBetweenInputAndOutputOwners();
        }
    }

    function _checkFilledPAS(
        Intent memory inputIntent,
        FillRecord[] memory fillersForCurrInput,
        Intent[] memory createdIntents,
        Receipt[] memory createdReceipts
    ) internal pure {
        uint256 initialIntentSrcTokenBalance = inputIntent.srcAmount;
        uint256 finalIntentSrcTokenBalance = 0;
        uint256 receiptTotal = 0;
        address mTokenReceived;
        uint256 percentageExpectedForMTokenReceived;

        bool outputIntentForInputExists = false;
        for (uint256 i = 0; i < fillersForCurrInput.length; i++) {
            FillRecord memory currFiller = fillersForCurrInput[i];
            if (currFiller.outType == OutType.Intent) {
                if (outputIntentForInputExists) {
                    revert("Only one output intent allowed for each partially fillable intent");
                }
                Intent memory outputIntent = createdIntents[currFiller.outIdx];
                if (outputIntent.srcMToken != inputIntent.srcMToken) {
                    revert("Intent srcMToken should not change");
                }
                bytes32 outputOutcomeHash = IntentLib.hashOutcome(outputIntent.outcome);
                bytes32 inputOutcomeHash = IntentLib.hashOutcome(inputIntent.outcome);
                if (outputOutcomeHash != inputOutcomeHash) {
                    revert("Outcome should not change");
                }
                outputIntentForInputExists = true;
                finalIntentSrcTokenBalance = outputIntent.srcAmount;
            } else {
                Receipt memory currReceipt = createdReceipts[currFiller.outIdx];
                if (mTokenReceived != address(0)) {
                    if (currReceipt.mToken != mTokenReceived) {
                        revert(
                            "Cannot use multiple mTokens in a single solution for an intent with AnySingle asset structure"
                        );
                    }
                } else {
                    if (_intentAcceptsMToken(inputIntent, currReceipt.mToken)) {
                        mTokenReceived = currReceipt.mToken;
                        percentageExpectedForMTokenReceived = _outcomeAmtForMToken(inputIntent, currReceipt.mToken);
                        if (percentageExpectedForMTokenReceived == 0) {
                            revert("Critical error: percentage-based fill should never have outcome amount of 0");
                        }
                    } else {
                        revert("Invalid mToken given to partially fillable intent");
                    }
                }
                receiptTotal += currReceipt.mTokenAmount;
            }
        }

        if (finalIntentSrcTokenBalance > initialIntentSrcTokenBalance) {
            revert("Intent balance should not increase");
        }

        uint256 tokensTakenFromInput = initialIntentSrcTokenBalance - finalIntentSrcTokenBalance;
        uint256 expectedReceiptAmount = (tokensTakenFromInput * percentageExpectedForMTokenReceived) / 1e20; // Adjusted for precision
        if (receiptTotal < expectedReceiptAmount) {
            revert SolutionLib__InsufficientReceiptsToFillPASIntent(expectedReceiptAmount, receiptTotal);
        }
    }

    function _intentAcceptsMToken(Intent memory intent, address mToken) internal pure returns (bool) {
        for (uint256 i = 0; i < intent.outcome.mTokens.length; i++) {
            if (intent.outcome.mTokens[i] == mToken) {
                return true;
            }
        }
        return false;
    }

    function _outcomeAmtForMToken(Intent memory intent, address mToken) internal pure returns (uint256) {
        for (uint256 i = 0; i < intent.outcome.mTokens.length; i++) {
            if (intent.outcome.mTokens[i] == mToken) {
                return intent.outcome.mAmounts[i];
            }
        }
        return 0;
    }

    function getAllFillersFor(uint256 inputIntentIdx, FillRecord[] memory fillGraph)
        internal
        pure
        returns (FillRecord[] memory)
    {
        uint256 fillerCount = 0;
        for (uint256 i = 0; i < fillGraph.length; i++) {
            if (fillGraph[i].inIdx == inputIntentIdx) {
                fillerCount++;
            }
        }
        FillRecord[] memory allFillers = new FillRecord[](fillerCount);
        uint256 j = 0;
        for (uint256 i = 0; i < fillGraph.length; i++) {
            if (fillGraph[i].inIdx == inputIntentIdx) {
                allFillers[j] = fillGraph[i];
                j++;
            }
        }

        return allFillers;
    }
}
