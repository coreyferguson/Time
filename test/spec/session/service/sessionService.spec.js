
const sessionService = require('../../../../src/session/service/sessionService');
const sessionRepository = require('../../../../src/session/dao/sessionRepository');
const userService = require('../../../../src/user/service/userService');
const userRepository = require('../../../../src/user/dao/userRepository');
const { expect, sinon } = require('../../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const path = require('path');
const serverlessConfig = require('../../../../serverless.yml');

describe('sessionService integration test', () => {

  const facade = new LocalDynamoFacade(serverlessConfig);
  let dynamodb, sessionTableName, userTableName;
  let sandbox = sinon.sandbox.create();

  before(function() {
    this.timeout(5000);
    dynamodb = sessionRepository._dynamodb;
    sessionTableName = sessionRepository._sessionTableName;
    userTableName = userRepository._userTableName;
    let newDynamoDb = facade.start();
    sessionRepository._dynamodb = newDynamoDb;
    sessionRepository._sessionTableName = 'session-test';
    userRepository._dynamodb = newDynamoDb;
    userRepository._userTableName = 'user-test';
    sandbox.stub(console, 'info');
    return Promise.all([
      facade.createTable('sessionTable', 'session-test'),
      facade.createTable('userTable', 'user-test')
    ]).then(() => {
      return userService.save({
        id: 'userIdValue',
        externalAuthId: 'externalAuthIdValue',
        externalAuthMethod: 'externalAuthMethodValue',
        displayName: 'displayNameValue',
        profilePicture: 'profilePictureValue'
      });
    }).then(() => {
      sandbox.restore();
    });
  });

  after(() => {
    sessionRepository._dynamodb = dynamodb;
    sessionRepository._sessionTableName = sessionTableName;
    sessionRepository._userTableName = userTableName;
    facade.stop();
  });

  beforeEach(() => {
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('findOne, no existing session', () => {
    return expect(sessionService.findOne('1234')).to.eventually.be.null;
  });

  it('save new session & find & delete', () => {
    const createdOn = new Date();
    return sessionService.save({
      id: '1234',
      createdOn,
      user: { id: 'userIdValue' }
    }).then(() => {
      return sessionService.findOne('1234').then(session => {
        expect(session.id).to.eql('1234');
        expect(session.createdOn.toISOString()).to.eql(createdOn.toISOString());
        expect(session.user.id).to.eql('userIdValue');
      });
    }).then(() => {
      return sessionService.delete('1234');
    }).then(() => {
      return sessionService.findOne('1234');
    }).then(session => {
      expect(session).to.be.null;
    });
  });

  it('save existing session', () => {
    const createdOn = new Date();
    let newExpiresAt;
    return sessionService.save({
      id: '1234',
      createdOn,
      user: { id: 'userIdValue' }
    }).then(() => {
      newCreatedOn = new Date();
      return sessionService.save({
        id: '1234',
        createdOn: newCreatedOn,
        user: { id: 'userIdValue' }
      });
    }).then(() => {
      return sessionService.findOne('1234').then(session => {
        expect(session.id).to.eql('1234');
        expect(session.createdOn.toISOString()).to.eql(newCreatedOn.toISOString());
        expect(session.user.id).to.eql('userIdValue');
      });
    });
  });

});
