
const { expect, sinon } = require('../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const UserTimerRepository = require('../../../src/timer/dao/userTimerRepository').UserTimerRepository;
const UserTimerService = require('../../../src/timer/service/userTimerService').UserTimerService;
const path = require('path');

describe.only('userTimerRepository', () => {

  const facade = new LocalDynamoFacade(
    path.join(__dirname, '../../../serverless.yml')
  );

  const sandbox = sinon.sandbox.create();
  let userTimerService, userTimerRepository;

  before(function() {
    this.timeout(5000);
    userTimerRepository = new UserTimerRepository({
      dynamodb: facade.start(),
      userTimerTableName: 'userTimer-test'
    });
    userTimerService = new UserTimerService({
      userTimerRepository
    });
    return facade.createTable('userTimerTable', 'userTimer-test');
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
      timerName: 'Timer Name Value'
    }).then(() => {
      return userTimerService.findOne('userIdValue', 'timerIdValue');
    }).then(userTimer => {
      expect(userTimer.userId).to.eql('userIdValue');
      expect(userTimer.timerId).to.eql('timerIdValue');
      expect(userTimer.timerName).to.eql('Timer Name Value');
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

});
