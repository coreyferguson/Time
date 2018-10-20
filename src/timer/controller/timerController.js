
const userTimerService = require('../service/userTimerService');

class TimerController {

  constructor(options) {
    options = options || {};
    this._userTimerService = options.userTimerService || userTimerService;
    this.getMyTimers = this.getMyTimers.bind(this);
    this.getMyTimerLogs = this.getMyTimerLogs.bind(this);
    this.saveTimer = this.saveTimer.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.stopTimer = this.stopTimer.bind(this);
    this.deleteLog = this.deleteLog.bind(this);
    this.saveLog = this.saveLog.bind(this);
  }

  getMyTimers(data) {
    return this._userTimerService.findByUserId(data.auth.accessToken.sub).then(userTimers => {
      data.response.statusCode = 200;
      data.response.body = { userTimers };
    });
  }

  getMyTimerLogs(data) {
    const userId = data.auth.accessToken.sub;
    const timerId = data.request.event.pathParameters.timerId;
    return this._userTimerService.findLogs(userId, timerId).then(userTimerLogs => {
      data.response.body = { userTimerLogs };
      data.response.statusCode = 200;
    });
  }

  saveTimer(data) {
    const userId = data.auth.accessToken.sub;
    const body = JSON.parse(data.request.event.body);
    const timerId = body.timerId;
    return this._userTimerService.save({
      userId, timerId, name: body.name
    }).then(() => {
      data.response.statusCode = 200;
    });
  }

  startTimer(data) {
    const userId = data.auth.accessToken.sub;
    const timerId = data.request.event.pathParameters.timerId;
    return this._userTimerService.startLog(userId, timerId).then(() => {
      data.response.statusCode = 200;
    });
  }

  stopTimer(data) {
    const userId = data.auth.accessToken.sub;
    const timerId = data.request.event.pathParameters.timerId;
    return this._userTimerService.stopLog(userId, timerId).then(() => {
      data.response.statusCode = 200;
    });
  }

  deleteLog(data) {
    const userId = data.auth.accessToken.sub;
    const timerId = data.request.event.pathParameters.timerId;
    const body = JSON.parse(data.request.event.body);
    const time = new Date(body.time);
    return this._userTimerService.deleteLog(userId, timerId, time);
  }

  saveLog(data) {
    const userId = data.auth.accessToken.sub;
    const timerId = data.request.event.pathParameters.timerId;
    const body = JSON.parse(data.request.event.body);
    const time = new Date(body.time);
    const action = body.action;
    const model = { userId, timerId, time, action };
    return this._userTimerService.saveLog(model);
  }

}

module.exports = new TimerController();
module.exports.TimerController = TimerController;
