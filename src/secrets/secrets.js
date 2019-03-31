
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-west-2' });

const logger = require('../logger');

class Secrets {

  constructor(options) {
    options = options || {};
    this._cache = new Map();
    this._inProgress = new Map();
    this._env = options.env || process.env;
    this._ssm = options.ssm || new AWS.SSM();
    this._logger = options.logger || logger;
  }

  load(names) {
    const timer = this._logger.startTimer('secrets.load');
    // fetch parameters that have never been fetched before
    const neverFetched = [];
    // re-use promises for previously requested parameters
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
      this._cacheAWSParams(params);
    }).then(() => {
      return Promise.all(inProgress);
    }).then(() => {
      const result = this._toMap(names);
      timer.stop(true);
      return result;
    }).catch(err => {
      timer.stop(false);
      throw err;
    });
  }

  /**
   * Fetch list of parameter names from AWS SSM Parameter Store.
   * @param {Array} names list of names to retrieve
   */
  _fetchFromAWS(names) {
    if (names.length === 0) return Promise.resolve([]);
    this._logger.info('Retrieving secrets from AWS SSM', names);
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

  /**
   * Convert given secret names into a Map<secretName, secretValue>.
   */
  _toMap(names) {
    const result = new Map();
    for (let name of names) result.set(name, this._cache.get(name));
    return result;
  }

  /**
   * Cache the given parameters from AWS and stop tracking existing promises.
   */
  _cacheAWSParams(params) {
    for (let param of params) {
      const key = param.Name.replace(`/time-api/${this._env.stage}/`, '');
      this._cache.set(key, param.Value);
      this._inProgress.delete(key);
    };
  }

}

module.exports = new Secrets();
module.exports.Secrets = Secrets;
