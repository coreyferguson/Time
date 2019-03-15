
const sinon = require('sinon');
const chai = require('chai');
const sinonChai = require('sinon-chai');

chai.use(sinonChai);

module.exports = {
  sinon,
  expect: chai.expect
};
