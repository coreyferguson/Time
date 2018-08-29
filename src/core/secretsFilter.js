
const secretsClient = require('serverless-secrets/client');
secretsClient.init(require('../../.serverless-secrets.json'));

let cachedPromise;

module.exports = function(data) {
  console.info('secretsFilter.process');
  if (cachedPromise) return cachedPromise;
  cachedPromise = secretsClient.load().then(() => true);
  return cachedPromise;
}
