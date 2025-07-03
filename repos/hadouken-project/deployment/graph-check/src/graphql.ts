import { gql, GraphQLClient } from "graphql-request";

type CurrentDeployResponse = {
  _meta: { deployment: string };
};

type SubgraphStatus = {
  subgraph: string;
  synced: boolean;
  health: "healthy" | "unhealthy";
};

type SubgraphStatusResponse = {
  indexingStatuses: SubgraphStatus[];
};

export const CURRENT_DEPLOY = gql`
  query CurrentDeploy {
    _meta {
      deployment
    }
  }
`;

export const ALL_GRAPHS = gql`
  query AllGraphs {
    indexingStatuses {
      subgraph
      synced
      health
    }
  }
`;

export class Graphql {
  public name: string;
  private client: GraphQLClient;
  private indexerClient: GraphQLClient;

  constructor() {
    this.name = process.env.GraphName;
    this.indexerClient = new GraphQLClient(process.env.GraphqlIndexer);
    this.client = new GraphQLClient(process.env.Graphql);
  }

  async checkStatus(): Promise<{
    status: boolean;
    reason?: string;
  }> {
    try {
      const currentDeployResponse =
        await this.client.request<CurrentDeployResponse>(CURRENT_DEPLOY);

      const currentDeployId = currentDeployResponse._meta.deployment;

      if (!currentDeployId)
        return {
          status: false,
          reason: "Subgraph is not deployed",
        };

      const subgraphStatusesResponse =
        await this.indexerClient.request<SubgraphStatusResponse>(ALL_GRAPHS);

      const subgraphStatus = subgraphStatusesResponse.indexingStatuses.find(
        (status) => status.subgraph === currentDeployId
      );

      if (!subgraphStatus) {
        return {
          status: false,
          reason: "Subgraph is not indexed",
        };
      } else if (!subgraphStatus.synced) {
        return {
          status: false,
          reason: "Subgraph is not synced",
        };
      } else if (subgraphStatus.health !== "healthy") {
        return {
          status: false,
          reason: "Subgraph is not healthy",
        };
      }
    } catch (e) {
      console.error(e);
      return {
        status: false,
        reason: "Unknown error",
      };
    }

    return {
      status: true,
    };
  }
}
