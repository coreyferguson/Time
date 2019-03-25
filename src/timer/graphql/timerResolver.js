
const timerReducer = require('./timerReducer');

module.exports = async (parent, args, context, info) => {
  const userId = context && context.user && context.user.id;
  if (!userId) return undefined;
  const timerId = args.id;
  if (!timerId) return undefined;
  const timerDataSource = context.dataSources.timer;
  const timer = await timerDataSource.findOne(userId, timerId);
  return timerReducer(timer);
};
