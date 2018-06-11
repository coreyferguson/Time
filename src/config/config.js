
const path = require('path');
const environmentConfig = require('./environment-config.yml');

/**
 * Properties:
 * - default: default properties for all environments
 * - env: properties for current environment
 */
class Config {

  constructor(options) {
    options = options || {};
    this._stage = options.stage || process.env.stage;
    // layer environment config on top of default
    this.all = environmentConfig;
    this.test = this.all.test;
    this.preprod = this.all.preprod;
    this.env = Object.assign({}, this.preprod, this.all[this._stage]);
  }

}

// export singleton
module.exports = new Config();
module.exports.Config = Config;
