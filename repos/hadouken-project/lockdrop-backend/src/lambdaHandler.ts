import awsServerlessExpress from '@vendia/serverless-express';
import { APIGatewayProxyEvent, Callback, Context } from 'aws-lambda';

import { createExpressApp } from './app';

let appServer: ReturnType<typeof awsServerlessExpress>;

export const app = async (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback<any>,
) => {
  context.callbackWaitsForEmptyEventLoop = false;
  if (!appServer) {
    const expressApp = await createExpressApp();
    appServer = awsServerlessExpress({ app: expressApp });
  }

  const server = await appServer(event, context, callback);

  return server;
};
