
const clientService = require('../../../../src/oauth/service/clientService');
const clientRepository = require('../../../../src/oauth/dao/clientRepository');
const { expect, sinon } = require('../../../support/TestUtils');
const LocalDynamoFacade = require('local-dynamo-facade');
const path = require('path');
const serverlessConfig = require('../../../../serverless.yml');

describe('clientService integration test', () => {

  const facade = new LocalDynamoFacade(serverlessConfig);
  let dynamodb, clientTableName;
  let sandbox = sinon.sandbox.create();

  before(function() {
    this.timeout(5000);
    dynamodb = clientRepository._dynamodb;
    clientTableName = clientRepository._clientTableName;
    let newDynamoDb = facade.start();
    clientRepository._dynamodb = newDynamoDb;
    clientRepository._clientTableName = 'client-test';
    return facade.createTable('clientTable', 'client-test');
  });

  after(() => {
    clientRepository._dynamodb = dynamodb;
    clientRepository._clientTableName = clientTableName;
    facade.stop();
  });

  beforeEach(() => {
    sandbox.stub(console, 'info');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('findOne, no existing client', () => {
    return expect(clientService.findOne('1234')).to.eventually.be.null;
  });

  it('save new client & find & delete', () => {
    const createdDate = new Date();
    return clientService.save({
      id: '1234',
      secret: 'secretValue',
      redirectUris: [
        'redirectUriValue1',
        'redirectUriValue2'
      ],
      grants: [
        'grantValue1',
        'grantValue2'
      ],
      createdOn: new Date()
    }).then(() => {
      return clientService.findOne('1234').then(client => {
        expect(client.id).to.eql('1234');
        expect(client.secret).to.eql('secretValue');
        expect(client.redirectUris).to.eql([
          'redirectUriValue1',
          'redirectUriValue2'
        ]);
        expect(client.grants).to.eql([
          'grantValue1',
          'grantValue2'
        ]);
        expect(client.createdOn.toISOString()).to.eql(createdDate.toISOString());
      });
    }).then(() => {
      return clientService.delete('1234');
    }).then(() => {
      return clientService.findOne('1234');
    }).then(client => {
      expect(client).to.be.null;
    });
  });

  it('save existing client', () => {
    const createdOn = new Date();
    return clientService.save({
      id: '1234',
      secret: 'oldSecretValue',
      redirectUris: [
        'oldRedirectUrisValue1',
        'oldRedirectUrisValue2'
      ],
      grants: [
        'oldGrantsValue1',
        'oldGrantsValue2'
      ],
      createdOn
    }).then(() => {
      return clientService.save({
        id: '1234',
        secret: 'newSecretValue',
        redirectUris: [
          'redirectUriValue1',
          'redirectUriValue2'
        ],
        grants: [
          'grantValue1',
          'grantValue2'
        ]
      });
    }).then(() => {
      return clientService.findOne('1234').then(client => {
        expect(client.id).to.eql('1234');
        expect(client.secret).to.eql('newSecretValue');
        expect(client.redirectUris).to.eql([
          'redirectUriValue1',
          'redirectUriValue2'
        ]);
        expect(client.grants).to.eql([
          'grantValue1',
          'grantValue2'
        ]);
        expect(client.createdOn.toISOString()).to.eql(createdOn.toISOString());
      });
    });
  });

});
