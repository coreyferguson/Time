
class MockUserService {
  findByExternalIds() { return Promise.resolve(); }
  save() { return Promise.resolve(); }
}

module.exports = new MockUserService();
