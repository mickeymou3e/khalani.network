import { TransactionStatus } from '@/lib/constants';
import { Transaction, connectToDatabase } from '@/lib/database';
import env from '@/lib/env';
import provider from '@/lib/provider';
import { NextApiRequest, NextApiResponse } from 'next';
import { pino } from 'pino';

const logger = pino();

type Data = {
  transactions?: Transaction[];
  message?: string;
};

const { AXON_FAUCET_REQUIRED_CONFIRMATIONS } = env;

const DEFAULT_STATUS = [
  TransactionStatus.Failed,
  TransactionStatus.Pending,
  TransactionStatus.Confirmed,
] as number[];
const DEFAULT_PAGE_NUM = 0;
const DEFAULT_SIZE_LIMIT = 20;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  if (req.method !== 'GET') {
    res.status(405).json({
      message: 'Method Not Allowed',
    });
    return;
  }
  const { page, limit, status = DEFAULT_STATUS } = req.query;

  const pageNum = parseInt(page as string, 10) ?? DEFAULT_PAGE_NUM;
  const limitNum = parseInt(limit as string, 10) ?? DEFAULT_SIZE_LIMIT;

  const collections = await connectToDatabase();
  let transactions = (await collections
    .transaction!.find({ status: { $in: status as number[] } })
    .skip(pageNum * limitNum)
    .limit(limitNum)
    .project({
      from: 1,
      to: 1,
      value: 1,
      gas: 1,
      nonce: 1,
      hash: 1,
      time: 1,
      status: 1,
    })
    .sort({ time: -1 })
    .toArray()) as Transaction[];

  logger.info(
    `[transactions] ${JSON.stringify({
      page,
      limit,
      status,
      transactions,
    })}`,
  );

  transactions = await Promise.all(
    transactions.map(async (tx) => {
      if (tx.status === TransactionStatus.Pending) {
        const { hash } = tx;
        const receipt = await provider.getTransactionReceipt(hash);
        const confirmations = (await receipt?.confirmations()) ?? 0;
        if (confirmations > AXON_FAUCET_REQUIRED_CONFIRMATIONS) {
          await collections.transaction!.updateOne(
            { hash },
            { status: TransactionStatus.Confirmed },
          );
          tx.status = TransactionStatus.Confirmed;
        }
      }
      return tx;
    }),
  );

  res.status(200).json({
    transactions,
  });
}
