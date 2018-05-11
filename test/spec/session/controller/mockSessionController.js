
class MockSessionController {
  getSession(data) { return Promise.resolve(true); }
}

module.exports = MockSessionController;
