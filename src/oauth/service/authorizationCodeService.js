
const authorizationCodeRepository = require('../dao/authorizationCodeRepository');
const authorizationCodeModelAssembler = require('./authorizationCodeModelAssembler');
const userRepository = require('../../user/dao/userRepository');

class AuthorizationCodeService {

  constructor(options) {
    options = options || {};
    this._authorizationCodeRepository = options.authorizationCodeRepository || authorizationCodeRepository;
    this._authorizationCodeModelAssembler = options.authorizationCodeModelAssembler || authorizationCodeModelAssembler;
  }

  findOne(authorizationCode) {
    console.info(`AuthorizationCodeService.findOne(authorizationCode): ${authorizationCode}`);
    return this._authorizationCodeRepository.findOne(authorizationCode).then(entity => {
      return this._authorizationCodeModelAssembler.toModel(entity);
    });
  }

  save(model) {
    console.info('AuthorizationCodeService.save(model.authorizationCode):', model.authorizationCode);
    const entity = this._authorizationCodeModelAssembler.toEntity(model);
    return this._authorizationCodeRepository.save(entity);
  }

  delete(authorizationCode) {
    console.info(`AuthorizationCodeService.delete(authorizationCode): ${authorizationCode}`);
    return this._authorizationCodeRepository.delete(authorizationCode);
  }

}

module.exports = new AuthorizationCodeService();
module.exports.AuthorizationCodeService = AuthorizationCodeService;
