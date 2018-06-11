
const filterChain = require('../../core/filterChain');
const controller = require('./sessionController');
const secretsClient = require('serverless-secrets/client');
const firebase = require('firebase-admin');

secretsClient.init(require('../../../.serverless-secrets.json'));

class SessionLambda {

  constructor(options) {
    options = options || {};
    this._filterChain = options.filterChain || filterChain;
    this._controller = options.controller || controller;
    this._firebase = options.firebase || firebase;
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
    return this.configureFirebase().then(() => {
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
    return this.configureFirebase().then(() => {
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

  configureFirebase() {
    if (this._secretsPromise) return this._secretsPromise;
    this._secretsPromise = this._secretsClient.load();
    return this._secretsPromise.then(() => {
      const projectId = process.env['firebaseAdminProjectId'];
      const clientEmail = process.env['firebaseAdminClientEmail'];
      const privateKey = process.env['firebaseAdminPrivateKey'];
      console.log('credentials:', { projectId, clientEmail, privateKey });
      this._firebase.initializeApp({
        credential: firebase.credential.cert(
          { projectId, clientEmail, privateKey }
        )
      });
    });
  }

}

module.exports = new SessionLambda();
module.exports.SessionLambda = SessionLambda;
