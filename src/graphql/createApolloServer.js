
const typeDefsSource = require('../../src/graphql/typeDefs');
const resolvers = require('../../src/graphql/resolvers');
const TimerDataSource = require('../../src/timer/graphql/TimerDataSource');
const logger = require('../logger');
const uuid = require('uuid');
const oAuthService = require('../auth/oAuthService');

module.exports = (ApolloServer, gql, context) => {
  const typeDefs = gql(typeDefsSource);
  const defaultContext = async (options) => {
    const headers = options && options.event && options.event.headers || {};
    logger.tid(uuid()); // TODO: Reuse tid from client if present
    const token = headers['Authorization']
      ? headers['Authorization'].slice(7)
      : undefined;
    const accessToken = await oAuthService.verify(token);
    return {
      user: {
        id: accessToken.sub
      },
      auth: {
        accessToken
      }
    };
  };
  context = context || defaultContext;
  return new ApolloServer({
    typeDefs,
    resolvers,
    context,
    dataSources: () => ({
      timer: new TimerDataSource()
    })
  });
};
