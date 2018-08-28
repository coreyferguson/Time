
const userTimerRepository = require('../dao/userTimerRepository');
const userTimerAssembler = require('./userTimerAssembler');

class UserTimerService {

  constructor(options) {
    options = options || {};
    this._userTimerRepository = options.userTimerRepository || userTimerRepository;
    this._userTimerAssembler = options.userTimerAssembler || userTimerAssembler;
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
    console.info('UserTimerService.save(userId, timerId):', model.id, model.timerId);
    const entity = this._userTimerAssembler.toEntity(model);
    return this._userTimerRepository.save(entity);
  }

  delete(userId, timerId) {
    console.info('UserTimerService.delete(userId, timerId): ', userId, timerId);
    return this._userTimerRepository.delete(userId, timerId);
  }

}

// export singleton
const singleton = new UserTimerService();
singleton.UserTimerService = UserTimerService;
module.exports = singleton;
