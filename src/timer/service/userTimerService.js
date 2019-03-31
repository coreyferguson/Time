
const userTimerRepository = require('../dao/userTimerRepository');
const userTimerAssembler = require('./userTimerAssembler');
const userTimerLogRepository = require('../dao/userTimerLogRepository');
const userTimerLogAssembler = require('./userTimerLogAssembler');
const pageAssembler = require('../../pagination/pageAssembler');
const logger = require('../../logger');

class UserTimerService {

  constructor(options) {
    options = options || {};
    this._userTimerRepository = options.userTimerRepository || userTimerRepository;
    this._userTimerAssembler = options.userTimerAssembler || userTimerAssembler;
    this._userTimerLogRepository = options.userTimerLogRepository || userTimerLogRepository;
    this._userTimerLogAssembler = options.userTimerLogAssembler || userTimerLogAssembler;
    this._pageAssembler = options.pageAssembler || pageAssembler;
    this._logger = options.logger || logger;
  }

  findOne(userId, timerId) {
    this._logger.info('UserTimerService.findOne', { userId, timerId });
    return this._userTimerRepository.findOne(userId, timerId).then(entity => {
      return this._userTimerAssembler.toModel(entity);
    });
  }

  findByUserId(userId) {
    this._logger.info('UserTimerService.findByUserId', { userId });
    return this._userTimerRepository.findByUserId(userId).then(results => {
      return results.Items.map(entity => {
        return this._userTimerAssembler.toModel({ Item: entity })
      });
    });
  }

  save(model) {
    const { userId, timerId } = model;
    this._logger.info('UserTimerService.save', { userId, timerId });
    const entity = this._userTimerAssembler.toEntity(model);
    return this._userTimerRepository.save(entity);
  }

  delete(userId, timerId) {
    this._logger.info('UserTimerService.delete', { userId, timerId });
    return this._userTimerRepository.delete(userId, timerId);
  }

  saveLog(model) {
    this._logger.info('UserTimerService.saveLog', model)
    const entity = this._userTimerLogAssembler.toEntity(model);
    return this._userTimerLogRepository.save(entity);
  }

  startLog(userId, timerId) {
    this._logger.info('UserTimerService.startLog', { userId, timerId });
    const entity = this._userTimerLogAssembler.toEntity({
      userId,
      timerId,
      time: new Date(),
      action: 'start'
    });
    return this._userTimerLogRepository.save(entity);
  }

  stopLog(userId, timerId) {
    this._logger.info('UserTimerService.stopLog', { userId, timerId });
    const entity = this._userTimerLogAssembler.toEntity({
      userId,
      timerId,
      time: new Date(),
      action: 'stop'
    });
    return this._userTimerLogRepository.save(entity);
  }

  deleteLog(userId, timerId, time) {
    this._logger.info('UserTimerService.deleteLog', { userId, timerId, time });
    return this._userTimerLogRepository.delete(userId, timerId, time.toISOString());
  }

  /**
   * Fetch a page of timer logs. When fetching subsequent pages of logs, *only*
   * the cursor needs to be provided.
   *
   * @param {string} userId
   * @param {string} timerId
   * @param {integer} pageSize
   * @param {string} [cursor] Cursor from previous response.
   */
  async findLogs(options) {
    this._logger.info('UserTimerService.findLogs');
    if (options && !options.cursor) return this._findLogsFirstPage(options);
    else return this._findLogsSubsequentPages(options.cursor);
  }

  async _findLogsFirstPage(options) {
    const { userId, timerId, pageSize } = options;
    this._logger.info('UserTimerService._findLogsFirstPage', { userId, timerId, pageSize });
    const queryOptions = { userId, timerId, pageSize };
    const page = await this._userTimerLogRepository.findByUserTimer(queryOptions)
    const res = this._pageAssembler.toCursor(page, queryOptions);
    res.data = page.Items.map(entity => {
      return this._userTimerLogAssembler.toModel({ Item: entity })
    });
    return res;
  }

  async _findLogsSubsequentPages(cursor) {
    this._logger.info('UserTimerService._findLogsSubsequentPages', { cursor });
    const queryOptions = this._pageAssembler.fromCursor(cursor);
    this._logger.info('UserTimerService._findLogsSubsequentPages', { queryOptions });
    const page = await this._userTimerLogRepository.findByUserTimer(queryOptions);
    const res = this._pageAssembler.toCursor(page, queryOptions);
    res.data = page.Items.map(entity => {
      return this._userTimerLogAssembler.toModel({ Item: entity })
    });
    return res;
  }

}

// export singleton
const singleton = new UserTimerService();
singleton.UserTimerService = UserTimerService;
module.exports = singleton;
