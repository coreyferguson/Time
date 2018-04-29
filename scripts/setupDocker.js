
const { spawn } = require('child_process');
const path = require('path');

spawn(
  'docker',
  [
    'build',
    '-t=overattribution/time-api-cli',
    '-f=cli.dockerfile',
    '.'
  ],
  {
    cwd: path.join(__dirname, '../docker'),
    stdio: 'inherit'
  }
);
