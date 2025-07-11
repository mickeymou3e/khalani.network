import { ApolloClient, InMemoryCache, createHttpLink, } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support/rsc";


export const { getClient } = registerApolloClient(() => {
  return new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: `${process.env.EZKL_HUB_URL}/graphql`,
    }),
    cache: new InMemoryCache(),
  });
});

export const client = new ApolloClient({
  uri: `${process.env.EZKL_HUB_URL}/graphql`,
  cache: new InMemoryCache()
})