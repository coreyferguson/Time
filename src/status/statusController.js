
const AWS = require('aws-sdk');

class StatusController {

  constructor() {
    this._iftttServiceKeyEncrypted = process.env['iftttServiceKey'];
    this._iftttServiceKeyDecrypted = undefined;
  }

  status(event) {
    return this.getIftttServiceKey().then(iftttServiceKey => {
      if (iftttServiceKey !== event.headers['Ifttt-Channel-Key'] ||
          iftttServiceKey !== event.headers['Ifttt-Service-Key']) {
        return Promise.resolve({ statusCode: 401 });
      }
      return Promise.resolve({ statusCode: 200 });
    });
  }

  getIftttServiceKey() {
    if (this._iftttServiceKeyDecrypted)
      return Promise.resolve(this._iftttServiceKeyDecrypted);
    else return new Promise((resolve, reject) => {
      const kms = new AWS.KMS();
      kms.decrypt(
        {
          CiphertextBlob: new Buffer(this._iftttServiceKeyEncrypted, 'base64')
        },
        (err, data) => {
          if (err) reject(err);
          else {
            this._iftttServiceKeyDecrypted = data.Plaintext.toString('ascii');
            resolve(this._iftttServiceKeyDecrypted);
          }
        }
      );
    });
  }

}

module.exports = new StatusController();
