
class AuthorizationCodeModelAssembler {

  toModel(entity) {
    if (!entity) return null;
    const model = {};
    model.id = entity.Item.id.S;
    model.secret = entity.Item.secret.S;
    model.redirectUris = entity.Item.redirectUris.L.map(item => item.S);
    model.grants = entity.Item.grants.L.map(item => item.S);
    model.createdOn = new Date(entity.Item.createdOn.S);
    return model;
  }

  toEntity(model, existingEntity) {
    if (!model) return null;
    const entity = (existingEntity)
      ? existingEntity.Item
      : {};
    entity.id = { S: model.id };
    entity.secret = { S: model.secret };
    entity.redirectUris = {
      L: model.redirectUris.map(value => {
        return { S: value };
      })
    };
    entity.grants = {
      L: model.grants.map(value => {
        return { S: value };
      })
    };
    let createdOn;
    if (existingEntity) createdOn = existingEntity.Item.createdOn;
    else if (model.createdOn) createdOn = { S: model.createdOn.toISOString() };
    else createdOn = { S: new Date().toISOString() };
    entity.createdOn = createdOn;
    return entity;
  }

}

// export singleton
const singleton = new AuthorizationCodeModelAssembler();
singleton.AuthorizationCodeModelAssembler = AuthorizationCodeModelAssembler;
module.exports = singleton;
