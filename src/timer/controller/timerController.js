
const userTimerService = require('../service/userTimerService');

class TimerController {

  constructor(options) {
    options = options || {};
    this._userTimerService = options.userTimerService || userTimerService;
    this.getMyTimers = this.getMyTimers.bind(this);
  }

  getMyTimers(data) {
    return this._userTimerService.findByUserId(data.auth.accessToken.sub).then(userTimers => {
      data.response.statusCode = 200;
      data.response.body = { userTimers };
    });
  }

}

module.exports = new TimerController();
module.exports.TimerController = TimerController;
