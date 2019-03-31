
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

  it('info log message', () => {
    const spy = sandbox.stub(console, 'info');
    logger.tid('7dacc3f7-e565-4d63-be91-73dd6473e3d8');
    logger.info('test message value');
    const message = spy.getCall(0).args[0];
    expect(message).to.contain('"level":"info"');
    expect(message).to.contain('"message":"test message value"');
    expect(message).to.contain('"tid":"7dacc3f7-e565-4d63-be91-73dd6473e3d8"');
    logger.tid(undefined);
  });

  it('throw error when no logger name given', () => {
    expect(() => logger.startTimer(undefined, 'test-tid')).to.throw('name');
  });

  it('throw error when no tid given', () => {
    logger.tid(undefined);
    expect(() => logger.startTimer('loggerTest', undefined)).to.throw('tid');
  });

  it('start timer with appropriate logs', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', '0b1828ea-200d-4249-9e32-1f42f6431537');
    const message = spy.getCall(0).args[0];
    expect(message, 'incorrect log message')
      .to.match(/"name":"loggerTest"/);
    expect(message, 'incorrect log message')
      .to.match(/"action":"start"/);
    expect(message, 'incorrect log message')
      .to.match(/"start":\d+/);
    expect(message, 'incorrect log message')
      .to.match(/"tid":"0b1828ea-200d-4249-9e32-1f42f6431537"/);
  });

  it('stop timer with appropriate logs', () => {
    const spy = sandbox.stub(console, 'info');
    const timer = logger.startTimer('loggerTest', '706571ba-3b1c-425e-bdd6-6a3b850fc239');
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
        .to.match(/"tid":"706571ba-3b1c-425e-bdd6-6a3b850fc239"/);
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
