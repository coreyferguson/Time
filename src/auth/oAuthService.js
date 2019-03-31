
const jwt = require('jsonwebtoken');
const secrets = require('../secrets');
const logger = require('../logger');

class OAuthService {

  async verify(token) {
    const timer = logger.startTimer('oAuthService.verify');
    const secretValues = await secrets.load(['AUTH0_TIME_CERTIFICATE']);
    const certificate = secretValues.get('AUTH0_TIME_CERTIFICATE');
    return new Promise((resolve, reject) => {
      jwt.verify(token, certificate, {
        algorithms: ['RS256'],
        audience: 'https://time.overattribution.com',
        issuer: 'https://overattribution.auth0.com/'
      }, (err, decoded) => {
        if (err) {
          timer.stop(false);
          reject(err);
        } else {
          timer.stop(true);
          resolve(decoded);
        }
      });
    });
  }

}

module.exports = new OAuthService();
module.exports.OAuthService = OAuthService;
