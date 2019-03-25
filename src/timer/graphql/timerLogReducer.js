
module.exports = timerLog => {
  return {
    time: timerLog.time.toISOString(),
    action: timerLog.action
  };
};
