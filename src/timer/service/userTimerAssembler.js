
class UserTimerModelAssembler {

  toModel(entity) {
    if (!entity) return null;
    const model = {};
    model.userId = entity.Item.userId.S;
    model.timerId = entity.Item.timerId.S;
    if (entity.Item.timerName) model.timerName = entity.Item.timerName.S;
    return model;
  }

  toEntity(model) {
    if (!model) return null;
    const entity = {};
    entity.userId = { S: model.userId };
    entity.timerId = { S: model.timerId };
    if (model.timerName) entity.timerName = { S: model.timerName };
    return entity;
  }

}

// export singleton
const singleton = new UserTimerModelAssembler();
singleton.UserTimerModelAssembler = UserTimerModelAssembler;
module.exports = singleton;
