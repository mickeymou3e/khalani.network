import { Address, connectToDatabase } from '@/lib/database';
import provider from '@/lib/provider';
import { ethers } from 'ethers';
import { NextApiRequest, NextApiResponse } from 'next';
import { ZodError, z } from 'zod';
import { pino } from 'pino';

const logger = pino();

type Data =
  | { address: string; balance: string }[]
  | {
      message: string;
      error?: ZodError;
    };

const schema = z.object({
  mnemonic: z.string(),
  count: z.number().optional(),
  pathRaw: z.boolean().optional(),
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
  const { mnemonic, count = 10, pathRaw = false } = params.data;
  if (!ethers.Mnemonic.isValidMnemonic(mnemonic)) {
    res.status(400).json({ message: 'Invalid mnemonic' });
    return;
  }

  const path = pathRaw
    ? String(pathRaw)
    : ethers.defaultPath.substring(0, ethers.defaultPath.length - 1);
  const addresses = await Promise.all(
    Array.from(Array(count).keys(), async (i) => {
      const node = ethers.HDNodeWallet.fromPhrase(
        mnemonic,
        undefined,
        `${path}${i}`,
      );
      const balance = await provider.getBalance(node.address);

      return {
        address: node.address,
        private_key: node.privateKey,
        balance: balance.toString(),
      };
    }),
  );

  const collections = await connectToDatabase();
  const existsAddress = (await collections
    .address!.find({
      private_key: { $in: addresses.map((ad) => ad.private_key) },
    })
    .project({
      private_key: 1,
    })
    .toArray()) as Pick<Address, 'private_key'>[];

  const newAddresses = addresses.filter(
    (ad) =>
      !existsAddress.some(({ private_key }) => ad.private_key === private_key),
  );

  if (newAddresses.length === 0) {
    res.status(200).json([]);
    return;
  }

  await collections.address!.insertMany(
    newAddresses.map(({ private_key, balance }) => ({
      private_key,
      balance,
      is_processing: false,
      pending_amount: [],
    })),
  );

  const response = addresses.map(({ address, balance }) => ({ address, balance }));
  logger.info(`[import mnemonic] addresses: ${JSON.stringify(response)}`);

  res
    .status(200)
    .json(response);
}
