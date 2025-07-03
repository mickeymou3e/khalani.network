export enum Subgraph {
  Balancer = 'balancer',
  Blocks = 'blocks',
}

export type ApolloRequest<T> = (_args: unknown) => Promise<T>
