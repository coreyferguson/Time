
const { expect, sinon } = require('../../support/TestUtils');
const { StatusLambda } = require('../../../src/status/statusLambda');
const controller = require('./mockStatusController');

describe('StatusLambda', () => {

  const sandbox = sinon.sandbox.create();
  let lambda;

  before(() => {
    lambda = new StatusLambda({
      controller
    });
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('proxy controller', () => {
    const spy = sandbox.stub(controller, 'status')
      .returns(Promise.resolve({}));
    return lambda.status({}, {}, () => {}).then(() => {
      expect(spy.calledOnce).to.be.true;
    });
  });

});
