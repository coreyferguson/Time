
class MockFirebaseAdmin {

  constructor() {
    this._auth = new MockAuth();
  }

  auth() {
    return this._auth;
  }

}

class MockAuth {
  verifyIdToken() { return {}; }
}

module.exports = new MockFirebaseAdmin();
