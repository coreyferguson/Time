
const filterChain = require('../../core/filterChain');
const controller = require('./timerController');

class TimerLambda {

  constructor(options) {
    options = options || {};
    this._controller = options.controller || controller;
    this.getMyTimers = this.getMyTimers.bind(this);
    this.getMyTimerLogs = this.getMyTimerLogs.bind(this);
    this.saveTimer = this.saveTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.deleteLog = this.deleteLog.bind(this);
    this.saveLog = this.saveLog.bind(this);
  }

  getMyTimers(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return filterChain.wrapInChain(data, this._controller.getMyTimers).then(() => {
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

  getMyTimerLogs(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return filterChain.wrapInChain(data, this._controller.getMyTimerLogs).then(() => {
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

  saveTimer(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return filterChain.wrapInChain(data, this._controller.saveTimer).then(() => {
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

  startTimer(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return filterChain.wrapInChain(data, this._controller.startTimer).then(() => {
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

  stopTimer(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return filterChain.wrapInChain(data, this._controller.stopTimer).then(() => {
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

  deleteLog(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return filterChain.wrapInChain(data, this._controller.deleteLog).then(() => {
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

  saveLog(event, context, callback) {
    const data = {
      request: { event, context },
      response: {}
    };
    return filterChain.wrapInChain(data, this._controller.saveLog).then(() => {
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

module.exports = new TimerLambda();
module.exports.TimerLambda = TimerLambda;
