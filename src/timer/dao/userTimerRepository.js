
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });
const logger = require('../../logger');

class UserTimerRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._userTimerTableName = options.userTimerTableName || process.env.userTimerTableName;
    this._logger = options.logger || logger;
  }

  findOne(userId, timerId) {
    const timer = this._logger.startTimer('UserTimerRepository.findOne');
    this._logger.info('UserTimerRepository.findOne', { userId, timerId });
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._userTimerTableName,
        Key: {
          userId: { S: userId },
          timerId: { S: timerId }
        }
      }, (err, data) => {
        if (err) {
          timer.stop(false);
          reject(err);
        } else {
          timer.stop(true);
          resolve(data);
        }
      });
    }).then(userTimer => {
      return (Object.keys(userTimer).length === 0) ? null : userTimer;
    });
  }

  findByUserId(userId) {
    const timer = this._logger.startTimer('UserTimerRepository.findByUserId');
    this._logger.info('UserTimerRepository.findByUserId', { userId });
    return new Promise((resolve, reject) => {
      this._dynamodb.query({
        TableName: this._userTimerTableName,
        KeyConditionExpression: 'userId = :id',
        ExpressionAttributeValues: {
          ':id': { S: userId }
        }
      }, (err, data) => {
        if (err) {
          timer.stop(false);
          reject(err);
        } else {
          timer.stop(true);
          resolve(data);
        }
      });
    });
  }

  save(userTimer) {
    const timer = this._logger.startTimer('UserTimerRepository.save');
    const userId = userTimer.userId.S;
    const timerId = userTimer.timerId.S;
    this._logger.info('UserTimerRepository.save', { userId, timerId });
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._userTimerTableName,
        Item: userTimer,
        ReturnConsumedCapacity: 'TOTAL'
      }, (err, data) => {
        if (err) {
          timer.stop(false);
          reject(err);
        } else {
          timer.stop(true);
          resolve(data);
        }
      });
    });
  }

  delete(userId, timerId) {
    const timer = this._logger.startTimer('UserTimerRepository.delete');
    this._logger.info('UserTimerRepository.delete', { userId, timerId });
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._userTimerTableName,
        Key: {
          userId: { S: userId },
          timerId: { S: timerId }
        }
      }, (err, data) => {
        if (err) {
          timer.stop(false);
          reject(err);
        } else {
          timer.stop(true);
          resolve(data);
        }
      });
    });
  }

}

// export singleton
const singleton = new UserTimerRepository();
singleton.UserTimerRepository = UserTimerRepository;
module.exports = singleton;
