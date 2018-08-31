
const userTimerService = require('../service/userTimerService');

class TimerController {

  constructor(options) {
    options = options || {};
    this._userTimerService = options.userTimerService || userTimerService;
    this.getMyTimers = this.getMyTimers.bind(this);
    this.getMyTimerLogs = this.getMyTimerLogs.bind(this);
    this.saveTimer = this.saveTimer.bind(this);
  }

  getMyTimers(data) {
    return this._userTimerService.findByUserId(data.auth.accessToken.sub).then(userTimers => {
      data.response.statusCode = 200;
      data.response.body = { userTimers };
    });
  }

  getMyTimerLogs(data) {
    console.log(JSON.stringify(data));
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

}

module.exports = new TimerController();
module.exports.TimerController = TimerController;
