
const userRepository = require('../dao/userRepository');
const userModelAssembler = require('./userModelAssembler');

class UserService {

  constructor(options) {
    options = options || {};
    this._userRepository = options.userRepository || userRepository;
    this._userModelAssembler = options.userModelAssembler || userModelAssembler;
  }

  findOne(id) {
    console.info(`UserService.findOne(id): ${id}`);
    return this._userRepository.findOne(id).then(entity => {
      return this._userModelAssembler.toModel(entity);
    });
  }

  save(model) {
    console.info('UserService.save(model.id):', model.id);
    return this._userRepository.findOne(model.id).then(existingEntity => {
      const entity = this._userModelAssembler.toEntity(model, existingEntity);
      return this._userRepository.save(entity);
    });
  }

  delete(id) {
    console.info(`UserService.delete(id): ${id}`);
    return this._userRepository.delete(id);
  }

  findByExternalIds(externalAuthMethod, externalAuthId) {
    console.info(`UserService.findByExternalIds(externalAuthMethod, externalAuthId): ${externalAuthMethod}, ${externalAuthId}`);
    return this._userRepository.findByExternalIds(externalAuthMethod, externalAuthId).then(entity => {
      entity = (entity.Items.length > 0)
        ? { Item: entity.Items[0] }
        : null;
      return this._userModelAssembler.toModel(entity);
    });
  }

}

module.exports = new UserService();
module.exports.UserService = UserService;
