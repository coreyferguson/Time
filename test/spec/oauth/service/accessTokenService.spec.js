
const accessTokenService = require('../../../../src/oauth/service/accessTokenService');
const accessTokenRepository = require('../../../../src/oauth/dao/accessTokenRepository');
const clientService = require('../../../../src/oauth/service/clientService');
const clientRepository = require('../../../../src/oauth/dao/clientRepository');
const userService = require('../../../../src/user/service/userService');
const userRepository = require('../../../../src/user/dao/userRepository');
const { expect, sinon } = require('../../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const path = require('path');

describe('accessTokenService integration test', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../../../serverless.yml')
  );
  let dynamodb, accessTokenTableName, clientTableName;
  let sandbox = sinon.sandbox.create();

  before(function() {
    this.timeout(5000);
    dynamodb = accessTokenRepository._dynamodb;
    accessTokenTableName = accessTokenRepository._accessTokenTableName;
    clientTableName = clientRepository._clientTableName;
    userTableName = userRepository._userTableName;
    let newDynamoDb = facade.start();
    accessTokenRepository._dynamodb = newDynamoDb;
    accessTokenRepository._accessTokenTableName = 'accessToken-test';
    clientRepository._dynamodb = newDynamoDb;
    clientRepository._clientTableName = 'client-test';
    userRepository._dynamodb = newDynamoDb;
    userRepository._userTableName = 'user-test';
    sandbox.stub(console, 'info');
    return Promise.all([
      facade.createTable('accessTokenTable', 'accessToken-test'),
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
        externalAuthMethod: 'externalAuthMethodValue',
        externalAuthId: 'externalAuthIdValue',
        displayName: 'displayNameValue',
        profilePicture: 'profilePictureValue'
      });
    }).then(() => {
      sandbox.restore();
    });
  });

  after(() => {
    accessTokenRepository._dynamodb = dynamodb;
    accessTokenRepository._accessTokenTableName = accessTokenTableName;
    accessTokenRepository._clientTableName = clientTableName;
    accessTokenRepository._userTableName = userTableName;
    facade.stop();
  });

  beforeEach(() => {
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('findOne, no existing accessToken', () => {
    return expect(accessTokenService.findOne('1234')).to.eventually.be.null;
  });

  it('save new accessToken & find & delete', () => {
    const accessTokenExpiresAt = new Date();
    const refreshTokenExpiresAt = new Date();
    return accessTokenService.save({
      accessToken: '1234',
      accessTokenExpiresAt,
      authorizationCode: 'authorizationCodeValue',
      refreshToken: 'refreshTokenValue',
      refreshTokenExpiresAt,
      scope: 'scopeValue',
      client: { id: 'clientIdValue' },
      user: { id: 'userIdValue' }
    }).then(() => {
      return accessTokenService.findOne('1234').then(accessToken => {
        expect(accessToken.accessToken).to.eql('1234');
        expect(accessToken.accessTokenExpiresAt.toISOString()).to.eql(accessTokenExpiresAt.toISOString());
        expect(accessToken.authorizationCode).to.eql('authorizationCodeValue');
        expect(accessToken.refreshToken).to.eql('refreshTokenValue');
        expect(accessToken.refreshTokenExpiresAt.toISOString()).to.eql(refreshTokenExpiresAt.toISOString());
        expect(accessToken.scope).to.eql('scopeValue');
        expect(accessToken.client.id).to.eql('clientIdValue');
        expect(accessToken.user.id).to.eql('userIdValue');
      });
    }).then(() => {
      return accessTokenService.delete('1234');
    }).then(() => {
      return accessTokenService.findOne('1234');
    }).then(accessToken => {
      expect(accessToken).to.be.null;
    });
  });

  it('save existing accessToken', () => {
    const accessTokenExpiresAt = new Date();
    const refreshTokenExpiresAt = new Date();
    let newExpiresAt;
    return accessTokenService.save({
      accessToken: '1234',
      accessTokenExpiresAt,
      authorizationCode: 'authorizationCodeValue',
      refreshToken: 'refreshTokenValue',
      refreshTokenExpiresAt,
      scope: 'scopeValue',
      client: { id: 'clientIdValue' },
      user: { id: 'userIdValue' }
    }).then(() => {
      newAccessTokenExpiresAt = new Date();
      newRefreshTokenExpiresAt = new Date();
      return accessTokenService.save({
        accessToken: '1234',
        accessTokenExpiresAt: newAccessTokenExpiresAt,
        authorizationCode: 'newAuthorizationCodeValue',
        refreshToken: 'newRefreshTokenValue',
        refreshTokenExpiresAt: newRefreshTokenExpiresAt,
        scope: 'newScopeValue',
        client: { id: 'clientIdValue' },
        user: { id: 'userIdValue' }
      });
    }).then(() => {
      return accessTokenService.findOne('1234').then(accessToken => {
        expect(accessToken.accessToken).to.eql('1234');
        expect(accessToken.accessTokenExpiresAt.toISOString()).to.eql(newAccessTokenExpiresAt.toISOString());
        expect(accessToken.authorizationCode).to.eql('newAuthorizationCodeValue');
        expect(accessToken.refreshToken).to.eql('newRefreshTokenValue');
        expect(accessToken.refreshTokenExpiresAt.toISOString()).to.eql(newRefreshTokenExpiresAt.toISOString());
        expect(accessToken.scope).to.eql('newScopeValue');
        expect(accessToken.client.id).to.eql('clientIdValue');
        expect(accessToken.user.id).to.eql('userIdValue');
      });
    });
  });

});
