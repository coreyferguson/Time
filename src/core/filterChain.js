
const FilterChain = require('promise-filter-chain');
const corsFilter = require('./corsFilter');

module.exports = new FilterChain([corsFilter]);
