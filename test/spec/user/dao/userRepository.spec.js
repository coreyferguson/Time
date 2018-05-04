
const { expect, sinon } = require('../../../support/TestUtils');
const UserRepository = require('../../../../src/user/dao/userRepository.js').UserRepository;
const DynamodbFacade = require('local-dynamo-facade');
const LocalDynamoFacade = require('local-dynamo-facade');
const path = require('path');

describe('userRepository integration tests', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../../../serverless.yml')
  );
  let dynamodb;
  let userRepository;
  const sandbox = sinon.sandbox.create();

  before(function() {
    this.timeout(5000);
    dynamodb = facade.start();
    userRepository = new UserRepository({
      dynamodb,
      usersTableName: 'users-test'
    });
    sandbox.stub(console, 'info');
    return facade.createTable('usersTable', 'users-test');
  });

  after(() => {
    sandbox.restore();
    facade.stop();
  });

  it('findOne - user does not exist', () => {
    return expect(userRepository.findOne('1234')).to.eventually.be.null;
  });

  it('save - new user', () => {
    const user = {
      id: { S: '1234' }
    };
    return userRepository.save(user).then(() => {
      return expect(userRepository.findOne('1234'))
        .to.eventually.eql({ Item: user });
    });
  });

  it('save - existing user', () => {
    const nextTweetsheetBatch = new Date().toISOString();

    const oldUser = {
      id: { S: '1234' },
      nextTweetsheetBatch: { S: nextTweetsheetBatch }
    };
    const updatedUser = {
      id: { S: '1234' },
      nextTweetsheetBatch: { S: nextTweetsheetBatch }
    };
    return userRepository.save(oldUser).then(() => {
      return userRepository.save(updatedUser);
    }).then(() => {
      return expect(userRepository.findOne('1234'))
        .to.eventually.eql({ Item: updatedUser });
    });
  });

});
