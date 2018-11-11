const platform = require('os').platform();
const execSync = require('child_process').execSync;

switch(platform) {
  case 'linux':
    execSync('xdg-open ./demo/login.html');
    break;
  case 'darwin':
    execSync('open ./demo/login.html');
    break;
  case 'win32':
    execSync('start ./demo/login.html');
    break;
}
