
const typeDefsSource = require('../../src/graphql/typeDefs');
const resolvers = require('../../src/graphql/resolvers');
const TimerDataSource = require('../../src/timer/graphql/TimerDataSource');

module.exports = (ApolloServer, gql) => {
  const typeDefs = gql(typeDefsSource);
  return new ApolloServer({
    typeDefs,
    resolvers,
    context: req => {
      return { user: { id: 'google-oauth2|110913751698143662875' } };
    },
    dataSources: () => ({
      timer: new TimerDataSource()
    })
  });
};
