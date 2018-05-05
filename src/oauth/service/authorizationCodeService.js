
const authorizationCodeRepository = require('../dao/authorizationCodeRepository');
const authorizationCodeModelAssembler = require('./authorizationCodeModelAssembler');
const clientRepository = require('../dao/clientRepository');
const clientModelAssembler = require('./clientModelAssembler');
const userRepository = require('../../user/dao/userRepository');
const userModelAssembler = require('../../user/service/userModelAssembler');

class AuthorizationCodeService {

  constructor(options) {
    options = options || {};
    this._authorizationCodeRepository = options.authorizationCodeRepository || authorizationCodeRepository;
    this._authorizationCodeModelAssembler = options.authorizationCodeModelAssembler || authorizationCodeModelAssembler;
    this._clientRepository = options.clientRepository || clientRepository;
    this._clientModelAssembler = options.clientModelAssembler || clientModelAssembler;
    this._userRepository = options.userRepository || userRepository;
    this._userModelAssembler = options.userModelAssembler || userModelAssembler;
  }

  findOne(authorizationCode) {
    console.info(`AuthorizationCodeService.findOne(authorizationCode): ${authorizationCode}`);
    return this._authorizationCodeRepository.findOne(authorizationCode).then(authorizationCode => {
      if (!authorizationCode) return null;
      return Promise.all([
        authorizationCode,
        this._clientRepository.findOne(authorizationCode.Item.clientId.S),
        this._userRepository.findOne(authorizationCode.Item.userId.S)
      ]);
    }).then(r => {
      if (!r) return null;
      const authorizationCode = r[0];
      const client = this._clientModelAssembler.toModel(r[1]);
      const user = this._userModelAssembler.toModel(r[2]);
      return this._authorizationCodeModelAssembler.toModel(authorizationCode, client, user);
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
