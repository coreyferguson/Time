
const { expect } = require('../../../support/TestUtils');
const authorizationCodeModelAssembler = require('../../../../src/oauth/service/authorizationCodeModelAssembler');

describe('authorizationCodeModelAssembler unit tests', () => {

  it('null model from null entity', () => {
    const model = authorizationCodeModelAssembler.toModel(null);
    expect(model).to.be.null;
  });

  it('assemble model from entity - all properties', () => {
    const expiresAt = new Date();
    const model = authorizationCodeModelAssembler.toModel({
      Item: {
        authorizationCode: { S: 'authorizationCodeValue' },
        expiresAt: { S: expiresAt.toISOString() },
        redirectUri: { S: 'redirectUriValue' },
        scope: { S: 'scopeValue' },
        clientId: 'clientIdValue',
        userId: 'userIdValue'
      }
    }, {
      id: 'clientIdValue'
    }, {
      id: 'userIdValue'
    });
    expect(model.authorizationCode).to.eql('authorizationCodeValue');
    expect(model.expiresAt.toISOString()).to.eql(expiresAt.toISOString());
    expect(model.redirectUri).to.eql('redirectUriValue');
    expect(model.scope).to.eql('scopeValue');
    expect(model.client.id).to.eql('clientIdValue');
    expect(model.user.id).to.eql('userIdValue');
  });

  it('null entity from null model', () => {
    const entity = authorizationCodeModelAssembler.toEntity(null);
    expect(entity).to.be.null;
  });

  it('assemble entity from model - all properties', () => {
    const expiresAt = new Date();
    const entity = authorizationCodeModelAssembler.toEntity({
      authorizationCode: 'authorizationCodeValue',
      expiresAt,
      redirectUri: 'redirectUriValue',
      scope: 'scopeValue',
      client: { id: 'clientIdValue' },
      user: { id: 'userIdValue' }
    });
    expect(entity).to.eql({
      authorizationCode: { S: 'authorizationCodeValue' },
      expiresAt: { S: expiresAt.toISOString() },
      redirectUri: { S: 'redirectUriValue' },
      scope: { S: 'scopeValue' },
      clientId: { S: 'clientIdValue' },
      userId: { S: 'userIdValue' }
    });
  });

});
