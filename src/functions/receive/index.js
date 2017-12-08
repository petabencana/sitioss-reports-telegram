'use strict';

const request = require('request');
require('dotenv').config({silent:true});

// GRASP card
const options = {
  host: process.env.SERVER,
  path: '/cards',
  method: 'POST',
  port: 80,
  headers: {
    'x-api-key': process.env.X_API_KEY,
    'Content-Type': 'application/json'
  }
};


/**
 * Webhook handler for incoming Telegram messages.
 * @function webhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
module.exports.webhook = (event, context, callback) => {
  if (event.message && event.message.text && (event.message.text == "/flood" || event.message.text == "/prep")) {
    // Form JSON request body
    var chatID = event.message.chat.id;
    console.log('Received flood report request via Telegram from: ' + chatID);
    var card_request = {
      "username": chatID.toString(),
      "network": "telegram",
      "language": process.env.DEFAULT_LANG
    };

    // Get a card from Cognicity server
    request({
      url: options.host + options.path,
      method: options.method,
      headers: options.headers,
      port: options.port,
      json: true,
      body: card_request
    }, function(error, response, body){
      if (!error && response.statusCode === 200){
        console.log('Fetched card id: ' + body.cardId);
        //Construct the text message to be sent to the user
        var messageText = replies[process.env.DEFAULT_LANG];
        messageText += "\n" + process.env.CARD_PATH + event.message.text + "/" + body.cardId;
        callSendAPI(messageText, chatID);
        var response = {
            statusCode: 200,
            headers: {},
            body: JSON.stringify({})
        };
        console.log('Sending success API Gateway response');
        callback(null, response); // Send success code with empty json to avoid duplicate POST calls
      } else {
        var err = 'Error getting card: ' + JSON.stringify(error) + JSON.stringify(response);
        callback(err, null); // Return error
      }
    });
  }
};
