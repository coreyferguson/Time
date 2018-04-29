
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');

spawn(
  'docker',
  [
    'run',
    '--rm',
    '-it',
    `-v=${path.join(os.homedir(), '.aws')}:/root/.aws`,
    'overattribution/time-api-cli',
    'zsh'
  ],
  {
    stdio: 'inherit'
  }
);
