const fs = require('fs');
const inquirer = require('inquirer');

var config = {}
if (fs.existsSync('src/config.json')) {
  config = require('../src/config.json');
}

inquirer.prompt([
  {
    name: 'endPoint',
    message: 'Enter your Skygear end point URL:',
    validate: function(endPoint) {
      if (endPoint.slice(-1) === '/') {
        return true;
      } else {
        return 'Error: end point must end with a trailing slash.';
      }
    }
  },
  {
    name: 'apiKey',
    message: 'Enter your Skygear API key:',
  }
]).then(function(answers) {
  config.skygearConfig = {
    endPoint: answers.endPoint,
    apiKey: answers.apiKey
  };
  fs.writeFileSync(
    'src/config.json',
    JSON.stringify(config, null, 2)
  );
  console.log('Skygear configuration success!');
});
