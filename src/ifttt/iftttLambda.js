
const controller = require('./iftttController');
const secretsClient = require('serverless-secrets/client');

secretsClient.init(require('../../.serverless-secrets.json'));

class StatusLambda {

  constructor(options) {
    options = options || {};
    this._controller = options.controller || controller;
    this._secretsClient = options.secretsClient || secretsClient;
    this.userInfo = this.userInfo.bind(this);
    this.status = this.status.bind(this);
  }

  userInfo(event, context, callback) {
    return this._configureSecrets().then(() => {
      return this._controller.userInfo(event).then(response => {
        if (response.body) response.body = JSON.stringify(response.body);
        callback(null, response);
      });
    }).catch(error => {
      if (error) console.info('error:', JSON.stringify(error));
      if (error && error.stack)
        console.info('error stack:', JSON.stringify(error.stack));
      callback(error, error.response);
    });
  }

  status(event, context, callback) {
    return this._configureSecrets().then(() => {
      return this._controller.status(event).then(response => {
        if (response.body) response.body = JSON.stringify(response.body);
        callback(null, response);
      });
    }).catch(error => {
      if (error) console.info('error:', JSON.stringify(error));
      if (error && error.stack)
        console.info('error stack:', JSON.stringify(error.stack));
      callback(error, error.response);
    });
  }

  _configureSecrets() {
    if (this._secretsPromise) return this._secretsPromise;
    this._secretsPromise = this._secretsClient.load();
    return this._secretsPromise;
  }

}

module.exports = new StatusLambda();
module.exports.StatusLambda = StatusLambda;
