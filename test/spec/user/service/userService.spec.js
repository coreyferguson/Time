
const userService = require('../../../../src/user/service/userService');
const userRepository = require('../../../../src/user/dao/userRepository');
const { expect, sinon } = require('../../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const path = require('path');

describe('userService integration test', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../../../serverless.yml')
  );
  let dynamodb, userTableName;
  let sandbox = sinon.sandbox.create();

  before(function() {
    this.timeout(5000);
    dynamodb = userRepository._dynamodb;
    userTableName = userRepository._userTableName;
    let newDynamoDb = facade.start();
    userRepository._dynamodb = newDynamoDb;
    userRepository._userTableName = 'user-test';
    return facade.createTable('userTable', 'user-test');
  });

  after(() => {
    userRepository._dynamodb = dynamodb;
    userRepository._userTableName = userTableName;
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
      externalAuthId: 'externalAuthIdValue',
      externalAuthMethod: 'externalAuthMethodValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue',
      createdOn: new Date()
    }).then(() => {
      return userService.findOne('1234').then(user => {
        expect(user.id).to.eql('1234');
        expect(user.externalAuthId).to.eql('externalAuthIdValue');
        expect(user.externalAuthMethod).to.eql('externalAuthMethodValue');
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
      externalAuthId: 'oldExternalAuthIdValue',
      externalAuthMethod: 'oldExternalAuthMethodValue',
      displayName: 'oldDisplayNameValue',
      profilePicture: 'oldProfilePictureValue',
      createdOn
    }).then(() => {
      return userService.save({
        id: '1234',
        externalAuthId: 'newExternalAuthIdValue',
        externalAuthMethod: 'newExternalAuthMethodValue',
        displayName: 'newDisplayNameValue',
        profilePicture: 'newProfilePictureValue'
      });
    }).then(() => {
      return userService.findOne('1234').then(user => {
        expect(user.id).to.eql('1234');
        expect(user.externalAuthId).to.eql('newExternalAuthIdValue');
        expect(user.externalAuthMethod).to.eql('newExternalAuthMethodValue');
        expect(user.displayName).to.eql('newDisplayNameValue');
        expect(user.profilePicture).to.eql('newProfilePictureValue');
        expect(user.createdOn.toISOString()).to.eql(createdOn.toISOString());
      });
    });
  });

  it('findByExternalIds', () => {
    const createdOn = new Date();
    return userService.save({
      id: '1234',
      externalAuthMethod: 'externalAuthMethodValue',
      externalAuthId: 'externalAuthIdValue',
      displayName: 'displayNameValue',
      profilePicture: 'profilePictureValue',
      createdOn
    }).then(() => {
      return userService.findByExternalIds(
        'externalAuthMethodValue', 'externalAuthIdValue');
    }).then(user => {
      expect(user.id).to.eql('1234');
      expect(user.externalAuthMethod).to.eql('externalAuthMethodValue');
      expect(user.externalAuthId).to.eql('externalAuthIdValue');
      expect(user.displayName).to.eql('displayNameValue');
      expect(user.profilePicture).to.eql('profilePictureValue');
    }).then(() => {
      // incomplete data returns nothing
      return expect(Promise.all([
        userService.findByExternalIds('externalAuthMethodValue', 'nothing'),
        userService.findByExternalIds('nothing', 'externalAuthIdValue'),
      ])).to.eventually.eql([null, null]);
    });
  });

});
