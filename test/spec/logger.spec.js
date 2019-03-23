
const logger = require('../../src/logger');
const { expect, sinon } = require('../support/TestUtils');

describe('logger', () => {

  const sandbox = sinon.createSandbox();
  const timeout = delayInMs => new Promise(resolve => {
    setTimeout(() => resolve(), delayInMs);
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('throw error when no logger name given', () => {
    expect(() => logger.startTimer(undefined, 'test-tid')).to.throw('name');
  });

  it('throw error when no tid given', () => {
    expect(() => logger.startTimer('loggerTest', undefined)).to.throw('tid');
  });

  it('start timer with appropriate logs', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', 'test-tid');
    const message = spy.getCall(0).args[0];
    expect(message, 'incorrect log message')
      .to.match(/"name":"loggerTest"/);
    expect(message, 'incorrect log message')
      .to.match(/"action":"start"/);
    expect(message, 'incorrect log message')
      .to.match(/"start":\d+/);
    expect(message, 'incorrect log message')
      .to.match(/"tid":"test-tid"/);
  });

  it('stop timer with appropriate logs', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', 'test-tid');
    return timeout(20).then(() => {
      timer.stop();
      const message = spy.getCall(1).args[0];
      const res = message.match(/"time_taken":(\d+)/);
      const timeTaken = parseInt(res[1], 10);
      expect(timeTaken).to.be.closeTo(20, 5);
      expect(message, 'incorrect log message')
        .to.match(/"name":"loggerTest"/);
      expect(message, 'incorrect log message')
        .to.match(/"action":"stop"/);
      expect(message, 'incorrect log message')
        .to.match(/"start":\d+/);
      expect(message, 'incorrect log message')
        .to.match(/"stop":\d+/);
      expect(message, 'incorrect log message')
        .to.match(/"resiliency":true/);
      expect(message, 'incorrect log message')
        .to.match(/"tid":"test-tid"/);
    });
  });

  it('stop timer with default success=true', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', 'test-tid');
    timer.stop();
    expect(spy.getCall(1).args[0]).to.match(/"resiliency":true/);
  });

  it('stop timer with success=true', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', 'test-tid');
    timer.stop(true);
    expect(spy.getCall(1).args[0]).to.match(/"resiliency":true/);
  });

  it('stop timer with success=false', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', 'test-tid');
    timer.stop(false);
    expect(spy.getCall(1).args[0]).to.match(/"resiliency":false/);
  });

  it('throw error when the same timer stopped twice', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', 'test-tid');
    timer.stop();
    expect(() => timer.stop()).to.throw('stopped');
  });

});
