
const timerReducer = require('./timerReducer');
const logger = require('../../logger');

module.exports = async (parent, args, context, info) => {
  const logTimer = logger.startTimer('timersResolver');
  try {
    const userId = context && context.user && context.user.id;
    if (!userId) return undefined;
    const timerDataSource = context.dataSources.timer;
    const timers = await timerDataSource.findByUserId(userId);
    const result = timers.map(timerReducer);
    logTimer.stop(true);
    return result;
  } catch (err) {
    logTimer.stop(false);
    throw err;
  }
};
