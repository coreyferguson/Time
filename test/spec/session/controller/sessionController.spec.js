
const Controller = require('../../../../src/session/controller/sessionController').SessionController;
const mockSessionService = require('./mockSessionService');
const getSessionRequest = require('./data/getSessionRequest.json');
const { expect, sinon } = require('../../../support/TestUtils');

describe('sessionController unit tests', () => {

  const sandbox = sinon.sandbox.create();
  let controller;

  before(() => {
    controller = new Controller({
      sessionService: mockSessionService
    });
  });

  afterEach(() => sandbox.restore());

  it('no existing session', () => {
    sandbox.stub(mockSessionService, 'findOne')
      .returns(Promise.resolve(null));
    const data = {
      request: { event: {} },
      response: {}
    };
    return controller.getSession(data).then(res => {
      expect(data.response.statusCode).to.eql(200);
      expect(data.response.body).to.eql({});
      expect(mockSessionService.findOne).to.not.have.been.called;
    });
  });

  it('existing session but user.id does not match', () => {
    sandbox.stub(mockSessionService, 'findOne')
      .returns(Promise.resolve({
        id: 'sessionIdValue',
        user: { id: 'notmyuserid' }
      }));
    const data = {
      request: {
        event: {
          headers: {
            'Cookie': 'userId=myuserid; sessionId=1234'
          }
        }
      },
      response: {}
    };
    return controller.getSession(data).then(res => {
      expect(data.response.statusCode).to.eql(200);
      expect(data.response.body).to.eql({});
    });
  });

  it('existing session and user.id matches', () => {
    sandbox.stub(mockSessionService, 'findOne')
      .returns(Promise.resolve({
        id: 'sessionIdValue',
        user: { id: 'myuserid' }
      }));
    const data = {
      request: {
        event: {
          headers: {
            'Cookie': 'userId=myuserid; sessionId=1234'
          }
        }
      },
      response: {}
    };
    return controller.getSession(data).then(res => {
      expect(data.response.statusCode).to.eql(200);
      expect(data.response.body).to.eql({ id: 'myuserid' });
    });
  });

});
