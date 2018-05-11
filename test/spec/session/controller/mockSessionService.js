
class MockSessionService {
  findOne() { return Promise.resolve({}); }
  save() { return Promise.resolve({}); }
  delete() { return Promise.resolve({}); }
}

module.exports = new MockSessionService();
