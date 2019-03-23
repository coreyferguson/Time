
const timerLogReducer = require('./timerLogReducer');

module.exports = async (parent, args, context, info) => {
  const userId = context && context.user && context.user.id;
  if (!userId) return undefined;
  let timerId;
  if (info.parentType.toString() === 'Timer') timerId = parent.id;
  if (!timerId) return undefined;
  const timerDataSource = context.dataSources.timer;
  const logs = await timerDataSource.findLogs(userId, timerId);
  return logs.map(timerLogReducer);
};
