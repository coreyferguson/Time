
const controller = require('./authController');
const corsFilter = require('../core/corsFilter');

class AuthLambda {

  constructor(options) {
    options = options || {};
    this._controller = options.controller || controller;
    this.verifyIdToken = this.verifyIdToken.bind(this);
  }

  verifyIdToken(event, context, callback) {
    console.log(JSON.stringify(event));
    const headers = corsFilter.getCorsHeaders(event);
    return this._controller.verifyIdToken(event).then(response => {
      if (response.body) response.body = JSON.stringify(response.body);
      response.headers = Object.assign(response.headers, headers);
      callback(null, response);
    }).catch(error => {
      if (error) console.info('error:', JSON.stringify(error));
      if (error && error.stack)
        console.info('error stack:', JSON.stringify(error.stack));
      callback(null, {
        statusCode: 500,
        headers
      });
    });
  }

}

module.exports = new AuthLambda();
module.exports.AuthLambda = AuthLambda;
