
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class UserRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._usersTableName = options.usersTableName || process.env.usersTableName;
  }

  findOne(id) {
    console.info(`UserRepository.findOne(userId): ${id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._usersTableName,
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

  save(user) {
    console.info(`UserRepository.save(user): ${user.id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._usersTableName,
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
        TableName: this._usersTableName,
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
