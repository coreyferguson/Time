
const controller = require('./statusController');

class StatusLambda {

  constructor(options) {
    options = options || {};
    this._controller = options.controller || controller;
  }

  status(event, context, callback) {
    return this._controller.status(event).then(response => {
      if (response.body) response.body = JSON.stringify(response.body);
      callback(null, response);
    }).catch(error => {
      if (error) console.info('error:', JSON.stringify(error));
      if (error && error.stack)
        console.info('error stack:', JSON.stringify(error.stack));
      callback(error, error.response);
    });
  }

}

module.exports = new StatusLambda();
module.exports.StatusLambda = StatusLambda;
