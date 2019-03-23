
const { DataSource } = require('apollo-datasource');
const userTimerService = require('../service/userTimerService');

class TimerDataSource extends DataSource {

  constructor(options) {
    super();
    options = options || {};
    this._userTimerService = options.userTimerService || userTimerService;
  }

  async findByUserId(userId) {
    return await this._userTimerService.findByUserId(userId);
  }

  async findLogs(userId, timerId) {
    return await this._userTimerService.findLogs(userId, timerId);
  }

}

module.exports = TimerDataSource;
