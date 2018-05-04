
const OAuth2Server = require('oauth2-server');

class OAuth {

  constructor() {
    this.users = {
      '1234': {
        id: '1234',
        firstName: 'Corey',
        lastName: 'Ferguson'
      }
    };
    this.codes = {};
    this.clients = {
      '1234': {
        id: '1234',
        redirectUris: [
          'https://localhost:8080/oauth/redirect'
        ],
        grants: [
          'authorization_code'
        ]
      }
    };
    this.tokens = {};
    this.oauth = new OAuth2Server({
      model: {

        getAccessToken: (accessToken) => {
          return Promise.resolve(this.tokens[accessToken]);
        },

        getAuthorizationCode: (authorizationCode) => {
          return Promise.resolve(this.codes[authorizationCode]);
        },

        getClient: (clientId, clientSecret) => {
          return Promise.resolve(this.clients[clientId]);
        },

        saveToken: (token, client, user) => {
          token.client = client;
          token.user = user;
          this.tokens[token.accessToken] = token;
          return Promise.resolve(token);
        },

        saveAuthorizationCode: (code, client, user) => {
          code.client = client;
          code.user = user;
          this.codes[code.authorizationCode] = code;
          return Promise.resolve(code);
        },

        revokeAuthorizationCode: (code) => {
          if (this.codes[code.authorizationCode]) {
            delete this.codes[code];
            return Promise.resolve(true);
          } else {
            return Promise.resolve(false);
          }
        }

      }
    });
  }

  authenticate(request, response) {
    return this.oauth.authenticate(request, response);
  }

  authorize(request, response) {
    const options = {
      authenticateHandler: {
        handle: (data) => {
          return this.users[data.headers.userid];
        }
      }
    };
    return this.oauth.authorize(request, response, options);
  }

  token(request, response) {
    return this.oauth.token(request, response);
  }

}

module.exports = new OAuth();
module.exports.OAuth = OAuth;
