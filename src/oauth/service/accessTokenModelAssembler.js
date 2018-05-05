
class AccessTokenModelAssembler {

  toModel(entity, clientModel, userModel) {
    if (!entity) return null;
    const model = {};
    model.accessToken = entity.Item.accessToken.S;
    model.authorizationCode = entity.Item.authorizationCode.S;
    model.accessTokenExpiresAt = new Date(entity.Item.accessTokenExpiresAt.S);
    model.refreshToken = entity.Item.refreshToken.S;
    model.refreshTokenExpiresAt = new Date(entity.Item.refreshTokenExpiresAt.S);
    model.scope = entity.Item.scope.S;
    model.client = clientModel;
    model.user = userModel;
    return model;
  }

  toEntity(model) {
    if (!model) return null;
    const entity = {};
    entity.accessToken = { S: model.accessToken };
    entity.authorizationCode = { S: model.authorizationCode };
    entity.accessTokenExpiresAt = { S: model.accessTokenExpiresAt.toISOString() };
    entity.refreshToken = { S: model.refreshToken };
    entity.refreshTokenExpiresAt = { S: model.refreshTokenExpiresAt.toISOString() };
    entity.scope = { S: model.scope };
    entity.clientId = { S: model.client.id };
    entity.userId = { S: model.user.id };
    return entity;
  }

}

// export singleton
const singleton = new AccessTokenModelAssembler();
singleton.AccessTokenModelAssembler = AccessTokenModelAssembler;
module.exports = singleton;
