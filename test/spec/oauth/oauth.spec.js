
const { expect } = require('../../support/TestUtils');

const oauth = require('../../../src/oauth');

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

describe('oauth', () => {

  let authorizationCode, accessToken;

  it('retrieve authorization code', () => {
    let request = new Request({
      method: 'POST',
      query: {
        response_type: 'code',
        client_id: '1234',
        state: '.'
      },
      headers: {
        userId: '1234'
      }
    });
    let response = new Response({
      headers: {}
    });
    return oauth.authorize(request, response).then(response => {
      expect(response).to.have.property('authorizationCode');
      authorizationCode = response.authorizationCode;
    });
  });

  it('exchange authorization code for access token', () => {
    let request = new Request({
      method: 'POST',
      query: {},
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 33
      },
      body: {
        'client_id': '1234',
        'client_secret': 'abcd',
        'grant_type': 'authorization_code',
        'code': authorizationCode,
        'redirect_uri': 'https://localhost:8080/oauth/redirect'
      }
    });
    let response = new Response({
      headers: {}
    });
    return oauth.token(request, response).then(token => {
      accessToken = token.accessToken;
      expect(token).to.have.property('accessToken');
      expect(token).to.have.property('accessTokenExpiresAt');
      expect(token).to.have.property('refreshToken');
      expect(token).to.have.property('refreshTokenExpiresAt');
    })
  });

  it('authenticate with access token', () => {
    let request = new Request({
      method: 'GET',
      query: {},
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      body: {}
    });
    let response = new Response({
      headers: {}
    });
    return oauth.authenticate(request, response);
  });

});
