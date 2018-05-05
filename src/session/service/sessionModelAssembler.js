
class SessionModelAssembler {

  toModel(entity, userModel) {
    if (!entity) return null;
    const model = {};
    model.id = entity.Item.id.S;
    model.createdOn = new Date(entity.Item.createdOn.S);
    model.user = userModel;
    return model;
  }

  toEntity(model) {
    if (!model) return null;
    const entity = {};
    entity.id = { S: model.id };
    entity.createdOn = (model.createdOn)
        ? { S: model.createdOn.toISOString() }
        : { S: new Date().toISOString() };
    entity.userId = { S: model.user.id };
    return entity;
  }

}

// export singleton
const singleton = new SessionModelAssembler();
singleton.SessionModelAssembler = SessionModelAssembler;
module.exports = singleton;
