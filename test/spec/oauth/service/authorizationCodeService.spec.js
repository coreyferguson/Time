
const authorizationCodeService = require('../../../../src/oauth/service/authorizationCodeService');
const authorizationCodeRepository = require('../../../../src/oauth/dao/authorizationCodeRepository');
const clientService = require('../../../../src/oauth/service/clientService');
const clientRepository = require('../../../../src/oauth/dao/clientRepository');
const userService = require('../../../../src/user/service/userService');
const userRepository = require('../../../../src/user/dao/userRepository');
const { expect, sinon } = require('../../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const path = require('path');

describe('authorizationCodeService integration test', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../../../serverless.yml')
  );
  let dynamodb, authorizationCodeTableName, clientTableName, userTableName;
  let sandbox = sinon.sandbox.create();

  before(function() {
    this.timeout(5000);
    dynamodb = authorizationCodeRepository._dynamodb;
    authorizationCodeTableName = authorizationCodeRepository._authorizationCodeTableName;
    clientTableName = clientRepository._clientTableName;
    userTableName = userRepository._userTableName;
    let newDynamoDb = facade.start();
    authorizationCodeRepository._dynamodb = newDynamoDb;
    authorizationCodeRepository._authorizationCodeTableName = 'authorizationCode-test';
    clientRepository._dynamodb = newDynamoDb;
    clientRepository._clientTableName = 'client-test';
    userRepository._dynamodb = newDynamoDb;
    userRepository._userTableName = 'user-test';
    sandbox.stub(console, 'info');
    return Promise.all([
      facade.createTable('authorizationCodeTable', 'authorizationCode-test'),
      facade.createTable('clientTable', 'client-test'),
      facade.createTable('userTable', 'user-test')
    ]).then(() => {
      return clientService.save({
        id: 'clientIdValue',
        secret: 'secretValue',
        redirectUris: [ 'redirectUriValue1' ],
        grants: [ 'grantValue1' ]
      });
    }).then(() => {
      return userService.save({
        id: 'userIdValue',
        authMethod: 'authMethodValue',
        displayName: 'displayNameValue',
        profilePicture: 'profilePictureValue'
      });
    }).then(() => {
      sandbox.restore();
    });
  });

  after(() => {
    authorizationCodeRepository._dynamodb = dynamodb;
    authorizationCodeRepository._authorizationCodeTableName = authorizationCodeTableName;
    authorizationCodeRepository._clientTableName = clientTableName;
    authorizationCodeRepository._userTableName = userTableName;
    facade.stop();
  });

  beforeEach(() => {
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('findOne, no existing authorizationCode', () => {
    return expect(authorizationCodeService.findOne('1234')).to.eventually.be.null;
  });

  it('save new authorizationCode & find & delete', () => {
    const expiresAt = new Date();
    return authorizationCodeService.save({
      authorizationCode: '1234',
      expiresAt,
      redirectUri: 'redirectUriValue',
      scope: 'scopeValue',
      client: { id: 'clientIdValue' },
      user: { id: 'userIdValue' }
    }).then(() => {
      return authorizationCodeService.findOne('1234').then(authorizationCode => {
        expect(authorizationCode.authorizationCode).to.eql('1234');
        expect(authorizationCode.expiresAt.toISOString()).to.eql(expiresAt.toISOString());
        expect(authorizationCode.redirectUri).to.eql('redirectUriValue');
        expect(authorizationCode.scope).to.eql('scopeValue');
        expect(authorizationCode.client.id).to.eql('clientIdValue');
        expect(authorizationCode.user.id).to.eql('userIdValue');
      });
    }).then(() => {
      return authorizationCodeService.delete('1234');
    }).then(() => {
      return authorizationCodeService.findOne('1234');
    }).then(authorizationCode => {
      expect(authorizationCode).to.be.null;
    });
  });

  it('save existing authorizationCode', () => {
    const expiresAt = new Date();
    let newExpiresAt;
    return authorizationCodeService.save({
      authorizationCode: '1234',
      expiresAt,
      redirectUri: 'redirectUriValue',
      scope: 'scopeValue',
      client: { id: 'clientIdValue' },
      user: { id: 'userIdValue' }
    }).then(() => {
      newExpiresAt = new Date();
      return authorizationCodeService.save({
        authorizationCode: '1234',
        expiresAt: newExpiresAt,
        redirectUri: 'newRedirectUriValue',
        scope: 'newScopeValue',
        client: { id: 'clientIdValue' },
        user: { id: 'userIdValue' }
      });
    }).then(() => {
      return authorizationCodeService.findOne('1234').then(authorizationCode => {
        expect(authorizationCode.authorizationCode).to.eql('1234');
        expect(authorizationCode.expiresAt.toISOString()).to.eql(newExpiresAt.toISOString());
        expect(authorizationCode.redirectUri).to.eql('newRedirectUriValue');
        expect(authorizationCode.scope).to.eql('newScopeValue');
        expect(authorizationCode.client.id).to.eql('clientIdValue');
        expect(authorizationCode.user.id).to.eql('userIdValue');
      });
    });
  });

});
