
class UserModelAssembler {

  toModel(entity) {
    if (!entity) return null;
    const model = {};
    model.id = entity.Item.id.S;
    model.authMethod = entity.Item.authMethod.S;
    model.displayName = entity.Item.displayName.S;
    model.profilePicture = entity.Item.profilePicture.S;
    model.createdOn = new Date(entity.Item.createdOn.S);
    return model;
  }

  toEntity(model, existingEntity) {
    if (!model) return null;
    const entity = (existingEntity)
      ? existingEntity.Item
      : {};
    entity.id = { S: model.id };
    entity.authMethod = { S: model.authMethod };
    entity.displayName = { S: model.displayName };
    entity.profilePicture = { S: model.profilePicture };
    let createdOn;
    if (existingEntity) createdOn = existingEntity.Item.createdOn;
    else if (model.createdOn) createdOn = { S: model.createdOn.toISOString() };
    else createdOn = { S: new Date().toISOString() };
    entity.createdOn = createdOn;
    return entity;
  }

}

// export singleton
const singleton = new UserModelAssembler();
singleton.UserModelAssembler = UserModelAssembler;
module.exports = singleton;
