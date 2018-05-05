
const corsFilter = require('../../../src/core/corsFilter');
const { expect, sinon } = require('../../support/TestUtils');

describe('corsFilter unit tests', () => {

  const defaultHeaders = {
    'Access-Control-Allow-Origin': 'https://time-test.overattribution.com',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  let sandbox = sinon.sandbox.create();

  before(() => {
    sandbox.stub(console, 'info');
  });

  after(() => {
    sandbox.restore();
  });

  it('does not overwrite any existing headers', () => {
    const response = {
      statusCode: 200,
      headers: { 'existingHeaderLabel': 'existingHeaderValue' }
    };
    return corsFilter.process({
      request: { headers: { origin: 'https://time-test.overattribution.com' } },
      response
    }).then(shouldContinue => {
      expect(shouldContinue).to.be.true;
      expect(response).to.eql({
        statusCode: 200,
        headers: Object.assign(
          { 'existingHeaderLabel': 'existingHeaderValue' },
          defaultHeaders
        )
      });
    });
  });

  it('is not an allowed origin', () => {
    const event = {
      request: { headers: { origin: 'https://notmydomain.com' } },
      response: { statusCode: 200 }
    };
    return corsFilter.process(event).then(shouldContinue => {
      expect(shouldContinue).to.be.true;
      expect(event.response).to.eql({
        statusCode: 200,
        headers: defaultHeaders
      });
    });
  });

  it('is default origin', () => {
    const event = {
      request: { headers: { origin: 'https://time-test.overattribution.com' } },
      response: { statusCode: 200 }
    };
    return corsFilter.process(event).then(shouldContinue => {
      expect(shouldContinue).to.be.true;
      expect(event.response).to.eql({
        statusCode: 200,
        headers: defaultHeaders
      });
    });
  });

  it('is alternative origin', () => {
    const event = {
      request: { headers: { origin: 'https://time-test2.overattribution.com:3000' } },
      response: { statusCode: 200 }
    };
    return corsFilter.process(event).then(shouldContinue => {
      expect(shouldContinue).to.be.true;
      expect(event.response).to.eql({
        statusCode: 200,
        headers: Object.assign(
          {},
          defaultHeaders,
          {
            'Access-Control-Allow-Origin':
              'https://time-test2.overattribution.com:3000',
          }
        )
      });
    });
  });

  it('header is `Origin` with uppercase O', () => {
    const event = {
      request: { headers: { Origin: 'https://time-test.overattribution.com' } },
      response: { statusCode: 200 }
    };
    return corsFilter.process(event).then(shouldContinue => {
      expect(shouldContinue).to.be.true;
      expect(event.response).to.eql({
        statusCode: 200,
        headers: defaultHeaders
      });
    });
  });

});
