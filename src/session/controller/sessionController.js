
const sessionService = require('../service/sessionService');
const cookieParser = require('../../core/cookieParser');

class SessionController {

  constructor(options) {
    options = options || {};
    this._sessionService = options.sessionService || sessionService;
    this._cookieParser = options.cookieParser || cookieParser;
    this.getSession = this.getSession.bind(this);
  }

  getSession(data) {
    const cookies = this._cookieParser.cookiesToJson(data.request.event);
    const cookieUserId = cookies.userId;
    const cookieSessionId = cookies.sessionId;
    if (!cookieSessionId) {
      data.response.statusCode = 401;
      return Promise.resolve();
    }
    return this._sessionService.findOne(cookieSessionId).then(session => {
      // validate session exists and session.user.id matches given cookies
      if (!session || session.user.id !== cookieUserId) {
        data.response.statusCode = 401;
      } else {
        // user is authenticated, return user information
        data.response.statusCode = 200;
        data.response.body = session.user;
      }
    });
  }

}

module.exports = new SessionController();
module.exports.SessionController = SessionController;
