import { connectToDatabase } from '@/lib/database';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { TransactionStatus } from '@/lib/constants';
import provider from '@/lib/provider';
import env from '@/lib/env';
import { ZodError, z } from 'zod';
import { Timestamp } from 'mongodb';
import { pino } from 'pino';

const logger = pino();

type Data =
  | {
      from: string;
      to: string;
      value: string;
      nonce: string;
      hash: string;
      gas: string;
    }
  | {
      message: string;
      error?: ZodError;
    };

const { AXON_FAUCET_REQUIRED_CONFIRMATIONS, AXON_FAUCET_CLAIM_VALUE } = env;

const schema = z.object({
  account: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'POST') {
    res.status(405).json({
      message: 'Method Not Allowed',
    });
    return;
  }
  const collections = await connectToDatabase();

  const params = schema.safeParse(JSON.parse(req.body));
  if (!params.success) {
    res.status(400).json({
      message: 'Invalid request',
      error: params.error,
    });
    return;
  }
  const { account } = params.data;

  const cursor = collections.address!.find({}).sort({ private_key: 1 });
  let fromAddress;
  while (await cursor.hasNext()) {
    const address = await cursor.next();
    if (!address) {
      break;
    }
    const pendingAmount = address!.pending_amount.reduce(
      (sum, amount) => sum + parseInt(amount, 10),
      0,
    );
    if (
      parseInt(address.balance, 10) + pendingAmount >
      AXON_FAUCET_CLAIM_VALUE
    ) {
      fromAddress = address;
      break;
    }
  }
  await cursor.close();

  if (!fromAddress) {
    res.status(500).json({
      message: 'Tokens insufficient',
    });
    return;
  }

  const signer = new ethers.Wallet(fromAddress?.private_key!, provider);
  const from = signer.address;
  const amount = (-AXON_FAUCET_CLAIM_VALUE!).toString();

  logger.info(`[claim] fromAddress: ${from}`);

  await collections.address!.updateOne(
    { private_key: fromAddress?.private_key },
    { $push: { pending_amount: amount } },
  );

  const tx = await signer.sendTransaction({
    to: account,
    type: 2,
    value: AXON_FAUCET_CLAIM_VALUE.toString(),
    gasLimit: 21000,
  });

  const receipt = await tx.wait(1);
  const result = {
    from,
    to: account,
    value: tx.value.toString(),
    nonce: tx.nonce.toString(),
    hash: tx.hash,
    gas: receipt!.gasUsed.toString(),
  };
  await collections.transaction!.insertOne({
    ...result,
    time: Timestamp.fromNumber(Date.now()),
    status: TransactionStatus.Pending,
  });

  logger.info(`[claim] tx: ${JSON.stringify(tx)}`);

  res.status(200).json(result);

  await tx.wait(AXON_FAUCET_REQUIRED_CONFIRMATIONS);
  await collections.transaction!.updateOne(
    { hash: tx.hash },
    { $set: { status: TransactionStatus.Confirmed } },
  );

  const balance = await provider.getBalance(signer.getAddress());
  await collections.address!.updateOne(
    { private_key: fromAddress?.private_key! },
    {
      balance,
      $pop: { pending_amount: 1 },
    },
  );
}
