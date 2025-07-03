// SPDX-License-Identifier: MIT
pragma solidity 0.8.30;

import "../types/Intent.sol";
import "./IntentLib.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

library SignatureLib {
    function verifyIntentSignature(SignedIntent memory signedIntent, address contractAddress)
        internal
        view
        returns (bool)
    {
        Intent memory intent = signedIntent.intent;

        require(signedIntent.signature.length == 65, "Invalid signature length");

        bytes32 intentHash = IntentLib.hashIntentWithEip712(intent, contractAddress);

        return SignatureChecker.isValidSignatureNow(intent.author, intentHash, signedIntent.signature);
    }
}
