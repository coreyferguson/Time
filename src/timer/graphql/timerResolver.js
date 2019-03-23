
// TODO: Remove hard-coded timers
const timers = [
  {
    userId: 'google-oauth2|110913751698143662875',
    timerId: 'study',
    name: 'Study'
  },
  {
    userId: 'google-oauth2|110913751698143662875',
    timerId: 'sleep',
    name: 'Sleep'
  },
  {
    userId: 'google-oauth2|100555483106364692142',
    timerId: 'slack',
    name: 'Slack'
  }
];


module.exports = (parent, args, context, info) => {
  let id, userId;
  if (parent && parent.id) {
    id = parent.id.split(';')[1];
    userId = parent.id.split(';')[0];
  } else {
    id = args.id;
    userId = args.userId;
  }
  const res = timers.filter(timer => (
    timer.timerId === id
    && timer.userId === userId
  ));
  return res && res.length > 0 && timerReducer(res[0]);
};
