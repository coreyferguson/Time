
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const logger = require('../../logger');

class UserTimerLogRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._userTimerLogTableName = options.userTimerLogTableName || process.env.userTimerLogTableName;
    this._logger = options.logger || logger;
  }

  findByUserTimer(options) {
    options = options || {};
    let { userId, timerId, pageSize, after } = options;
    pageSize = pageSize || 100;
    const timer = this._logger.startTimer('UserTimerLogRepository.findByUserTimer');
    this._logger.info('UserTimerLogRepository.findByUserTimer', { userId, timerId });
    return new Promise((resolve, reject) => {
      this._dynamodb.query({
        TableName: this._userTimerLogTableName,
        KeyConditionExpression: 'userTimerId = :userTimerId',
        ExpressionAttributeValues: {
          ':userTimerId': { S: `${userId};${timerId}` }
        },
        Limit: pageSize,
        ExclusiveStartKey: after
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

  save(userTimerLog) {
    const userTimerId = userTimerLog.userTimerId.S;
    const time = userTimerLog.time.S;
    const timer = this._logger.startTimer('UserTimerLogRepository.save');
    this._logger.info('UserTimerLogRepository.save', { userTimerId, time });
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._userTimerLogTableName,
        Item: userTimerLog,
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

  delete(userId, timerId, time) {
    const timer = this._logger.startTimer('UserTimerLogRepository.delete');
    this._logger.info('UserTimerLogRepository.delete', { userId, timerId, time });
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._userTimerLogTableName,
        Key: {
          userTimerId: { S: `${userId};${timerId}` },
          time: { S: time }
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
const singleton = new UserTimerLogRepository();
singleton.UserTimerLogRepository = UserTimerLogRepository;
module.exports = singleton;
