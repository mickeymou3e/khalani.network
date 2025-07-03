// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../types/Intent.sol";
import "./IntentLib.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

library SignatureLib {
    function verifyIntentSignature(SignedIntent memory signedIntent, address contractAddress) internal view returns (bool) {
        Intent memory intent = signedIntent.intent;

        require(signedIntent.signature.length == 65, "Invalid signature length");

        bytes32 intentHash = IntentLib.hashIntent(intent, contractAddress);

        address recoveredAddress = ECDSA.recover(intentHash, signedIntent.signature);

        // Check if the recovered address matches the intent's author
        return recoveredAddress == intent.author;
    }
}