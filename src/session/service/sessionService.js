
const sessionRepository = require('../dao/sessionRepository');
const sessionModelAssembler = require('./sessionModelAssembler');
const userRepository = require('../../user/dao/userRepository');
const userModelAssembler = require('../../user/service/userModelAssembler');

class SessionService {

  constructor(options) {
    options = options || {};
    this._sessionRepository = options.sessionRepository || sessionRepository;
    this._sessionModelAssembler = options.sessionModelAssembler || sessionModelAssembler;
    this._userRepository = options.userRepository || userRepository;
    this._userModelAssembler = options.userModelAssembler || userModelAssembler;
  }

  findOne(id) {
    console.info(`SessionService.findOne(id): ${id}`);
    return this._sessionRepository.findOne(id).then(session => {
      if (!session) return null;
      return Promise.all([
        session,
        this._userRepository.findOne(session.Item.userId.S)
      ]);
    }).then(r => {
      if (!r) return null;
      const session = r[0];
      const user = this._userModelAssembler.toModel(r[1]);
      return this._sessionModelAssembler.toModel(session, user);
    });
  }

  save(model) {
    console.info('SessionService.save(model.id):', model.id);
    const entity = this._sessionModelAssembler.toEntity(model);
    return this._sessionRepository.save(entity);
  }

  delete(id) {
    console.info(`SessionService.delete(id): ${id}`);
    return this._sessionRepository.delete(id);
  }

}

module.exports = new SessionService();
module.exports.SessionService = SessionService;
