const { ApiPromise, WsProvider, Keyring } = require('@polkadot/api');
const fs = require('fs');

async function main() {
    try {
        const wsUrl = process.argv[2];
        const seedPhrase = process.argv[3];
        const wasmPath = process.argv[4];

        // Connect to the Substrate node
        const provider = new WsProvider(wsUrl);
        const api = await ApiPromise.create({ provider });

        // Create a keyring and add the private key
        const keyring = new Keyring({ type: 'sr25519' });
        const pair = keyring.addFromUri(seedPhrase);

        // Check account balance
        const { data: { free: balance } } = await api.query.system.account(pair.address);
        console.log(`Balance of ${pair.address}: ${balance}`);

        if (balance.isZero()) {
            console.error("Account balance is zero. Please ensure the correct key is used and the account has sufficient funds.");
            process.exit(1);
        }

        // Read the WASM file
        const wasm = fs.readFileSync(wasmPath).toString('hex');

        // Print the current spec version
        const specVersionBefore = api.runtimeVersion.specVersion.toNumber();
        console.log(`Spec version before: ${specVersionBefore}`);

        // Create the call for setCode
        const setCodeCall = api.tx.system.setCode(`0x${wasm}`);

        // Create the unchecked weight call
        const uncheckedWeightCall = api.tx.sudo.sudoUncheckedWeight(setCodeCall, { refTime: 0, proofSize: 0 });

        // Create the sudo call
        const sudoCall = api.tx.sudo.sudo(uncheckedWeightCall);

        // Submit the transaction
        const unsub = await sudoCall.signAndSend(pair, async (result) => {
            console.log(`Current status is ${result.status}`);

            if (result.status.isInBlock) {
                console.log(`Transaction included at blockHash ${result.status.asInBlock}`);
            } else if (result.status.isFinalized) {
                console.log(`Transaction finalized at blockHash ${result.status.asFinalized}`);

                // Print the new spec version
                await api.rpc.system.syncState();
                const specVersionAfter = api.runtimeVersion.specVersion.toNumber();
                console.log(`Spec version after: ${specVersionAfter}`);
                process.exit(0); // Exit with success
            } else if (result.isError) {
                console.error(`Transaction failed with error: ${result.status}`);
                process.exit(1);
            }
        });

    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error(`Unhandled error: ${error.message}`);
    process.exit(1);
});
