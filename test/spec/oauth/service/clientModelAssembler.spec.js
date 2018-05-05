
const { expect } = require('../../../support/TestUtils');
const clientModelAssembler = require('../../../../src/oauth/service/clientModelAssembler');

describe('clientModelAssembler unit tests', () => {

  it('null model from null entity', () => {
    const model = clientModelAssembler.toModel(null);
    expect(model).to.be.null;
  });

  it('assemble model from entity - all properties', () => {
    const createdOn = new Date();
    const model = clientModelAssembler.toModel({
      Item: {
        id: { S: 'idValue' },
        secret: { S: 'secretValue' },
        redirectUris: { L: [
          { S: 'redirectUriValue1' },
          { S: 'redirectUriValue2' }
        ] },
        grants: { L: [
          { S: 'grantValue1' },
          { S: 'grantValue2' }
        ] },
        createdOn: { S: createdOn.toISOString() }
      }
    });
    expect(model.id).to.eql('idValue');
    expect(model.secret).to.eql('secretValue');
    expect(model.redirectUris).to.eql([
      'redirectUriValue1',
      'redirectUriValue2'
    ]);
    expect(model.grants).to.eql([
      'grantValue1',
      'grantValue2'
    ]);
    expect(model.createdOn.toISOString()).to.eql(createdOn.toISOString());
  });

  it('null entity from null model', () => {
    const entity = clientModelAssembler.toEntity(null);
    expect(entity).to.be.null;
  });

  it('assemble entity from model - all properties', () => {
    const createdOn = new Date();
    const entity = clientModelAssembler.toEntity({
      id: 'idValue',
      secret: 'secretValue',
      redirectUris: [
        'redirectUriValue1',
        'redirectUriValue2'
      ],
      grants: [
        'grantValue1',
        'grantValue2'
      ],
      createdOn
    });
    expect(entity).to.eql({
      id: { S: 'idValue' },
      secret: { S: 'secretValue' },
      redirectUris: { L: [
        { S: 'redirectUriValue1' },
        { S: 'redirectUriValue2' }
      ] },
      grants: { L: [
        { S: 'grantValue1' },
        { S: 'grantValue2' }
      ] },
      createdOn: { S: createdOn.toISOString() }
    });
  });

  it('assemble entity from model - required properties', () => {
    const entity = clientModelAssembler.toEntity({
      id: 'idValue',
      secret: 'secretValue',
      redirectUris: [
        'redirectUriValue1',
        'redirectUriValue2'
      ],
      grants: [
        'grantValue1',
        'grantValue2'
      ]
    });
    expect(entity.id).to.eql({ S: 'idValue' });
    expect(entity.secret).to.eql({ S: 'secretValue' });
    expect(entity.redirectUris).to.eql({
      L: [
        { S: 'redirectUriValue1' },
        { S: 'redirectUriValue2' }
      ]
    });
    expect(entity.grants).to.eql({
      L: [
        { S: 'grantValue1' },
        { S: 'grantValue2' }
      ]
    });
    expect(entity.createdOn).to.not.be.null;
  });

  it('assemble entity from model and existing entity', () => {
    const createdOn = new Date();
    const entity = clientModelAssembler.toEntity({
      id: 'idValue',
      secret: 'secretValue',
      redirectUris: [
        'redirectUriValue1',
        'redirectUriValue2'
      ],
      grants: [
        'grantValue1',
        'grantValue2'
      ]
    }, {
      Item: {
        id: { S: 'idValue' },
        secret: { S: 'oldSecretValue' },
        redirectUris: {
          L: [
            { S: 'oldRedirectUriValue1' },
            { S: 'oldRedirectUriValue2' }
          ]
        },
        grants: {
          L: [
            { S: 'oldGrantValue1' },
            { S: 'oldGrantValue2' }
          ]
        },
        createdOn: { S: createdOn.toISOString() }
      }
    });
    expect(entity.id).to.eql({ S: 'idValue' });
    expect(entity.secret).to.eql({ S: 'secretValue' });
    expect(entity.redirectUris).to.eql({
      L: [
        { S: 'redirectUriValue1' },
        { S: 'redirectUriValue2' }
      ]
    });
    expect(entity.grants).to.eql({
      L: [
        { S: 'grantValue1' },
        { S: 'grantValue2' }
      ]
    });
    expect(entity.createdOn.S).to.eql(createdOn.toISOString());
  });

});
