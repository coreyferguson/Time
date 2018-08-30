
class UserTimerAssembler {

  toModel(entity) {
    if (!entity) return null;
    const model = {};
    model.userId = entity.Item.userId.S;
    model.timerId = entity.Item.timerId.S;
    if (entity.Item.name) model.name = entity.Item.name.S;
    return model;
  }

  toEntity(model) {
    if (!model) return null;
    const entity = {};
    entity.userId = { S: model.userId };
    entity.timerId = { S: model.timerId };
    if (model.name) entity.name = { S: model.name };
    return entity;
  }

}

// export singleton
const singleton = new UserTimerAssembler();
singleton.UserTimerAssembler = UserTimerAssembler;
module.exports = singleton;
