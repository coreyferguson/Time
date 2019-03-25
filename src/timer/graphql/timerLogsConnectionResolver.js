
const timerLogReducer = require('./timerLogReducer');

const timerLogsConnectionReducer = page => {
  const results = {
    after: page.cursor,
    hasAfter: page.hasAfter,
    data: page.data.map(log => timerLogReducer(log))
  };
  return results;
};

module.exports = async (parent, args, context, info) => {
  const userId = context && context.user && context.user.id;
  if (!userId) return undefined;
  let timerId;
  if (info.parentType.toString() === 'Timer') timerId = parent.id;
  if (!timerId) return undefined;
  const timerDataSource = context.dataSources.timer;
  const { pageSize, cursor } = args;
  const page = await timerDataSource.findLogs({ userId, timerId, pageSize, cursor });
  return timerLogsConnectionReducer(page);
}
