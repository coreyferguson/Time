
const config = require('../config');

function corsFilter(data) {
  console.info('CorsFilter.process');
  return new Promise(resolve => {
    const event = data.request.event;
    const response = data.response;
    let origin = getOrigin(event);
    let allowedOrigin = getAllowedOrigin(origin);
    response.headers = response.headers || {};
    response.headers['Access-Control-Allow-Origin'] = allowedOrigin
      || config.env.api.allowOrigins[0];
    response.headers['Access-Control-Allow-Credentials'] = true;
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type';
    resolve(origin === allowedOrigin);
  });
}

function getOrigin(event) {
  let origin;
  if (event && event.headers) {
    if (event.headers.origin) origin = event.headers.origin;
    else if (event.headers.Origin) origin = event.headers.Origin;
  }
  return origin;
}

function getAllowedOrigin(origin) {
  let allowedOrigin = config.env.api.allowOrigins[0];
  if (!origin) return allowedOrigin;
  config.env.api.allowOrigins.forEach(o => {
    if (o == origin) allowedOrigin = o;
  });
  return allowedOrigin;
}

module.exports = corsFilter;
module.exports.getOrigin = getOrigin;
module.exports.getAllowedOrigin = getAllowedOrigin;
