
class CorsFilter {

  constructor() {
    this.allowOrigins = [
      'https://time.overattribution.com',
      'https://local.time.overattribution.com:8080'
    ];
  }

  getCorsHeaders(event) {
    const headers = {};
    let origin = this.getOrigin(event);
    let allowedOrigin = this.getAllowedOrigin(origin);
    headers['Access-Control-Allow-Origin'] = allowedOrigin
      || this.allowOrigins[0];
    headers['Access-Control-Allow-Credentials'] = true;
    headers['Access-Control-Allow-Headers'] = 'Content-Type';
    return headers;
  }

  getOrigin(event) {
    let origin;
    if (event && event.headers) {
      if (event.headers.origin) {
        console.info('CorsFilter.getOrigin, event.headers.origin:', event.headers.origin);
        origin = event.headers.origin;
      } else if (event.headers.Origin) {
        console.info('CorsFilter.getOrigin, event.headers.Origin:', event.headers.Origin);
        origin = event.headers.Origin;
      }
    }
    return origin;
  }

  getAllowedOrigin(origin) {
    let allowedOrigin = this.allowOrigins[0];
    if (!origin) return allowedOrigin;
    this.allowOrigins.forEach(o => {
      if (o == origin) allowedOrigin = o;
    });
    return allowedOrigin;
  }

}

module.exports = new CorsFilter();
module.exports.CorsFilter = CorsFilter;
