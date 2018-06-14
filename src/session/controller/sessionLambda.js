
const filterChain = require('../../core/filterChain');
const controller = require('./sessionController');
const secretsClient = require('serverless-secrets/client');

secretsClient.init(require('../../../.serverless-secrets.json'));

class SessionLambda {

  constructor(options) {
    options = options || {};
    this._filterChain = options.filterChain || filterChain;
    this._controller = options.controller || controller;
    this._secretsClient = options.secretsClient || secretsClient;
    this._secretsPromise = null;
    this.getSession = this.getSession.bind(this);
    this.verifyIdToken = this.verifyIdToken.bind(this);
    this.preflight = this.preflight.bind(this);
  }

  getSession(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return this._configureSecrets().then(() => {
      return this._filterChain.wrapInChain(data, this._controller.getSession);
    }).then(() => {
      if (data.response.body)
        data.response.body = JSON.stringify(data.response.body);
      callback(null, data.response);
    }).catch(error => {
      if (error) console.info('error:', JSON.stringify(error));
      if (error && error.stack)
        console.info('error stack:', JSON.stringify(error.stack));
      const data = error.data;
      if (data.response.body)
        data.response.body = JSON.stringify(data.response.body);
      callback(error, error.data.response);
    });
  }

  verifyIdToken(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    if (event && event.body) event.body = JSON.parse(event.body);
    return this._configureSecrets().then(() => {
      return this._filterChain.wrapInChain(data, this._controller.verifyIdToken);
    }).then(() => {
      if (data.response.body)
        data.response.body = JSON.stringify(data.response.body);
      callback(null, data.response);
    }).catch(error => {
      if (error) console.info('error:', JSON.stringify(error));
      if (error && error.stack)
        console.info('error stack:', JSON.stringify(error.stack));
      const data = error.data;
      if (data.response.body)
        data.response.body = JSON.stringify(data.response.body);
      callback(error, error.data.response);
    });
  }

  preflight(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return this._filterChain.wrapInChain(data).then(() => {
      if (data.response.body)
        data.response.body = JSON.stringify(data.response.body);
      callback(null, data.response);
    }).catch(error => {
      if (error) console.info('error:', JSON.stringify(error));
      if (error && error.stack)
        console.info('error stack:', JSON.stringify(error.stack));
      const data = error.data;
      if (data.response.body)
        data.response.body = JSON.stringify(data.response.body);
      callback(error, error.data.response);
    });
  }

  _configureSecrets() {
    if (this._secretsPromise) return this._secretsPromise;
    this._secretsPromise = this._secretsClient.load();
    return this._secretsPromise;
  }

}

module.exports = new SessionLambda();
module.exports.SessionLambda = SessionLambda;
