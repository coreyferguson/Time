
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class AuthorizationCodeRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._authorizationCodeTableName = options.authorizationCodeTableName || process.env.authorizationCodeTableName;
  }

  findOne(authorizationCode) {
    console.info(`AuthorizationCodeRepository.findOne(authorizationCode): ${authorizationCode}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._authorizationCodeTableName,
        Key: {
          authorizationCode: {
            S: authorizationCode
          }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }).then(authorizationCode => {
      return (Object.keys(authorizationCode).length === 0) ? null : authorizationCode;
    });
  }

  save(authorizationCode) {
    console.info(`AuthorizationCodeRepository.save(authorizationCode): ${authorizationCode.authorizationCode}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._authorizationCodeTableName,
        Item: authorizationCode,
        ReturnConsumedCapacity: 'TOTAL'
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  delete(authorizationCode) {
    console.info(`AuthorizationCodeRepository.delete(authorizationCode): ${authorizationCode}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._authorizationCodeTableName,
        Key: {
          authorizationCode: {
            S: authorizationCode
          }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

}

module.exports = new AuthorizationCodeRepository();
module.exports.AuthorizationCodeRepository = AuthorizationCodeRepository;
