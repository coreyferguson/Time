
const cookieParser = require('../../core/cookieParser');
const firebase = require('firebase-admin');
const sessionService = require('../service/sessionService');
const userService = require('../../user/service/userService');
const uuidv4 = require('uuid/v4');
const config = require('../../config');

class SessionController {

  constructor(options) {
    options = options || {};
    this._cookieParser = options.cookieParser || cookieParser;
    this._firebase = options.firebase || firebase;
    this._sessionService = options.sessionService || sessionService;
    this._userService = options.userService || userService;
    this.getSession = this.getSession.bind(this);
    this.verifyIdToken = this.verifyIdToken.bind(this);
  }

  getSession(data) {
    const cookies = this._cookieParser.cookiesToJson(data.request.event);
    const cookieUserId = cookies.userId;
    const cookieSessionId = cookies.sessionId;
    if (!cookieSessionId) {
      data.response.statusCode = 200;
      data.response.body = {};
      return Promise.resolve();
    }
    return this._sessionService.findOne(cookieSessionId).then(session => {
      // validate session exists and session.user.id matches given cookies
      if (!session || session.user.id !== cookieUserId) {
        data.response.statusCode = 200;
        data.response.body = {};
      } else {
        // user is authenticated, return user information
        data.response.statusCode = 200;
        data.response.body = session.user;
      }
    });
  }

  verifyIdToken(data) {
    const idToken = data.request.event.body.idToken;
    let token, user, session;
    // const expiresIn = 1000 * 60 * 60 * 24 * 5; // 5 days
    return this._firebase.auth().verifyIdToken(idToken).then(decodedToken => {
      token = decodedToken;
      data.response.statusCode = 200;
      data.response.body = { idToken, event: data.request.event };
      return this._userService.findByExternalIds(
        token.firebase.sign_in_provider, token.sub);
    }).then(existingUser => {
      if (existingUser) user = existingUser;
      else {
        user = {
          id: uuidv4(),
          externalAuthMethod: token.firebase.sign_in_provider,
          externalAuthId: token.sub,
          displayName: token.name,
          profilePicture: token.picture,
          createdOn: new Date()
        };
        return this._userService.save(user);
      }
    }).then(() => {
      session = {
        id: uuidv4(),
        createdOn: new Date(),
        user
      };
      return this._sessionService.save(session);
    }).then(() => {
      data.response.headers = data.response.headers || {};
      data.response.headers['set-cookie'] = `userId=${user.id}; Domain=${config.env.api.domain}; Secure; HttpOnly`;
      data.response.headers['Set-cookie'] = `sessionId=${session.id}; Domain=${config.env.api.domain}; Secure; HttpOnly`;
      data.response.body = user;
    }).catch(err => {
      console.log(err);
      data.response.statusCode = 401;
      data.response.body = { idToken, event: data.request.event };
    });
  }

}

module.exports = new SessionController();
module.exports.SessionController = SessionController;
