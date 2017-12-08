import request from 'request';
import crypto from 'crypto';
/**
 * Telegram object for direct message interactions
 * @param {Object} config - telegram parameters
 * @return {Object} Function methods
 **/
export default function(config) {
  let methods = {};
  /**
    * Prepares Telegram message request object
    * @function _prepareRequest
    * @param {Object} body - message body object
    * @return {Object} - Twitter message request object
  **/
  methods._prepareRequest = function(body) {
    let requestOptions = {
      url: config.app.telegram_endpoint,
      oauth: config.oauth, // verify oauth context for telegram
      json: true,
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    // Log the message
    console.log('Outgoing DMessage object: ' + JSON.stringify(body));
    return requestOptions;
  };
// TODO: verify Telegram CRC
  /**
    * Prepares Telegram CRC response
    * @function crcResponse
    * @param {Object} token - request token
    * @return {Object} - Telegram CRC response
  **/
  methods.crcResponse = (token) => new Promise((resolve, reject) => {
    let hash = crypto.createHmac('sha256', config.app.consumer_secret)
      .update(token)
      .digest('base64');
    let hashstring = 'sha256=' + hash;
    let response = JSON.parse('{"response_token": "'+hashstring+'"}');
    resolve(response);
  });

  /**
   * Send direct Telegram message
   * @function sendMessage
   * @param {Object} body - Telegram direct message body object
   * @return {Object} - Response object from Telegram
   **/
  methods.sendMessage = (body) => new Promise((resolve, reject) => {
    let opts = methods._prepareRequest(body);
    // Send the message
    request.post(opts, function(error, response, body) {
      if (!error) {
        resolve(response);
      } else {
        reject(error);
      }
    });
  });
return methods;
}
