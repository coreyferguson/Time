
const Controller = require('../../../../src/session/controller/sessionController').SessionController;
const mockFirebaseAdmin = require('./mockFirebaseAdmin');
const mockSessionService = require('./mockSessionService');
const mockUserService = require('./mockUserService')
const getSessionRequest = require('./data/getSessionRequest.json');
const decodedToken = require('./data/decodedToken.json');
const { expect, sinon } = require('../../../support/TestUtils');

describe('sessionController unit tests', () => {

  const sandbox = sinon.sandbox.create();
  let controller;

  before(() => {
    controller = new Controller({
      firebase: mockFirebaseAdmin,
      sessionService: mockSessionService,
      userService: mockUserService
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

  it('verifyIdToken, new user', () => {
    sandbox.stub(mockFirebaseAdmin.auth(), 'verifyIdToken')
      .returns(Promise.resolve(decodedToken));
    sandbox.stub(mockUserService, 'save').returns(Promise.resolve());
    sandbox.stub(mockSessionService, 'save').returns(Promise.resolve());
    const data = {
      request: {
        event: {
          body: {
            idToken: 'idTokenValue'
          }
        }
      },
      response: {}
    };
    return controller.verifyIdToken(data).then(() => {
      expect(data.response.statusCode).to.eql(200);
      expect(data.response.body.externalAuthMethod).to.eql('google.com');
      expect(data.response.body.externalAuthId).to.eql('Ab1CDefgHIjKlM2nopQrsT3uvWX4');
      expect(data.response.body.displayName).to.eql('Corey Ferguson');
      expect(data.response.body.profilePicture).to.eql('https://lh6.googleusercontent.com/-abcde-fghiJ/KLMNOPQRSTU/ABCDEFGHIj1/ABcd8EFGhij/photo.jpg');
      expect(data.response.headers['set-cookie']).to.eql(`userId=${data.response.body.id}; Domain=time-api-test.overattribution.com; Secure; HttpOnly`);
      expect(data.response.headers['Set-cookie']).to.match(/sessionId=[\w-]+; Domain=time-api-test.overattribution.com; Secure; HttpOnly/);
      expect(mockUserService.save).to.have.been.calledOnce;
      expect(mockSessionService.save).to.have.been.calledOnce;
    });
  });

  it('verifyIdToken, existing user', () => {
    sandbox.stub(mockFirebaseAdmin.auth(), 'verifyIdToken')
      .returns(Promise.resolve(decodedToken));
    sandbox.stub(mockUserService, 'findByExternalIds')
      .returns(Promise.resolve({
        id: 'idValue',
        externalAuthMethod: 'externalAuthMethodValue',
        externalAuthId: 'externalAuthIdValue',
        displayName: 'displayNameValue',
        profilePicture: 'profilePictureValue',
        createdOn: new Date()
      }));
    sandbox.stub(mockUserService, 'save').returns(Promise.resolve());
    sandbox.stub(mockSessionService, 'save').returns(Promise.resolve());
    const data = {
      request: {
        event: {
          body: {
            idToken: 'idTokenValue'
          }
        }
      },
      response: {}
    };
    return controller.verifyIdToken(data).then(() => {
      expect(data.response.statusCode).to.eql(200);
      expect(data.response.body.externalAuthMethod).to.eql('externalAuthMethodValue');
      expect(data.response.body.externalAuthId).to.eql('externalAuthIdValue');
      expect(data.response.body.displayName).to.eql('displayNameValue');
      expect(data.response.body.profilePicture).to.eql('profilePictureValue');
      expect(data.response.headers['set-cookie']).to.eql('userId=idValue; Domain=time-api-test.overattribution.com; Secure; HttpOnly');
      expect(data.response.headers['Set-cookie']).to.match(/sessionId=[\w-]+; Domain=time-api-test.overattribution.com; Secure; HttpOnly/);
      expect(mockUserService.save).to.not.have.been.called;
      expect(mockSessionService.save).to.have.been.calledOnce;
    });
  });

});
