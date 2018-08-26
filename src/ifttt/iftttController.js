
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

}

module.exports = new IftttController();
