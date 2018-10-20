
const userTimerRepository = require('../dao/userTimerRepository');
const userTimerAssembler = require('./userTimerAssembler');
const userTimerLogRepository = require('../dao/userTimerLogRepository');
const userTimerLogAssembler = require('./userTimerLogAssembler');

class UserTimerService {

  constructor(options) {
    options = options || {};
    this._userTimerRepository = options.userTimerRepository || userTimerRepository;
    this._userTimerAssembler = options.userTimerAssembler || userTimerAssembler;
    this._userTimerLogRepository = options.userTimerLogRepository || userTimerLogRepository;
    this._userTimerLogAssembler = options.userTimerLogAssembler || userTimerLogAssembler;
  }

  findOne(userId, timerId) {
    console.info('UserTimerService.findOne(userId, timerId): ', userId, timerId);
    return this._userTimerRepository.findOne(userId, timerId).then(entity => {
      return this._userTimerAssembler.toModel(entity);
    });
  }

  findByUserId(userId) {
    console.info('UserTimerService.findByUserId(userId): ', userId);
    return this._userTimerRepository.findByUserId(userId).then(results => {
      return results.Items.map(entity => {
        return this._userTimerAssembler.toModel({ Item: entity })
      });
    });
  }

  save(model) {
    console.info('UserTimerService.save(userId, timerId):', model.userId, model.timerId);
    const entity = this._userTimerAssembler.toEntity(model);
    return this._userTimerRepository.save(entity);
  }

  delete(userId, timerId) {
    console.info('UserTimerService.delete(userId, timerId): ', userId, timerId);
    return this._userTimerRepository.delete(userId, timerId);
  }

  saveLog(model) {
    console.info('UserTimerService.saveLog(model):', JSON.stringify(model));
    const entity = this._userTimerLogAssembler.toEntity(model);
    return this._userTimerLogRepository.save(entity);
  }

  startLog(userId, timerId) {
    console.info('UserTimerService.startLog(userId, timerId): ', userId, timerId);
    const entity = this._userTimerLogAssembler.toEntity({
      userId,
      timerId,
      time: new Date(),
      action: 'start'
    });
    return this._userTimerLogRepository.save(entity);
  }

  stopLog(userId, timerId) {
    console.info('UserTimerService.stopLog(userId, timerId): ', userId, timerId);
    const entity = this._userTimerLogAssembler.toEntity({
      userId,
      timerId,
      time: new Date(),
      action: 'stop'
    });
    return this._userTimerLogRepository.save(entity);
  }

  deleteLog(userId, timerId, time) {
    console.info('UserTimerService.deleteLog(userId, timerId, time): ', userId, timerId, time);
    return this._userTimerLogRepository.delete(userId, timerId, time.toISOString());
  }

  findLogs(userId, timerId) {
    console.info('UserTimerService.findLogs(userId, timerId): ', userId, timerId);
    return this._userTimerLogRepository.findByUserTimer(userId, timerId).then(result => {
      return result.Items.map(entity => {
        return this._userTimerLogAssembler.toModel({ Item: entity });
      });
    });
  }

}

// export singleton
const singleton = new UserTimerService();
singleton.UserTimerService = UserTimerService;
module.exports = singleton;
