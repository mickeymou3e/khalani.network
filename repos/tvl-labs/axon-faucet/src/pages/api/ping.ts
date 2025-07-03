import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  _: NextApiRequest,
  res: NextApiResponse<string>,
) {
  res.status(200).send('pong');
}
