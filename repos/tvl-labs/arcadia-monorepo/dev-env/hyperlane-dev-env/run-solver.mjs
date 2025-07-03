import "dotenv/config";
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { execa } from 'execa';
import { KMSClient, SignCommand, GetPublicKeyCommand } from "@aws-sdk/client-kms";
import { bcs, fromHex } from '@mysten/bcs';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const KMSRegion = 'us-east-1';
const KMSKeyId = '8ee3b488-bfff-4807-9923-6ab4cbfd01e9';
const ChainId = 31337;
const DevKey = process.env.MEDUSA_KEY || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

class KmsSigner {
    constructor(kmsClient) {
        this.kmsClient = kmsClient;
    }

    async _toEthereumSignature(sig, payload) {
        const { r, s } = this._parseDERSignature(sig);
        const yParity = await this._calculateYParity(r, s, payload);
        return {
            yParity: yParity,
            r: r,
            s: s
        };
    }

    _parseDERSignature(derBytes) {
        // DER format: 0x30 [total_len] 0x02 [r_len] [r_bytes] 0x02 [s_len] [s_bytes]
        const data = new Uint8Array(derBytes);
        let offset = 2;
        offset++;
        const rLength = data[offset++];
        let rBytes = data.slice(offset, offset + rLength);

        if (rLength === 33) {
            rBytes = rBytes.slice(1);
        }

        const r = '0x' + Array.from(rBytes)
            .map(b => b.toString(16).padStart(2, '0')).join('');
        offset += rLength;

        offset++;
        const sLength = data[offset++];

        let sBytes = data.slice(offset, offset + sLength);

        if (sLength === 33) {
            sBytes = sBytes.slice(1);
        }

        let s = '0x' + Array.from(sBytes)
            .map(b => b.toString(16).padStart(2, '0')).join('');

        // normalize s
        const secp256k1n = BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364141');
        const halfN = secp256k1n / 2n;
        const sBig = BigInt(s);

        if (sBig > halfN) {
            const normalizedS = secp256k1n - sBig;
            s = '0x' + normalizedS.toString(16).padStart(64, '0');
        }

        return { r, s };
    }

    async _calculateYParity(r, s, payload) {
        const response = await this.kmsClient.send(new GetPublicKeyCommand({
            KeyId: KMSKeyId
        }));

        const expectedPublicKeyBytes = response.PublicKey;
        let expectedPublicKey;

        for (let i = 3; i < expectedPublicKeyBytes.length - 64; i++) {
            if (
                expectedPublicKeyBytes[i] === 0x04 &&
                expectedPublicKeyBytes[i - 1] === 0x00 &&
                expectedPublicKeyBytes[i - 2] === 0x42 &&
                expectedPublicKeyBytes[i - 3] === 0x03
            ) {
                const publicKeyBytes = expectedPublicKeyBytes.slice(i + 1, i + 65);
                expectedPublicKey = '0x' + Array.from(publicKeyBytes)
                    .map(b => b.toString(16).padStart(2, '0')).join('');
                break;
            }
        }
        console.log("expectedAddress", toAddress(expectedPublicKey));

        for (let yParity of [0, 1]) {
            try {
                const v = 27 + yParity;
                let recoveredPubKey = ethers.utils.recoverPublicKey(payload, {
                    r: r,
                    s: s,
                    v: v
                });
                recoveredPubKey = '0x' + recoveredPubKey.slice(4); // remove 0x04 prefix
                console.log("recoveredAddress for yParity", yParity, toAddress(recoveredPubKey));

                if (recoveredPubKey.toLowerCase() === expectedPublicKey.toLowerCase()) {
                    return yParity;
                }
            } catch (e) {
                console.log("error", e);
                continue;
            }
        }

        throw new Error('Could not determine y_parity');
    }

    async signHash(payload) {
        // aws kms does not use the 0x prefix; but ethers does
        if (!payload.startsWith('0x')) {
            payload = '0x' + payload;
        }
        const params = {
            KeyId: KMSKeyId,
            Message: Buffer.from(payload.slice(2), 'hex'),
            MessageType: 'DIGEST',
            SigningAlgorithm: 'ECDSA_SHA_256'
        };
        const sig = await this.kmsClient.send(new SignCommand(params));

        if (sig === undefined || sig.Signature === undefined) {
            throw new Error(`AWS KMS sign failed`);
        }

        return await this._toEthereumSignature(sig.Signature, payload);
    }

    async signMessage(message) {
        const messageHash = ethers.utils.hashMessage(message);
        return await this.signHash(messageHash);
    }
}

// solver address is 0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377

async function authroizeSolver() {
    // const kms = new KMSClient({ region: KMSRegion });
    // const signer = new KmsSigner(kms);
    let wallet = new ethers.Wallet(DevKey);

    const Payload = bcs.struct('PayloadAddress', {
        address: bcs.vector(bcs.u8(), 20),
        nonce: bcs.vector(bcs.u8(), 32),
        chainId: bcs.u64(),
    });

    const nonce = Math.floor(Math.random() * 100) + 1;
    const payload = Payload.serialize({
        address: Array.from(fromHex('63FaC9201494f0bd17B9892B9fae4d52fe3BD377')),
        nonce: toU256Bytes(nonce),
        chainId: ChainId,
    });

    const signature = await wallet.signMessage(payload.toBytes());
    const splitSignature = ethers.utils.splitSignature(signature);
    const sig = {
        r: splitSignature.r,
        s: splitSignature.s,
        yParity: splitSignature.v - 27
    }

    const rpcPayload = {
        "payload": {
            "address": "0x63FaC9201494f0bd17B9892B9fae4d52fe3BD377",
            "nonce": nonce,
            "chain_id": ChainId
        },
        "signature": sig
    }

    console.log("rpcPayload", rpcPayload);

    const response = await fetch('http://127.0.0.1:8001', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "requestAddSolver",
            "params": [rpcPayload]
        })
    });

    const result = await response.json();
    if (JSON.stringify(result).includes("UNIQUE constraint failed: solver.address")) {
        console.log("Solver already authorized");
    } else {
        console.log(result);
    }
}

async function runSolver() {
    const medusaPath = path.resolve(__dirname, '..', '..', 'medusa');
    if (!fs.existsSync(path.join(medusaPath, "target", "release", "arcadia-solver"))) {
        await execa("cargo", ["build", "--release", "-p", "arcadia-solver"], {
            cwd: medusaPath,
            stdio: "inherit",
            shell: true,
        });
    }
    const solverProcess = await execa('./target/release/arcadia-solver', ['crates/solver/config.toml'], {
        cwd: medusaPath,
        stdio: 'inherit',
        shell: true
    });
    console.log("Solver PID:", solverProcess.pid);
    return solverProcess;
}

await authroizeSolver();
await runSolver();


function toU256Bytes(num) {
    const bytes = new Array(32).fill(0);
    let value = BigInt(num);
    for (let i = 31; i >= 0 && value > 0; i--) {
        bytes[i] = Number(value & 0xFFn);
        value = value >> 8n;
    }
    return bytes;
}

function toAddress(pubKey) {
    const hash = ethers.utils.keccak256(pubKey);
    return '0x' + hash.slice(-40);
}