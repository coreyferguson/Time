
const FilterChain = require('promise-filter-chain');
const corsFilter = require('./corsFilter');
const secretsFilter = require('./secretsFilter');
const auth0TokenVerifyFilter = require('./auth0TokenVerifyFilter');

module.exports = new FilterChain([
  corsFilter,
  secretsFilter,
  auth0TokenVerifyFilter
]);
