
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class AccessTokenRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._accessTokenTableName = options.accessTokenTableName || process.env.accessTokenTableName;
  }

  findOne(accessToken) {
    console.info(`AccessTokenRepository.findOne(accessToken): ${accessToken}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._accessTokenTableName,
        Key: {
          accessToken: {
            S: accessToken
          }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }).then(accessToken => {
      return (Object.keys(accessToken).length === 0) ? null : accessToken;
    });
  }

  save(accessToken) {
    console.info(`AccessTokenRepository.save(accessToken): ${accessToken.accessToken}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._accessTokenTableName,
        Item: accessToken,
        ReturnConsumedCapacity: 'TOTAL'
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  delete(accessToken) {
    console.info(`AccessTokenRepository.delete(userId): ${accessToken}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._accessTokenTableName,
        Key: {
          accessToken: {
            S: accessToken
          }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

}

module.exports = new AccessTokenRepository();
module.exports.AccessTokenRepository = AccessTokenRepository;
