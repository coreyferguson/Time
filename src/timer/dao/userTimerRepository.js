
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class UserTimerRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._userTimerTableName = options.userTimerTableName || process.env.userTimerTableName;
  }

  findOne(userId, timerId) {
    console.info('UserTimerRepository.findOne(userId, timerId)', userId, timerId);
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._userTimerTableName,
        Key: {
          userId: { S: userId },
          timerId: { S: timerId }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }).then(userTimer => {
      return (Object.keys(userTimer).length === 0) ? null : userTimer;
    });
  }

  findByUserId(userId) {
    console.info('UserTimerRepository.findByUserId(userId)', userId);
    return new Promise((resolve, reject) => {
      this._dynamodb.query({
        TableName: this._userTimerTableName,
        KeyConditionExpression: 'userId = :id',
        ExpressionAttributeValues: {
          ':id': { S: userId }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  save(userTimer) {
    console.info('UserTimerRepository.save(userId, timerId)', userTimer.userId.S, userTimer.timerId.S);
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._userTimerTableName,
        Item: userTimer,
        ReturnConsumedCapacity: 'TOTAL'
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  delete(userId, timerId) {
    console.info('UserTimerRepository.delete(userId, timerId)', userId, timerId);
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._userTimerTableName,
        Key: {
          userId: { S: userId },
          timerId: { S: timerId }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

}

// export singleton
const singleton = new UserTimerRepository();
singleton.UserTimerRepository = UserTimerRepository;
module.exports = singleton;
