
const timerReducer = require('./timerReducer');

module.exports = async (parent, args, context, info) => {
  const userId = context && context.user && context.user.id;
  if (!userId) return undefined;
  const timerDataSource = context.dataSources.timer;
  const timers = await timerDataSource.findByUserId(userId);
  return timers.map(timerReducer);
};
