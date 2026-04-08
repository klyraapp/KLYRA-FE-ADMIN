import { ApolloClient, InMemoryCache } from "@apollo/client";
import { HttpLink } from "@apollo/client/link/http";

const link = new HttpLink({
  uri: "https://deep-gecko-trivially.ngrok-free.app/graphql", // Your GraphQL API endpoint
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
