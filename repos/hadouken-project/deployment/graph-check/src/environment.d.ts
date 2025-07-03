export {};

declare global {
  namespace NodeJs {
    interface ProcessEnv {
      DiscordWebhook: string;
      GraphName: string;
      Graphql: string;
      GraphqlIndexer: string;
      ChainId: number;
      GodwokenRPC: string;
    }
  }
}
