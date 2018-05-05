
class AuthorizationCodeModelAssembler {

  toModel(entity, clientModel, userModel) {
    if (!entity) return null;
    const model = {};
    model.authorizationCode = entity.Item.authorizationCode.S;
    model.expiresAt = new Date(entity.Item.expiresAt.S);
    model.redirectUri = entity.Item.redirectUri.S;
    model.scope = entity.Item.scope.S;
    model.client = clientModel;
    model.user = userModel;
    return model;
  }

  toEntity(model) {
    if (!model) return null;
    const entity = {};
    entity.authorizationCode = { S: model.authorizationCode };
    entity.expiresAt = { S: model.expiresAt.toISOString() };
    entity.redirectUri = { S: model.redirectUri };
    entity.scope = { S: model.scope };
    entity.clientId = { S: model.client.id };
    entity.userId = { S: model.user.id };
    return entity;
  }

}

// export singleton
const singleton = new AuthorizationCodeModelAssembler();
singleton.AuthorizationCodeModelAssembler = AuthorizationCodeModelAssembler;
module.exports = singleton;
