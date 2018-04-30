
const controller = require('../../../src/status/statusController');
const { expect } = require('../../support/TestUtils');

describe('StatusController', () => {

  it('returns status code 200', () => {
    return expect(controller.status()).to.eventually.eql({
      statusCode: 200
    });
  });

});
