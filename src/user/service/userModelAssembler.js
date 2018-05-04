
class UserModelAssembler {

  toModel(entity) {
    if (!entity) return null;
    const model = {};
    model.id = entity.Item.id.S;
    model.authMethod = entity.Item.authMethod.S;
    model.displayName = entity.Item.displayName.S;
    model.profilePicture = entity.Item.profilePicture.S;
    model.createdOn = entity.Item.createdOn.S;
    return model;
  }

  toEntity(model) {
    if (!model) return null;
    const entity = {};
    entity.id = { S: model.id };
    entity.authMethod = { S: model.authMethod };
    entity.displayName = { S: model.displayName };
    entity.profilePicture = { S: model.profilePicture };
    entity.createdOn = { S: model.createdOn };
    return entity;
  }

}

// export singleton
const singleton = new UserModelAssembler();
singleton.UserModelAssembler = UserModelAssembler;
module.exports = singleton;
