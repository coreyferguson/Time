
const { expect, sinon } = require('../support/TestUtils');
const { Secrets } = require('../../src/secrets');
const ssm = require('../support/mock/mockSsm');
const logger = require('../support/mock/mockLogger');

describe('secrets', () => {

  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it('fetch parameters from aws', async () => {
    const secrets = instantiateSecrets();
    const timer = { stop: sandbox.spy() };
    sandbox.stub(logger, 'startTimer').returns(timer);
    const spy = sandbox.stub(ssm, 'getParameters')
      .callsFake((o, cb) => {
        cb(undefined, {
          InvalidParameters: [],
          Parameters: [
            mockParam('/time-api/test/TEST_KEY', 'TEST_VALUE')
          ]
        })
      });
    const values = await secrets.load(['TEST_KEY']);
    expect(values.size).to.eql(1);
    expect(values.get('TEST_KEY')).to.eql('TEST_VALUE');
    expect(timer.stop).to.be.calledWith(true);
  });

  it('cache parameters from aws', () => {
    const secrets = instantiateSecrets();
    const spy = sandbox.stub(ssm, 'getParameters')
      .callsFake((o, cb) => {
        cb(undefined, {
          InvalidParameters: [],
          Parameters: [
            mockParam('/time-api/test/TEST_KEY', 'TEST_VALUE')
          ]
        })
      });
    return Promise.all([
      secrets.load(['TEST_KEY']),
      secrets.load(['TEST_KEY'])
    ]).then(() => {
      return secrets.load(['TEST_KEY']);
    }).then(values => {
      expect(spy).to.be.calledOnce;
    });
  });

  it('only fetch missing keys from aws', () => {
    const secrets = instantiateSecrets();
    const spy = sandbox.stub(ssm, 'getParameters')
      .callsFake((o, cb) => {
        cb(undefined, {
          InvalidParameters: [],
          Parameters: o.Names.map(name => mockParam(name, name))
        })
      });
    return secrets.load([ 'TEST_KEY1', 'TEST_KEY2' ]).then(() => {
      return secrets.load([ 'TEST_KEY2', 'TEST_KEY3' ]);
    }).then(values => {
      expect(spy).to.be.calledTwice;
      expect(spy.getCall(0).args[0].Names).to.eql([
        '/time-api/test/TEST_KEY1',
        '/time-api/test/TEST_KEY2'
      ]);
      expect(spy.getCall(1).args[0].Names).to.eql(['/time-api/test/TEST_KEY3']);
    });
  });

  it('throw errors when secret not found', () => {
    const secrets = instantiateSecrets();
    const spy = sandbox.stub(ssm, 'getParameters')
      .callsFake((o, cb) => {
        cb(undefined, {
          InvalidParameters: [ '/time-api/test/TEST_SECRET' ],
          Parameters: []
        })
      });
    return expect(secrets.load(['TEST_SECRET'])).to.eventually.be.rejectedWith('TEST_SECRET')
  });

  it('timer stops with error when error fetching secrets', async () => {
    const secrets = instantiateSecrets();
    const timer = { stop: sandbox.spy() };
    sandbox.stub(logger, 'startTimer').returns(timer);
    sandbox.stub(secrets, '_fetchFromAWS').returns(Promise.reject('oops'));
    await expect(secrets.load(['TEST_SECRET'])).to.eventually.be.rejected;
    expect(timer.stop).to.be.calledWith(false);
  });

  it('retry fetch after unexpected error from aws');

});

function mockParam(key, value) {
  return {
    "Name": key,
    "Type": "SecureString",
    "Value": value,
    "Version": 1,
    "LastModifiedDate": "2019-03-18T01:29:01.402Z",
    "ARN": `arn:aws:ssm:us-west-2:123456789012:parameter/time-api/test/${key}`
  };
}

function instantiateSecrets() {
  return new Secrets({ env: { stage: 'test' }, ssm, logger })
}
