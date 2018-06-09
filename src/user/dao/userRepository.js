
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class UserRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._userTableName = options.userTableName || process.env.userTableName;
  }

  findOne(id) {
    console.info(`UserRepository.findOne(userId): ${id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._userTableName,
        Key: {
          id: {
            S: id
          }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }).then(user => {
      return (Object.keys(user).length === 0) ? null : user;
    });
  }

  findByExternalIds(externalAuthMethod, externalAuthId) {
    console.info(`UserRepository.findByExternalIds(externalAuthMethod, externalAuthId): ${externalAuthMethod}, ${externalAuthId}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.query({
        TableName: this._userTableName,
        IndexName: 'ExternalAuthIndex',
        KeyConditionExpression: 'externalAuthMethod = :v_externalAuthMethod AND externalAuthId = :v_externalAuthId',
        ExpressionAttributeValues: {
          ':v_externalAuthMethod': { 'S': externalAuthMethod },
          ':v_externalAuthId': { 'S': externalAuthId }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  save(user) {
    console.info(`UserRepository.save(user): ${user.id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._userTableName,
        Item: user,
        ReturnConsumedCapacity: 'TOTAL'
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  delete(id) {
    console.info(`UserRepository.delete(userId): ${id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._userTableName,
        Key: {
          id: {
            S: id
          }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

}

module.exports = new UserRepository();
module.exports.UserRepository = UserRepository;
