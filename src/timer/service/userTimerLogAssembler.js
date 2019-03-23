
class UserTimerLogAssembler {

  toModel(entity) {
    if (!entity) return null;
    const model = {};
    const [userId, timerId] = entity.Item.userTimerId.S.split(';');
    model.userId = userId;
    model.timerId = timerId;
    model.time = new Date(entity.Item.time.S);
    model.action = entity.Item.action.S;
    return model;
  }

  toEntity(model) {
    if (!model) return null;
    const entity = {};
    entity.userTimerId = { S: `${model.userId};${model.timerId}` };
    entity.time = { S: model.time.toISOString() };
    entity.action = { S: model.action };
    return entity;
  }

}

// export singleton
const singleton = new UserTimerLogAssembler();
singleton.UserTimerLogAssembler = UserTimerLogAssembler;
module.exports = singleton;
