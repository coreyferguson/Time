
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class ClientRepository {

  constructor(options) {
    options = options || {};
    this._dynamodb = options.dynamodb || new AWS.DynamoDB();
    this._clientTableName = options.clientTableName || process.env.clientTableName;
  }

  findOne(id) {
    console.info(`ClientRepository.findOne(id): ${id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.getItem({
        TableName: this._clientTableName,
        Key: {
          id: { S: id }
        }
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    }).then(client => {
      return (Object.keys(client).length === 0) ? null : client;
    });
  }

  save(client) {
    console.info(`ClientRepository.save(client.id): ${client.id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.putItem({
        TableName: this._clientTableName,
        Item: client,
        ReturnConsumedCapacity: 'TOTAL'
      }, (err, data) => {
        if (err) reject(err);
        else resolve(data);
      });
    });
  }

  delete(id) {
    console.info(`ClientRepository.delete(userId): ${id}`);
    return new Promise((resolve, reject) => {
      this._dynamodb.deleteItem({
        TableName: this._clientTableName,
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

module.exports = new ClientRepository();
module.exports.ClientRepository = ClientRepository;
