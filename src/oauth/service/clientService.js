
const clientRepository = require('../dao/clientRepository');
const clientModelAssembler = require('./clientModelAssembler');

class ClientService {

  constructor(options) {
    options = options || {};
    this._clientRepository = options.clientRepository || clientRepository;
    this._clientModelAssembler = options.clientModelAssembler || clientModelAssembler;
  }

  findOne(id) {
    console.info(`ClientService.findOne(id): ${id}`);
    return this._clientRepository.findOne(id).then(entity => {
      return this._clientModelAssembler.toModel(entity);
    });
  }

  save(model) {
    return this._clientRepository.findOne(model.id).then(existingEntity => {
      const entity = this._clientModelAssembler.toEntity(model, existingEntity);
      return this._clientRepository.save(entity);
    });
  }

  delete(id) {
    console.info(`ClientService.delete(id): ${id}`);
    return this._clientRepository.delete(id);
  }

}

module.exports = new ClientService();
module.exports.ClientService = ClientService;
