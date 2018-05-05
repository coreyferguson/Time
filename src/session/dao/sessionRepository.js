
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class SessionRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._sessionTableName = options.sessionTableName || process.env.sessionTableName;
  }

  findOne(id) {
    console.info(`SessionRepository.findOne(id): ${id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._sessionTableName,
        Key: {
          id: { S: id }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }).then(session => {
      return (Object.keys(session).length === 0) ? null : session;
    });
  }

  save(session) {
    console.info(`SessionRepository.save(session): ${session.session}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._sessionTableName,
        Item: session,
        ReturnConsumedCapacity: 'TOTAL'
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  delete(id) {
    console.info(`SessionRepository.delete(id): ${id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._sessionTableName,
        Key: {
          id: { S: id }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

}

module.exports = new SessionRepository();
module.exports.SessionRepository = SessionRepository;
