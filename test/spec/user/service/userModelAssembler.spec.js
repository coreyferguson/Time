
const { expect } = require('../../../support/TestUtils');
const userModelAssembler = require('../../../../src/user/service/userModelAssembler');

describe('userModelAssembler unit tests', () => {

  it('null model from null entity', () => {
    const model = userModelAssembler.toModel(null);
    expect(model).to.be.null;
  });

  it('assemble model from entity - all properties', () => {
    const model = userModelAssembler.toModel({
      Item: {
        id: { S: '881936187492941825' },
        authMethod: { S: 'authMethodValue' },
        displayName: { S: 'displayNameValue' },
        profilePicture: { S: 'profilePictureValue' },
        createdOn: { S: 'createdOnValue' }
      }
    });
    expect(model).to.eql({
      id: '881936187492941825',
      authMethod: 'authMethodValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue',
      createdOn: 'createdOnValue'
    });
  });

  it('null entity from null model', () => {
    const entity = userModelAssembler.toEntity(null);
    expect(entity).to.be.null;
  });

  it('assemble entity from model - all properties', () => {
    const entity = userModelAssembler.toEntity({
      id: '881936187492941825',
      authMethod: 'authMethodValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue',
      createdOn: 'createdOnValue'
    });
    expect(entity).to.eql({
      id: { S: '881936187492941825' },
      authMethod: { S: 'authMethodValue' },
      displayName: { S: 'displayNameValue' },
      profilePicture: { S: 'profilePictureValue' },
      createdOn: { S: 'createdOnValue' }
    });
  });

});
