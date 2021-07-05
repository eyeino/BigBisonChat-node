import { ApolloServer } from 'apollo-server-express';
import { typeDefs } from './typedefs.graphql';
import { resolvers } from './resolvers.graphql';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

export { apolloServer };
