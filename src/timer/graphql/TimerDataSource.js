
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

  async findOne(userId, timerId) {
    return await this._userTimerService.findOne(userId, timerId);
  }

  async findLogs(options) {
    return await this._userTimerService.findLogs(options);
  }

}

module.exports = TimerDataSource;
