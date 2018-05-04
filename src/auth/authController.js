
const { OAuth2Client } = require('google-auth-library');
const clientId = '443828965425-t3v4iklfup671bkbdmsulklq59eopatg.apps.googleusercontent.com';
const client = new OAuth2Client(clientId);

class AuthController {

  verifyIdToken(event) {
    const body = JSON.parse(event.body) || {};
    const idToken = body.idToken;
    console.log('body:', event.body);
    console.log('idToken:', idToken);
    return client.verifyIdToken({
      idToken,
      audience: clientId
    }).then(ticket => {
      const payload = ticket.getPayload();
      const userid = payload['sub'];
      console.log('userid:', userid);
    }).then(() => {
      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        }
      }
    });
  }

}

module.exports = new AuthController();
module.exports.AuthController = AuthController;
