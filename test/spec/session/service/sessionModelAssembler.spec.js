
const { expect } = require('../../../support/TestUtils');
const sessionModelAssembler = require('../../../../src/session/service/sessionModelAssembler');

describe('sessionModelAssembler unit tests', () => {

  it('null model from null entity', () => {
    const model = sessionModelAssembler.toModel(null);
    expect(model).to.be.null;
  });

  it('assemble model from entity - all properties', () => {
    const createdOn = new Date();
    const model = sessionModelAssembler.toModel({
      Item: {
        id: { S: 'idValue' },
        createdOn: { S: createdOn.toISOString() },
        userId: 'userIdValue'
      }
    }, {
      id: 'userIdValue'
    });
    expect(model.id).to.eql('idValue');
    expect(model.createdOn.toISOString()).to.eql(createdOn.toISOString());
    expect(model.user.id).to.eql('userIdValue');
  });

  it('null entity from null model', () => {
    const entity = sessionModelAssembler.toEntity(null);
    expect(entity).to.be.null;
  });

  it('assemble entity from model - all properties', () => {
    const createdOn = new Date();
    const entity = sessionModelAssembler.toEntity({
      id: 'idValue',
      createdOn,
      user: { id: 'userIdValue' }
    });
    expect(entity).to.eql({
      id: { S: 'idValue' },
      createdOn: { S: createdOn.toISOString() },
      userId: { S: 'userIdValue' }
    });
  });

});
