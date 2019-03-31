
class MockLogger {

  tid(tid) {}

  info(message, props) {}

  startTimer(name, tid) {
    return new MockTimer();
  }

}

class MockTimer {
  stop(success) {}
}

module.exports = new MockLogger();
