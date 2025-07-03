import { connectToDatabase } from '@/lib/database';
import provider from '@/lib/provider';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError, z } from 'zod';
import { pino } from 'pino';

const logger = pino();

type Data =
  | {
    address: string,
    balance: string,
  }
  | {
      message: string;
      error?: ZodError;
    };

const schema = z.object({
  private_key: z.string(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const params = schema.safeParse(req.query);
  if (!params.success) {
    res.status(400).json({
      message: 'Invalid request',
      error: params.error,
    });
    return;
  }
  const { private_key } = params.data;
  if (!ethers.isHexString(private_key)) {
    res.status(400).json({ message: 'Invalid private key' });
    return;
  }

  const signer = new ethers.Wallet(private_key, provider);
  const address = await signer.getAddress();
  const balance = await provider.getBalance(address);

  const collections = await connectToDatabase();
  const addresses = await collections.address!.find({ private_key }).toArray();
  if (addresses.length > 0) {
    await collections.address!.updateOne({ private_key }, { balance });
  } else {
    await collections.address!.insertOne({
      private_key,
      balance: balance.toString(),
      is_processing: false,
      pending_amount: [],
    });
  }

  logger.info(`[import private key] ${JSON.stringify({ address, balance })}`)

  res.status(200).json({
    address,
    balance: balance.toString(),
  });
}
