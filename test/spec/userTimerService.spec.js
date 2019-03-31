
const { expect, sinon } = require('../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const UserTimerRepository = require('../../src/timer/dao/userTimerRepository').UserTimerRepository;
const UserTimerLogRepository = require('../../src/timer/dao/userTimerLogRepository').UserTimerLogRepository;
const UserTimerService = require('../../src/timer/service/userTimerService').UserTimerService;
const logger = require('../support/mock/mockLogger');
const path = require('path');

describe('userTimerService', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../serverless.yml')
  );

  const sandbox = sinon.createSandbox();
  let userTimerService, userTimerRepository, userTimerLogRepository;

  before(function() {
    this.timeout(5000);
    const dynamodb = facade.start();
    userTimerRepository = new UserTimerRepository({
      dynamodb,
      userTimerTableName: 'userTimer-test',
      logger
    });
    userTimerLogRepository = new UserTimerLogRepository({
      dynamodb,
      userTimerLogTableName: 'userTimerLog-test',
      logger
    });
    userTimerService = new UserTimerService({
      userTimerRepository, userTimerLogRepository, logger
    });
    return Promise.all([
      facade.createTable('userTimerTable', 'userTimer-test'),
      facade.createTable('userTimerLogTable', 'userTimerLog-test')
    ]);
  });

  after(() => {
    facade.stop();
  });

  beforeEach(() => {
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('findOne - no data', () => {
    return expect(userTimerService.findOne('userId', 'timerId'))
      .to.eventually.be.null;
  });

  it('save new timer & find & delete', () => {
    return userTimerService.save({
      userId: 'userIdValue',
      timerId: 'timerIdValue',
      name: 'Timer Name Value'
    }).then(() => {
      return userTimerService.findOne('userIdValue', 'timerIdValue');
    }).then(userTimer => {
      expect(userTimer.userId).to.eql('userIdValue');
      expect(userTimer.timerId).to.eql('timerIdValue');
      expect(userTimer.name).to.eql('Timer Name Value');
    }).then(() => {
      return userTimerService.delete('userIdValue', 'timerIdValue');
    }).then(() => {
      return userTimerService.findOne('userIdValue', 'timerIdValue');
    }).then(userTimer => {
      expect(userTimer).to.be.null;
    });
  });

  it('findByUserId', () => {
    return userTimerService.save({
      userId: 'user1',
      timerId: 'timer1'
    }).then(() => {
      return userTimerService.save({
        userId: 'user1',
        timerId: 'timer2'
      });
    }).then(() => {
      return userTimerService.save({
        userId: 'user2',
        timerId: 'timer1'
      });
    }).then(() => {
      return userTimerService.findByUserId('user1');
    }).then(results => {
      expect(results).to.eql([
        { userId: 'user1', timerId: 'timer1' },
        { userId: 'user1', timerId: 'timer2' }
      ]);
    });
  });

  it('start log', async () => {
    const userId = 'userIdValue';
    const timerId = 'timerIdValue';
    await userTimerService.startLog(userId, timerId);
    const results = await userTimerService.findLogs({ userId, timerId });
    expect(results.data.length).to.be.equal(1);
    const log = results.data[0];
    expect(log.action).to.equal('start');
    expect(log.timerId).to.equal('timerIdValue');
    expect(log.userId).to.equal('userIdValue');
    expect(log.time).to.not.be.null;
    await userTimerService.deleteLog('userIdValue', 'timerIdValue', log.time);
  });

  it('start and stop log', async () => {
    const userId = 'userIdValue';
    const timerId = 'timerIdValue';
    await userTimerService.startLog(userId, timerId);
    await userTimerService.stopLog(userId, timerId);
    const results = await userTimerService.findLogs({ userId, timerId });
    expect(results.data.length).to.be.equal(2);
    const [start, stop] = results.data;
    expect(start.userId).to.equal('userIdValue');
    expect(start.timerId).to.equal('timerIdValue');
    expect(start.timer).to.not.be.null;
    expect(start.action).to.equal('start');
    expect(stop.userId).to.equal('userIdValue');
    expect(stop.timerId).to.equal('timerIdValue');
    expect(stop.timer).to.not.be.null;
    expect(stop.action).to.equal('stop');
    expect(start.time).to.be.lessThan(stop.time);
    return Promise.all(results.data.map(log => {
      return userTimerService.deleteLog('userIdValue', 'timerIdValue', log.time)
    }));
  });

  it('logs should be paginated', async () => {
    const startAndStopTimer = async () => {
      await userTimerService.startLog('userIdValue', 'timerIdValue');
      await userTimerService.stopLog('userIdValue', 'timerIdValue');
    };
    await startAndStopTimer();
    await startAndStopTimer();
    const page1 = await userTimerService.findLogs({
      userId: 'userIdValue',
      timerId: 'timerIdValue',
      pageSize: 2
    });
    expect(page1.data.length).to.be.equal(2);
    expect(page1.cursor).to.not.be.undefined;
    expect(page1.hasAfter).to.be.true;
    const page2 = await userTimerService.findLogs({ cursor: page1.cursor });
    expect(page2.data.length).to.be.equal(2);
    expect(page2.hasAfter).to.be.true;
    expect(page1.data[1].time).to.be.lessThan(page2.data[0].time);
    const page3 = await userTimerService.findLogs({ cursor: page2.cursor });
    expect(page3.data.length).to.equal(0);
    expect(page3.hasAfter).to.be.false;
    await Promise.all(page1.data.map(log => {
      return userTimerService.deleteLog('userIdValue', 'timerIdValue', log.time)
    }));
    await Promise.all(page2.data.map(log => {
      return userTimerService.deleteLog('userIdValue', 'timerIdValue', log.time)
    }));
  });

});
