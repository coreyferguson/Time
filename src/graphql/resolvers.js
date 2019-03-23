
const timersResolver = require('../timer/graphql/timersResolver');
const timerResolver = require('../timer/graphql/timerResolver');
const userResolver = require('../user/graphql/userResolver');
const timerLogsResolver = require('../timer/graphql/timerLogsResolver');

module.exports = {
  Query: {
    me: userResolver
  },
  Timer: {
    logs: timerLogsResolver
  },
  TimerLog: {
    timer: timerResolver
  },
  User: {
    timers: timersResolver
  }
};
