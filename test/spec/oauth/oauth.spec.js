
const { expect } = require('../../support/TestUtils');

const oauth = require('../../../src/oauth');

const OAuth2Server = require('oauth2-server');
const Request = OAuth2Server.Request;
const Response = OAuth2Server.Response;

describe.only('oauth', () => {

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
        // 'Content-Type': 'application/x-www-form-urlencoded',
        // 'Content-Length': 33
      }
    });

    let response = new Response({
      headers: {}
    });

    return expect(oauth.authorize(request, response))
      .to.eventually.have.property('authorizationCode');

  });

});
