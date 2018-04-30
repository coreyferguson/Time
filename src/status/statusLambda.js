
const controller = require('./statusController');

module.exports.status = (event, context, callback) => {
  return controller.status(event).then(response => {
    if (response.body) response.body = JSON.stringify(response.body);
    callback(null, response);
  }).catch(error => {
    if (error) console.info('error:', JSON.stringify(error));
    if (error && error.stack)
      console.info('error stack:', JSON.stringify(error.stack));
    callback(error, error.response);
  });
};
