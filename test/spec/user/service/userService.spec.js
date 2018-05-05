
const userService = require('../../../../src/user/service/userService');
const userRepository = require('../../../../src/user/dao/userRepository');
const { expect, sinon } = require('../../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const path = require('path');

describe('userService integration test', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../../../serverless.yml')
  );
  let dynamodb, usersTableName;
  let sandbox = sinon.sandbox.create();

  before(function() {
    this.timeout(5000);
    dynamodb = userRepository._dynamodb;
    usersTableName = userRepository._usersTableName;
    let newDynamoDb = facade.start();
    userRepository._dynamodb = newDynamoDb;
    userRepository._usersTableName = 'users-test';
    return facade.createTable('usersTable', 'users-test');
  });

  after(() => {
    userRepository._dynamodb = dynamodb;
    userRepository._usersTableName = usersTableName;
    facade.stop();
  });

  beforeEach(() => {
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('findOne, no existing user', () => {
    return expect(userService.findOne('1234')).to.eventually.be.null;
  });

  it('save new user & find & delete', () => {
    const createdDate = new Date();
    return userService.save({
      id: '1234',
      authMethod: 'authMethodValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue',
      createdOn: new Date()
    }).then(() => {
      return userService.findOne('1234').then(user => {
        expect(user.id).to.eql('1234');
        expect(user.authMethod).to.eql('authMethodValue');
        expect(user.displayName).to.eql('displayNameValue');
        expect(user.profilePicture).to.eql('profilePictureValue');
        expect(user.createdOn.toISOString()).to.eql(createdDate.toISOString());
      });
    }).then(() => {
      return userService.delete('1234');
    }).then(() => {
      return userService.findOne('1234');
    }).then(user => {
      expect(user).to.be.null;
    });
  });

  it('save existing user', () => {
    const createdOn = new Date();
    return userService.save({
      id: '1234',
      authMethod: 'oldAuthMethodValue',
      displayName: 'oldDisplayNameValue',
      profilePicture: 'oldProfilePictureValue',
      createdOn
    }).then(() => {
      return userService.save({
        id: '1234',
        authMethod: 'newAuthMethodValue',
        displayName: 'newDisplayNameValue',
        profilePicture: 'newProfilePictureValue'
      });
    }).then(() => {
      return userService.findOne('1234').then(user => {
        expect(user.id).to.eql('1234');
        expect(user.authMethod).to.eql('newAuthMethodValue');
        expect(user.displayName).to.eql('newDisplayNameValue');
        expect(user.profilePicture).to.eql('newProfilePictureValue');
        expect(user.createdOn.toISOString()).to.eql(createdOn.toISOString());
      });
    });
  });

});
