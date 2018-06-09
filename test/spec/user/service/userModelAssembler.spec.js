
const { expect } = require('../../../support/TestUtils');
const userModelAssembler = require('../../../../src/user/service/userModelAssembler');

describe('userModelAssembler unit tests', () => {

  it('null model from null entity', () => {
    const model = userModelAssembler.toModel(null);
    expect(model).to.be.null;
  });

  it('assemble model from entity - all properties', () => {
    const createdOn = new Date();
    const model = userModelAssembler.toModel({
      Item: {
        id: { S: 'idValue' },
        externalAuthMethod: { S: 'externalAuthMethodValue' },
        externalAuthId: { S: 'externalAuthIdValue' },
        displayName: { S: 'displayNameValue' },
        profilePicture: { S: 'profilePictureValue' },
        createdOn: { S: createdOn.toISOString() }
      }
    });
    expect(model.id).to.eql('idValue');
    expect(model.externalAuthMethod).to.eql('externalAuthMethodValue');
    expect(model.externalAuthId).to.eql('externalAuthIdValue');
    expect(model.displayName).to.eql('displayNameValue');
    expect(model.profilePicture).to.eql('profilePictureValue');
    expect(model.createdOn.toISOString()).to.eql(createdOn.toISOString());
  });

  it('null entity from null model', () => {
    const entity = userModelAssembler.toEntity(null);
    expect(entity).to.be.null;
  });

  it('assemble entity from model - all properties', () => {
    const createdOn = new Date();
    const entity = userModelAssembler.toEntity({
      id: 'idValue',
      externalAuthMethod: 'externalAuthMethodValue',
      externalAuthId: 'externalAuthIdValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue',
      createdOn
    });
    expect(entity).to.eql({
      id: { S: 'idValue' },
      externalAuthMethod: { S: 'externalAuthMethodValue' },
      externalAuthId: { S: 'externalAuthIdValue' },
      displayName: { S: 'displayNameValue' },
      profilePicture: { S: 'profilePictureValue' },
      createdOn: { S: createdOn.toISOString() }
    });
  });

  it('assemble entity from model - required properties', () => {
    const entity = userModelAssembler.toEntity({
      id: 'idValue',
      externalAuthMethod: 'externalAuthMethodValue',
      externalAuthId: 'externalAuthIdValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue'
    });
    expect(entity.id).to.eql({ S: 'idValue' });
    expect(entity.externalAuthMethod).to.eql({ S: 'externalAuthMethodValue' });
    expect(entity.externalAuthId).to.eql({ S: 'externalAuthIdValue' });
    expect(entity.displayName).to.eql({ S: 'displayNameValue' });
    expect(entity.profilePicture).to.eql({ S: 'profilePictureValue' });
    expect(entity.createdOn).to.not.be.null;
  });

  it('assemble entity from model and existing entity', () => {
    const createdOn = new Date();
    const entity = userModelAssembler.toEntity({
      id: 'idValue',
      externalAuthMethod: 'externalAuthMethodValue',
      externalAuthId: 'externalAuthIdValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue'
    }, {
      Item: {
        id: { S: 'idValue' },
        externalAuthMethod: { S: 'oldExternalAuthMethodValue' },
        externalAuthId: { S: 'oldExternalAuthIdValue' },
        displayName: { S: 'oldDisplayNameValue' },
        profilePicture: { S: 'oldProfilePictureValue' },
        createdOn: { S: createdOn.toISOString() }
      }
    });
    expect(entity.id).to.eql({ S: 'idValue' });
    expect(entity.externalAuthMethod).to.eql({ S: 'externalAuthMethodValue' });
    expect(entity.externalAuthId).to.eql({ S: 'externalAuthIdValue' });
    expect(entity.displayName).to.eql({ S: 'displayNameValue' });
    expect(entity.profilePicture).to.eql({ S: 'profilePictureValue' });
    expect(entity.createdOn.S).to.eql(createdOn.toISOString());
  });

});
