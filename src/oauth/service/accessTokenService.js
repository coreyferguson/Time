
const accessTokenRepository = require('../dao/accessTokenRepository');
const accessTokenModelAssembler = require('./accessTokenModelAssembler');
const clientRepository = require('../dao/clientRepository');
const clientModelAssembler = require('./clientModelAssembler');
const userRepository = require('../../user/dao/userRepository');
const userModelAssembler = require('../../user/service/userModelAssembler');

class AccessTokenService {

  constructor(options) {
    options = options || {};
    this._accessTokenRepository = options.accessTokenRepository || accessTokenRepository;
    this._accessTokenModelAssembler = options.accessTokenModelAssembler || accessTokenModelAssembler;
    this._clientRepository = options.clientRepository || clientRepository;
    this._clientModelAssembler = options.clientModelAssembler || clientModelAssembler;
    this._userRepository = options.userRepository || userRepository;
    this._userModelAssembler = options.userModelAssembler || userModelAssembler;
  }

  findOne(accessToken) {
    console.info(`AccessTokenService.findOne(accessToken): ${accessToken}`);
    return this._accessTokenRepository.findOne(accessToken).then(accessToken => {
      if (!accessToken) return null;
      return Promise.all([
        accessToken,
        this._clientRepository.findOne(accessToken.Item.clientId.S),
        this._userRepository.findOne(accessToken.Item.userId.S)
      ]);
    }).then(r => {
      if (!r) return null;
      const accessToken = r[0];
      const client = this._clientModelAssembler.toModel(r[1]);
      const user = this._userModelAssembler.toModel(r[2]);
      return this._accessTokenModelAssembler.toModel(accessToken, client, user);
    });
  }

  save(model) {
    console.info('AccessTokenService.save(model.accessToken):', model.accessToken);
    const entity = this._accessTokenModelAssembler.toEntity(model);
    return this._accessTokenRepository.save(entity);
  }

  delete(accessToken) {
    console.info(`AccessTokenService.delete(accessToken): ${accessToken}`);
    return this._accessTokenRepository.delete(accessToken);
  }

}

module.exports = new AccessTokenService();
module.exports.AccessTokenService = AccessTokenService;
