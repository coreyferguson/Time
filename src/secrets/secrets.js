
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

class Secrets {

  constructor(options) {
    options = options || {};
    this._cache = new Map();
    this._inProgress = new Map();
    this._env = options.env || process.env;
    this._ssm = options.ssm || new AWS.SSM();
  }

  load(names) {
    const neverFetched = [];
    const inProgress = [];
    names.forEach(name => {
      const isInCache = this._cache.has(name);
      const isInProgress = this._inProgress.has(name);
      if (!isInCache && !isInProgress) neverFetched.push(name);
      if (isInProgress) inProgress.push(name);
    });
    const awsPromise = this._fetchFromAWS(neverFetched);
    neverFetched.forEach(name => this._inProgress.set(name, awsPromise));
    return awsPromise.then(params => {
      // cache params from aws
      for (let param of params) {
        const key = param.Name.replace(`/time-api/${this._env.stage}/`, '');
        this._cache.set(key, param.Value);
        this._inProgress.delete(key);
      };
    }).then(() => {
      return Promise.all(inProgress);
    }).then(() => {
      // return values from cache
      return names.map(name => {
        return { name, value: this._cache.get(name) }
      });
    });
  }

  /**
   * Fetch list of parameter names from AWS SSM Parameter Store.
   * @param {Array} names list of names to retrieve
   */
  _fetchFromAWS(names) {
    if (names.length === 0) return Promise.resolve([]);
    return new Promise((resolve, reject) => {
      this._ssm.getParameters({
        Names: names.map(name => `/time-api/${this._env.stage}/${name}`),
        WithDecryption: true
      }, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data.InvalidParameters.length > 0) {
          const msg =
            'Invalid parameters: ' +
            JSON.stringify(data.InvalidParameters);
          reject(new Error(msg));
          return;
        }
        resolve(data.Parameters);
      });
    });
  }

}

module.exports = new Secrets();
module.exports.Secrets = Secrets;
