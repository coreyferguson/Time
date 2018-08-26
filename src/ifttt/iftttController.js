
const axios = require('axios');

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
    const iftttServiceKey = process.env.IFTTT_SERVICE_KEY;
    if (iftttServiceKey !== event.headers['Ifttt-Channel-Key'] ||
        iftttServiceKey !== event.headers['Ifttt-Service-Key']) {
      return Promise.resolve({ statusCode: 401 });
    }
    return Promise.resolve({ statusCode: 200 });
  }

}

module.exports = new IftttController();
