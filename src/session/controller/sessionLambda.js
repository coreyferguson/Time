
const filterChain = require('../../core/filterChain');
const controller = require('./sessionController');

class SessionLambda {

  constructor(options) {
    options = options || {};
    this._filterChain = options.filterChain || filterChain;
    this._controller = options.controller || controller;
    this.getSession = this.getSession.bind(this);
  }

  getSession(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return this._filterChain.wrapInChain(data, this._controller.getSession).then(() => {
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

}

module.exports = new SessionLambda();
module.exports.SessionLambda = SessionLambda;
