
const jwt = require('jsonwebtoken');

module.exports = function(data) {
  console.log('auth0TokenVerifyFilter.process');
  const certificate = process.env.AUTH0_TIME_CERTIFICATE;
  if (
    !data ||
    !data.request ||
    !data.request.event ||
    !data.request.event.headers ||
    !data.request.event.headers['Authorization'] ||
    !data.request.event.headers['Authorization'].startsWith('Bearer')
  ) {
    return Promise.resolve(true)
  }
  const token = data.request.event.headers['Authorization'].slice(7);
  return new Promise((resolve, reject) => {
    jwt.verify(token, certificate, {
      algorithms: ['RS256'],
      audience: 'https://time.overattribution.com',
      issuer: 'https://overattribution.auth0.com/'
    }, (err, decoded) => {
      if (err) {
        data.response.statusCode = 401;
      } else {
        data.auth = { accessToken: decoded };
      }
      resolve(!err);
    });
  });
}
