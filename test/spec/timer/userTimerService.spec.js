
const { expect, sinon } = require('../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const UserTimerRepository = require('../../../src/timer/dao/userTimerRepository').UserTimerRepository;
const UserTimerLogRepository = require('../../../src/timer/dao/userTimerLogRepository').UserTimerLogRepository;
const UserTimerService = require('../../../src/timer/service/userTimerService').UserTimerService;
const path = require('path');
const bluebird = require('bluebird');

describe('userTimerService', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../../serverless.yml')
  );

  const sandbox = sinon.sandbox.create();
  let userTimerService, userTimerRepository;

  before(function() {
    this.timeout(5000);
    const dynamodb = facade.start();
    userTimerRepository = new UserTimerRepository({
      dynamodb,
      userTimerTableName: 'userTimer-test'
    });
    userTimerLogRepository = new UserTimerLogRepository({
      dynamodb,
      userTimerLogTableName: 'userTimerLog-test'
    });
    userTimerService = new UserTimerService({
      userTimerRepository, userTimerLogRepository
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
    sandbox.stub(console, 'info');
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

  it('start log', () => {
    return userTimerService.startLog('userIdValue', 'timerIdValue').then(() => {
      return userTimerService.findLogs('userIdValue', 'timerIdValue');
    }).then(results => {
      expect(results.length).to.be.equal(1);
      const log = results[0];
      expect(log.action).to.equal('start');
      expect(log.timerId).to.equal('timerIdValue');
      expect(log.userId).to.equal('userIdValue');
      expect(log.time).to.not.be.null;
      return log.time;
    }).then(time => {
      return userTimerService.deleteLog('userIdValue', 'timerIdValue', time);
    });
  });

  it('start and stop log', () => {
    return userTimerService.startLog('userIdValue', 'timerIdValue').then(() => {
      return userTimerService.stopLog('userIdValue', 'timerIdValue');
    }).then(() => {
      return userTimerService.findLogs('userIdValue', 'timerIdValue');
    }).then(results => {
      expect(results.length).to.be.equal(2);
      const [start, stop] = results;
      expect(start.userId).to.equal('userIdValue');
      expect(start.timerId).to.equal('timerIdValue');
      expect(start.timer).to.not.be.null;
      expect(start.action).to.equal('start');
      expect(stop.userId).to.equal('userIdValue');
      expect(stop.timerId).to.equal('timerIdValue');
      expect(stop.timer).to.not.be.null;
      expect(stop.action).to.equal('stop');
      expect(start.time).to.be.lessThan(stop.time);
      return bluebird.map(results, result => {
        return userTimerService.deleteLog('userIdValue', 'timerIdValue', result.time);
      });
    });
  });

});
