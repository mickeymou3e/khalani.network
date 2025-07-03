import axios from 'axios';

import { bufferToHex, ecrecover, pubToAddress } from 'ethereumjs-util';

import { connectToContractsRuntime } from '@scripts/connect';
import { ZERO_ADDRESS } from '@src/constants';
import { ScriptRunEnvironment } from '@src/types';
import { getConfigInstant } from '@src/utils';

type AdjustVOverload = {
  (signingMethod: 'eth_signTypedData', signature: string): string;
  (signingMethod: 'eth_sign', signature: string, safeTxHash: string, sender: string): string;
};

export type GnosisStatus = {
  address: string;
  nonce: number;
  threshold: number;
  owners: string[];
  masterCopy: string;
};

const sameString = (str1: string, str2: string): boolean => {
  return str1.toLowerCase() === str2.toLowerCase();
};

const isTxHashSignedWithPrefix = (
  txHash: string,
  signature: string,
  ownerAddress: string
): boolean => {
  let hasPrefix;
  try {
    const rsvSig = {
      r: Buffer.from(signature.slice(2, 66), 'hex'),
      s: Buffer.from(signature.slice(66, 130), 'hex'),
      v: parseInt(signature.slice(130, 132), 16),
    };

    const recoveredData = ecrecover(
      Buffer.from(txHash.slice(2), 'hex'),
      rsvSig.v,
      rsvSig.r,
      rsvSig.s
    );
    const recoveredAddress = bufferToHex(pubToAddress(recoveredData));
    hasPrefix = !sameString(recoveredAddress, ownerAddress);
  } catch (e) {
    hasPrefix = true;
  }
  return hasPrefix;
};

const adjustVInSignature: AdjustVOverload = (
  signingMethod: 'eth_sign' | 'eth_signTypedData',
  signature: string,
  safeTxHash?: string,
  signerAddress?: string
): string => {
  const V_VALUES = [0, 1, 27, 28];
  const MIN_VALID_V_VALUE = 27;
  let signatureV = parseInt(signature.slice(-2), 16);
  if (!V_VALUES.includes(signatureV)) {
    throw new Error('Invalid signature');
  }
  if (signingMethod === 'eth_sign') {
    /*
      Usually returned V (last 1 byte) is 27 or 28 (valid ethereum value)
      Metamask with ledger returns v = 01, this is not valid for ethereum
      In case V = 0 or 1 we add it to 27 or 28
      Adding 4 is required if signed message was prefixed with "\x19Ethereum Signed Message:\n32"
      Some wallets do that, some wallets don't, V > 30 is used by contracts to differentiate between prefixed and non-prefixed messages
      https://github.com/gnosis/safe-contracts/blob/main/contracts/GnosisSafe.sol#L292
    */
    if (signatureV < MIN_VALID_V_VALUE) {
      signatureV += MIN_VALID_V_VALUE;
    }
    const adjustedSignature = signature.slice(0, -2) + signatureV.toString(16);
    const signatureHasPrefix = isTxHashSignedWithPrefix(
      safeTxHash as string,
      adjustedSignature,
      signerAddress as string
    );
    if (signatureHasPrefix) {
      signatureV += 4;
    }
  }
  if (signingMethod === 'eth_signTypedData') {
    // Metamask with ledger returns V=0/1 here too, we need to adjust it to be ethereum's valid value (27 or 28)
    if (signatureV < MIN_VALID_V_VALUE) {
      signatureV += MIN_VALID_V_VALUE;
    }
  }
  signature = signature.slice(0, -2) + signatureV.toString(16);
  return signature;
};

const messageType = {
  SafeTx: [
    { type: 'address', name: 'to' },
    { type: 'uint256', name: 'value' },
    { type: 'bytes', name: 'data' },
    { type: 'uint8', name: 'operation' },
    { type: 'uint256', name: 'safeTxGas' },
    { type: 'uint256', name: 'baseGas' },
    { type: 'uint256', name: 'gasPrice' },
    { type: 'address', name: 'gasToken' },
    { type: 'address', name: 'refundReceiver' },
    { type: 'uint256', name: 'nonce' },
  ],
};

const getGnosisNextNonce = async (environment: ScriptRunEnvironment) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  const gnosisAddress = config.gnosisSafe;
  if (!gnosisAddress) throw 'Gnosis address missing';

  const gnosisStatus = await axios.get<{ results: { nonce: number }[] }>(
    `${config.gnosisApi}/${gnosisAddress}/all-transactions/`
  );

  const nextNonce =
    gnosisStatus.data.results.length === 0
      ? 0
      : Math.max(...gnosisStatus.data.results.map((result) => result.nonce)) + 1;

  return nextNonce;
};

export const sendGnosisSafeTransaction = async (
  environment: ScriptRunEnvironment,
  to: string,
  functionData: string
) => {
  const config = getConfigInstant(environment.chainId, environment.env);
  if (!config) throw Error('config not found');
  const gnosisAddress = config.gnosisSafe;
  if (!gnosisAddress) throw 'Gnosis address missing';

  const signer = environment.deployer;
  const signerAddress = signer.address;
  const chainId = await environment.deployer.getChainId();

  const operation = 0;
  const baseGas = 0;
  const gasLimit = 0;
  const gasPrice = 0;

  const nextNonce = await getGnosisNextNonce(environment);

  const gnosisSafe = connectToContractsRuntime(environment).gnosisSafe;
  if (!gnosisSafe) throw Error('gnosisSafe not found');

  const txHash = await gnosisSafe.getTransactionHash(
    to,
    0,
    functionData,
    operation,
    gasLimit,
    baseGas.toString(),
    gasPrice.toString(),
    ZERO_ADDRESS,
    ZERO_ADDRESS,
    nextNonce.toString()
  );

  const txData = {
    to: to,
    value: '0',
    data: functionData,
    operation: operation,
    safeTxGas: gasLimit.toString(),
    baseGas: baseGas.toString(),
    gasPrice: gasPrice.toString(),
    gasToken: ZERO_ADDRESS,
    refundReceiver: ZERO_ADDRESS,
    nonce: nextNonce.toString(),
  };

  try {
    const domain = {
      chainId: chainId,
      verifyingContract: gnosisAddress,
    };

    const sign = await environment.deployer._signTypedData(domain, messageType, {
      ...txData,
    });

    const perfectSign = adjustVInSignature('eth_signTypedData', sign);

    await axios.post(`${config.gnosisApi}/${gnosisAddress}/multisig-transactions/`, {
      safe: gnosisAddress,
      to: to,
      value: 0,
      data: functionData,
      operation: operation,
      safeTxGas: gasLimit,
      baseGas: baseGas,
      gasPrice: gasPrice,
      gasToken: null,
      refundReceiver: null,
      nonce: nextNonce.toString(),
      contractTransactionHash: txHash,
      sender: signerAddress,
      signature: perfectSign,
      origin: null,
    });
  } catch (e: any) {
    console.error(e);
  }
};
