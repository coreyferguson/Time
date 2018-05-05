
const { expect } = require('../../../support/TestUtils');
const accessTokenModelAssembler = require('../../../../src/oauth/service/accessTokenModelAssembler');

describe('accessTokenModelAssembler unit tests', () => {

  it('null model from null entity', () => {
    const model = accessTokenModelAssembler.toModel(null);
    expect(model).to.be.null;
  });

  it('assemble model from entity - all properties', () => {
    const accessTokenExpiresAt = new Date();
    const refreshTokenExpiresAt = new Date();
    const model = accessTokenModelAssembler.toModel({
      Item: {
        accessToken: { S: 'accessTokenValue' },
        accessTokenExpiresAt: { S: accessTokenExpiresAt.toISOString() },
        authorizationCode: { S: 'authorizationCodeValue' },
        refreshToken: { S: 'refreshTokenValue' },
        refreshTokenExpiresAt: { S: refreshTokenExpiresAt.toISOString() },
        scope: { S: 'scopeValue' },
        clientId: 'clientIdValue',
        userId: 'userIdValue'
      }
    }, {
      id: 'clientIdValue'
    }, {
      id: 'userIdValue'
    });
    expect(model.accessToken).to.eql('accessTokenValue');
    expect(model.accessTokenExpiresAt.toISOString()).to.eql(accessTokenExpiresAt.toISOString());
    expect(model.authorizationCode).to.eql('authorizationCodeValue');
    expect(model.refreshToken).to.eql('refreshTokenValue');
    expect(model.refreshTokenExpiresAt.toISOString()).to.eql(refreshTokenExpiresAt.toISOString());
    expect(model.scope).to.eql('scopeValue');
    expect(model.client.id).to.eql('clientIdValue');
    expect(model.user.id).to.eql('userIdValue');
  });

  it('null entity from null model', () => {
    const entity = accessTokenModelAssembler.toEntity(null);
    expect(entity).to.be.null;
  });

  it('assemble entity from model - all properties', () => {
    const accessTokenExpiresAt = new Date();
    const refreshTokenExpiresAt = new Date();
    const entity = accessTokenModelAssembler.toEntity({
      accessToken: 'accessTokenValue',
      accessTokenExpiresAt,
      authorizationCode: 'authorizationCodeValue',
      refreshToken: 'refreshTokenValue',
      refreshTokenExpiresAt,
      scope: 'scopeValue',
      client: { id: 'clientIdValue' },
      user: { id: 'userIdValue' }
    });
    expect(entity).to.eql({
      accessToken: { S: 'accessTokenValue' },
      accessTokenExpiresAt: { S: accessTokenExpiresAt.toISOString() },
      authorizationCode: { S: 'authorizationCodeValue' },
      refreshToken: { S: 'refreshTokenValue' },
      refreshTokenExpiresAt: { S: refreshTokenExpiresAt.toISOString() },
      scope: { S: 'scopeValue' },
      clientId: { S: 'clientIdValue' },
      userId: { S: 'userIdValue' }
    });
  });

});
