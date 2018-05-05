
const config = require('../config');

class CorsFilter {

  process(event) {
    console.info('CorsFilter.process');
    return new Promise(resolve => {
      const { request, response } = event;
      let origin = this.getOrigin(request);
      let allowedOrigin = this.getAllowedOrigin(origin);
      response.headers = response.headers || {};
      response.headers['Access-Control-Allow-Origin'] = allowedOrigin
        || config.env.api.allowOrigins[0];
      response.headers['Access-Control-Allow-Credentials'] = true;
      response.headers['Access-Control-Allow-Headers'] = 'Content-Type';
      resolve(true);
    });
  }

  getOrigin(request) {
    let origin;
    if (request && request.headers) {
      if (request.headers.origin) origin = request.headers.origin;
      else if (request.headers.Origin) origin = request.headers.Origin;
    }
    return origin;
  }

  getAllowedOrigin(origin) {
    let allowedOrigin = config.env.api.allowOrigins[0];
    if (!origin) return allowedOrigin;
    config.env.api.allowOrigins.forEach(o => {
      if (o == origin) allowedOrigin = o;
    });
    return allowedOrigin;
  }

}

module.exports = new CorsFilter();
