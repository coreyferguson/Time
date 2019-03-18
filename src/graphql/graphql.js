
const { ApolloServer, gql } = require('apollo-server-lambda');
const logger = require('../logger');
const uuid = require('uuid');
const secrets = require('../secrets');

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String,
    name: String,
    secret: String
  }
`;

const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => {
      const timer = logger.startTimer('graphql.resolvers.Query.hello', uuid());
      return timeout(Math.ceil(Math.random()*10)*100).then(() => {
        timer.stop();
        return 'Hello world!';
      });
    },
    name: () => {
      const timer = logger.startTimer('graphql.resolvers.Query.name', uuid());
      return timeout(Math.ceil(Math.random()*10)*1000).then(() => {
        timer.stop();
        return 'Captain Awesome';
      });
    },
    secret: () => {
      const timer = logger.startTimer('graphql.resolvers.Query.secret', uuid());
      return secrets.load(['TEST_SECRET']).then(values => {
        timer.stop();
        return JSON.stringify(values);
      }).catch(err => {
        timer.stop(false);
        console.info(err);
        throw new Error('Unexpected exception occurred. Please try again later.')
      });
    }
  }
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.handler = server.createHandler();
