// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {IntentBook} from "../src/hub/IntentBook.sol";
import {
    Intent, SignedIntent, Outcome, IntentState, OutcomeAssetStructure, FillStructure
} from "../src/types/Intent.sol";
import {Receipt as ReceiptStruct} from "../src/hub/ReceiptManager.sol";
import {Solution, MoveRecord, FillRecord, OutType, OutputIdx} from "../src/types/Solution.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Test, console} from "forge-std/Test.sol";
import {MockMailbox} from "@hyperlane-xyz/core/contracts/mock/MockMailbox.sol";
import {MockHyperlaneEnvironment} from "@hyperlane-xyz/core/contracts/mock/MockHyperlaneEnvironment.sol";
import {TypeCasts} from "@hyperlane-xyz/core/contracts/libs/TypeCasts.sol";
import {IntentLib} from "../src/libraries/IntentLib.sol";
import {IPermit2} from "../src/interfaces/IPermit2.sol";
import {Permit2Clone} from "./Permit2Clone.sol";

contract Utilities is Test {
    MockMailbox originMailbox;
    MockMailbox destinationMailbox;
    Permit2Clone permit2 = new Permit2Clone();

    uint32 constant originChainId = 1;
    uint32 constant destinationChainId = 2;

    bytes32 constant TOKEN_PERMISSIONS_TYPEHASH = keccak256("TokenPermissions(address token,uint256 amount)");
    bytes32 constant PERMIT_TRANSFER_FROM_TYPEHASH = keccak256(
        "PermitTransferFrom(TokenPermissions permitted,address spender,uint256 nonce,uint256 deadline)TokenPermissions(address token,uint256 amount)"
    );

    function setUp() public virtual {
        originMailbox = new MockMailbox(originChainId);
        destinationMailbox = new MockMailbox(destinationChainId);
        originMailbox.addRemoteMailbox(destinationChainId, destinationMailbox);
    }

    function spendAmountFromIntent(
        uint256 amount,
        address owner,
        address mToken,
        uint64 intentIdx,
        Solution memory solution,
        OutType createResourceType
    ) public returns (Solution memory) {
        if (createResourceType == OutType.Intent) {} else {
            return spendReceiptFromIntent(amount, owner, mToken, intentIdx, solution);
        }
    }

    function fulfills(uint64 outIdx, uint64 inIdx, OutType outType, Solution memory solution)
        public
        returns (Solution memory)
    {
        FillRecord[] memory newFillGraph = new FillRecord[](solution.fillGraph.length + 1);
        uint64 lastIdx = uint64(solution.fillGraph.length);
        for (uint256 i = 0; i < solution.fillGraph.length; i++) {
            newFillGraph[i] = solution.fillGraph[i];
        }
        newFillGraph[lastIdx] = FillRecord({inIdx: inIdx, outIdx: outIdx, outType: outType});
        return Solution({
            intentIds: solution.intentIds,
            intentOutputs: solution.intentOutputs,
            receiptOutputs: solution.receiptOutputs,
            spendGraph: solution.spendGraph,
            fillGraph: newFillGraph
        });
    }

    function spendReceiptFromIntent(
        uint256 amount,
        address owner,
        address mToken,
        uint64 intentIdx,
        Solution memory solution
    ) public returns (Solution memory) {
        ReceiptStruct memory receipt = ReceiptStruct({
            mToken: mToken,
            mTokenAmount: amount,
            owner: owner,
            intentHash: solution.intentIds[intentIdx]
        });
        ReceiptStruct[] memory newReceiptOutputs = new ReceiptStruct[](solution.receiptOutputs.length + 1);
        for (uint256 i = 0; i < solution.receiptOutputs.length; i++) {
            newReceiptOutputs[i] = solution.receiptOutputs[i];
        }
        newReceiptOutputs[solution.receiptOutputs.length] = receipt;
        MoveRecord[] memory newSpendGraph = new MoveRecord[](solution.spendGraph.length + 1);
        for (uint256 i = 0; i < solution.spendGraph.length; i++) {
            newSpendGraph[i] = solution.spendGraph[i];
        }

        newSpendGraph[solution.spendGraph.length] = MoveRecord({
            srcIdx: intentIdx,
            outputIdx: OutputIdx({outType: OutType.Receipt, outIdx: uint64(solution.receiptOutputs.length)}),
            qty: amount
        });
        return Solution({
            intentIds: solution.intentIds,
            intentOutputs: solution.intentOutputs,
            receiptOutputs: newReceiptOutputs,
            spendGraph: newSpendGraph,
            fillGraph: solution.fillGraph
        });
    }

    function createDepositTokenMessage(address token, uint256 amt, address sender) internal returns (bytes memory) {
        console.log("Token in deposit message", token);
        return abi.encode(sender, token, amt);
    }

    function sendDepositTokenMessage(bytes memory message, address recipient) internal {
        originMailbox.dispatch(destinationChainId, TypeCasts.addressToBytes32(recipient), message);
    }

    function createReceiptSpendingIntent(Intent memory intent, address spender, uint256 spendAmt, address intentBook)
        internal
        returns (ReceiptStruct memory)
    {
        bytes32 intentId = IntentBook(intentBook).getIntentId(intent);
        ReceiptStruct memory receipt =
            ReceiptStruct({mToken: intent.srcMToken, mTokenAmount: spendAmt, owner: spender, intentHash: intentId});
        return receipt;
    }

    function depositMTokensToIntentBook(address depositor, address mToken, uint256 amount, address intentBook)
        internal
    {
        // vm.startPrank(depositor);
        // IERC20(mToken).approve(intentBook, amount);
        // IntentBook(intentBook).deposit(mToken, amount);
        // vm.stopPrank();
    }

    function createSimpleIntent(
        address srcMToken,
        uint256 srcAmt,
        address destMToken,
        uint256 destAmt,
        address author,
        FillStructure fillStructure,
        uint256 privateKey,
        address verifyingContract,
        uint256 nonce
    ) internal returns (SignedIntent memory) {
        Intent memory intent = Intent({
            author: author,
            srcMToken: srcMToken,
            srcAmount: srcAmt,
            outcome: Outcome({
                mTokens: new address[](1),
                mAmounts: new uint256[](1),
                outcomeAssetStructure: OutcomeAssetStructure.AnySingle,
                fillStructure: fillStructure
            }),
            ttl: block.timestamp + 1 hours,
            nonce: nonce
        });
        intent.outcome.mTokens[0] = destMToken;
        intent.outcome.mAmounts[0] = destAmt;

        // Hash the intent
        bytes32 intentHash = IntentLib.hashIntent(intent, verifyingContract);

        // Sign the intent with the author's private key
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(privateKey, intentHash);
        bytes memory signature = abi.encodePacked(r, s, v);
        SignedIntent memory signedIntent = SignedIntent({intent: intent, signature: signature});

        // bytes32 intentId = IntentBook(intentBook).publishIntent(intent);
        return signedIntent;
    }

    function createPartiallyFillableIntent(
        address srcMToken,
        uint256 srcAmt,
        address destMToken,
        uint256 destAmt,
        address author,
        uint256 privateKey,
        address verifyingContract,
        uint256 nonce
    ) public returns (SignedIntent memory) {
        SignedIntent memory signedIntent = createSimpleIntent(
            srcMToken,
            srcAmt,
            destMToken,
            destAmt,
            author,
            FillStructure.PctFilled,
            privateKey,
            verifyingContract,
            nonce
        );
    }

    function createPermitTransferFrom(address token, uint256 amount, uint256 nonce, uint256 deadline)
        public
        pure
        returns (IPermit2.PermitTransferFrom memory)
    {
        return IPermit2.PermitTransferFrom({
            permitted: IPermit2.TokenPermissions({token: IERC20(token), amount: amount}),
            nonce: nonce,
            deadline: deadline
        });
    }

    // Generate a signature for a permit message.
    function _signPermit(IPermit2.PermitTransferFrom memory permit, address spender, uint256 signerKey)
        external
        view
        returns (bytes memory sig)
    {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerKey, _getEIP712Hash(permit, spender));
        return abi.encodePacked(r, s, v);
    }

    // Compute the EIP712 hash of the permit object.
    // Normally this would be implemented off-chain.
    function _getEIP712Hash(IPermit2.PermitTransferFrom memory permit, address spender)
        internal
        view
        returns (bytes32 h)
    {
        return keccak256(
            abi.encodePacked(
                "\x19\x01",
                permit2.DOMAIN_SEPARATOR(),
                keccak256(
                    abi.encode(
                        PERMIT_TRANSFER_FROM_TYPEHASH,
                        keccak256(
                            abi.encode(TOKEN_PERMISSIONS_TYPEHASH, permit.permitted.token, permit.permitted.amount)
                        ),
                        spender,
                        permit.nonce,
                        permit.deadline
                    )
                )
            )
        );
    }

    function _randomBytes32() internal view returns (bytes32) {
        return keccak256(
            abi.encode(tx.origin, block.number, block.timestamp, block.coinbase, address(this).codehash, gasleft())
        );
    }

    function _randomUint256() external view returns (uint256) {
        return uint256(_randomBytes32());
    }
}
