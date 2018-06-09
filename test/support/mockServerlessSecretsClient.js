
class MockServerlessSecretsClient {
  load() { return Promise.resolve(true); }
}

module.exports = new MockServerlessSecretsClient();
