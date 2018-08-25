
var jwt = require('jsonwebtoken');

class IftttController {

  userInfo(event) {
    console.log(JSON.stringify(event));
    return new Promise(resolve => {
      if (!event || !event.headers['Authorization']) {
        resolve({ statusCode: 401 });
        return;
      }
      const token = event.headers['Authorization'].slice(7);
      const decoded = jwt.verify(
        token,
        process.env['AUTH0_TIME_CERTIFICATE'],
        {
          algorithms: ['RS256'],
          audience: 'https://time.overattribution.com',
          issuer: 'https://overattribution.auth0.com/',
          ignoreExpiration: false
        }
      );
      console.log('2: ', JSON.stringify(decoded));
    });
  }

}

module.exports = new IftttController();
