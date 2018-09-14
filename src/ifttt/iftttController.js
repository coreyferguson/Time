
const axios = require('axios');
const jwt = require('jsonwebtoken');
const userTimerService = require('../timer/service/userTimerService');

class IftttController {

  userInfo(event) {
    const endpoint = 'https://overattribution.auth0.com/userinfo';
    const query = '?access_token=' + event.headers['Authorization'].slice(7);
    return axios.get(endpoint + query).then(res => {
      return {
        statusCode: 200,
        body: {
          data: {
            id: res.data.sub,
            name: res.data.name
          }
        }
      };
    });
  }

  status(event) {
    const iftttServiceKey = this.getIftttServiceKey();
    if (iftttServiceKey !== event.headers['Ifttt-Channel-Key'] ||
        iftttServiceKey !== event.headers['Ifttt-Service-Key']) {
      return Promise.resolve({ statusCode: 401 });
    }
    return Promise.resolve({ statusCode: 200 });
  }

  timerStart(event) {
    console.log(JSON.stringify(event));
    const body = JSON.parse(event.body);
    const token = event.headers['Authorization'].slice(7);
    const certificate = process.env.AUTH0_TIME_CERTIFICATE;
    return new Promise((resolve, reject) => {
      jwt.verify(token, certificate, {
        algorithms: ['RS256'],
        audience: 'https://time.overattribution.com',
        issuer: 'https://overattribution.auth0.com/'
      }, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            resolve({ statusCode: 401 });
          } else {
            reject(err);
          }
        } else {
          const userId = decoded.sub;
          const timerId = body.actionFields.timer_name;
          userTimerService.startLog(userId, timerId);
          resolve({ statusCode: 200 });
        }
      });
    });
  }

  timerStop(event) {
    const body = JSON.parse(event.body);
    const token = event.headers['Authorization'].slice(7);
    const certificate = process.env.AUTH0_TIME_CERTIFICATE;
    return new Promise((resolve, reject) => {
      jwt.verify(token, certificate, {
        algorithms: ['RS256'],
        audience: 'https://time.overattribution.com',
        issuer: 'https://overattribution.auth0.com/'
      }, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            resolve({ statusCode: 401 });
          } else {
            reject(err);
          }
        } else {
          const userId = decoded.sub;
          const timerId = body.actionFields.timer_name;
          userTimerService.stopLog(userId, timerId);
          resolve({
            statusCode: 200
          });
        }
      });
    });
  }

  getIftttServiceKey() {
    return process.env.IFTTT_SERVICE_KEY;
  }

}

module.exports = new IftttController();
