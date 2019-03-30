
process.env.stage = 'dev';
process.env.userTimerLogTableName = 'time-api-userTimerLog-dev';
process.env.userTimerTableName = 'time-api-userTimer-dev';

const { ApolloServer, gql } = require('apollo-server');
const createApolloServer = require('../../src/graphql/createApolloServer');

createApolloServer(ApolloServer, gql).listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
