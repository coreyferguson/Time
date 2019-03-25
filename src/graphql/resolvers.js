
const timersResolver = require('../timer/graphql/timersResolver');
const timerResolver = require('../timer/graphql/timerResolver');
const userResolver = require('../user/graphql/userResolver');
const timerLogsConnectionResolver = require('../timer/graphql/timerLogsConnectionResolver');

module.exports = {
  Query: {
    me: userResolver
  },
  Timer: {
    logs: timerLogsConnectionResolver
  },
  TimerLog: {
    timer: timerResolver
  },
  User: {
    timers: timersResolver,
    timer: timerResolver
  }
};
