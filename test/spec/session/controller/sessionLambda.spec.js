
const lambda = require('../../../../src/session/controller/sessionLambda');
const Lambda = lambda.SessionLambda;
const { expect, sinon } = require('../../../support/TestUtils');
const getSessionRequest = require('./data/getSessionRequest.json');
const secretsClient = require('../../../support/mockServerlessSecretsClient');

describe('sessionLambda unit test', () => {

  const sandbox = sinon.sandbox.create();

  afterEach(() => {
    sandbox.restore();
  });

  it('passes request and response to filter chain', () => {
    const filterChain = { wrapInChain: sinon.stub().returns(Promise.resolve(true)) };
    const lambda = new Lambda({ filterChain, secretsClient });
    sandbox.stub(lambda, '_configureSecrets').returns(Promise.resolve());
    return lambda.getSession('request content', 'context content', sinon.spy()).then(() => {
      expect(filterChain.wrapInChain.getCall(0).args[0]).to.eql({
        "request": {
          "event": "request content",
          "context": "context content"
        },
        "response": {}
      })
    });
  });

});
