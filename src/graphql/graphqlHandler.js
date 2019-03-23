
const { ApolloServer, gql } = require('apollo-server-lambda');
const createApolloServer = require('./createApolloServer');

exports.handler = createApolloServer(ApolloServer, gql).createHandler();
