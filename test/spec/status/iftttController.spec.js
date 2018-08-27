
const controller = require('../../../src/ifttt/iftttController');
const { expect, sinon } = require('../../support/TestUtils');

describe('IftttController', () => {

  const sandbox = sinon.sandbox.create();

  beforeEach(() => {
    sandbox.stub(controller, 'getIftttServiceKey')
      .returns('expected ifttt service key value');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('returns status code 200', () => {
    const event = {
      headers: {
        'Ifttt-Channel-Key': 'expected ifttt service key value',
        'Ifttt-Service-Key': 'expected ifttt service key value'
      }
    };
    return expect(controller.status(event)).to.eventually.eql({
      statusCode: 200
    });
  });

  it('invalid channel key', () => {
    const event = {
      headers: {
        'Ifttt-Channel-Key': 'invalid ifttt service key value',
        'Ifttt-Service-Key': 'expected ifttt service key value'
      }
    };
    return expect(controller.status(event)).to.eventually.eql({
      statusCode: 401
    });
  });

  it('invalid service key', () => {
    const event = {
      headers: {
        'Ifttt-Channel-Key': 'expected ifttt service key value',
        'Ifttt-Service-Key': 'invalid ifttt service key value'
      }
    };
    return expect(controller.status(event)).to.eventually.eql({
      statusCode: 401
    });
  });

});
