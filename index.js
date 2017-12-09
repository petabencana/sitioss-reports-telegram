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

// GRASP operating regions
const instance_regions = {
  chn: 'chennai'
  jbd: 'jakarta',
  sby: 'surabaya',
  bdg: 'bandung',
  srg: 'semarang'
};


// Welcome message to user
const initiate = {
 'en': 'Welcome! Type in /flood to request a card link',
 'id': 'Selamat datang! ketik /banjir untuk meminta link kartu.'
};

// Replies to user
const replies = {
 'en': 'Hi! Report using this link, thanks.',
 'id': 'Hi! Laporkan menggunakan link ini. Terima kasih.'
};

// Confirmation message to user
const confirmations = {
  'en': 'Hi! Thanks for your report. I\'ve put it on the map.',
  'id': 'Hi! Terima kasih atas laporan Anda. Aku sudah menaruhnya di peta.'
  'in': 'Hi! Terima kasih atas laporan Anda. Aku sudah menaruhnya di peta.'
};

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData, senderID) {
  request({
    uri: 'https://api.telegram.org/bot' + process.env.BOT_TOKEN + '/sendmessage?text=' + messageData + '&chat_id=' + senderID,
    method: 'POST'
  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var responseBody = JSON.parse(body);
      var result = responseBody.result;
      var recipientId = result.chat.id;
      var messageId = result.message_id;

      if (messageId) {
        console.log('Successfully sent message with id %s to recipient %s',
          messageId, recipientId);
      } else {
      console.log('Successfully called Send API for recipient %s',
        recipientId);
      }
    } else {
      console.error('Failed calling Send API', response.statusCode, body.error_code, body.description);
    }
  });
}

// Webhook handler - This is the method called by Telegram when user sends a message
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

module.exports.reply = (event, context, callback) => {
  //This module listens in to SNS Telegram topic and reads the message published
  var message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + JSON.stringify(message));

  //Construct the confirmation message to be sent to the user
  var messageText = confirmations[message.language];
  messageText += '\n' + process.env.MAPSERVER + instance_regions[message.implementation_area] + '/' + message.report_id;

  //Call Send API to confirmation message with report link to the user
  callSendAPI(messageText, message.username);
};
