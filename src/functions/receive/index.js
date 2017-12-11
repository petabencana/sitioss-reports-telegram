require('dotenv').config();

// Function for sending Telegram messages
import telegram from '../../lib/telegram/';
import receive from './receive';


const config = {
  oauth: {
    token: process.env.BOT_TOKEN,
  },
  app: {
    default_lang: process.env.DEFAULT_LANG,
  },
  server: {
    card_endpoint: `https://cards.riskmap.us/flood/`,
    card_api: `https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards`,
    api_key: process.env.X_API_KEY,
  },
};

/**
 * Webhook handler for incoming Telegram messages
 * @function telegramWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
module.exports.telegramWebhook = (event, context, callback) => {
  if (event.method === 'GET') {
    let crcToken = event.query['crc_token'];
    if (crcToken) {
      telegram(config).crcResponse(crcToken)
        .then((response) => {
          console.log(response);
          console.log(JSON.stringify(response));
          callback(null, response);
        })
        .catch((err) => console.log('error is here: ' + err));
    } else {
      const response = {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({'message':
          `Error: crc_token missing from request.`}),
      };
      callback(null, response);
    }
  } else if (event.method === 'POST') {
      receive(config).process(event)
        .then(callback(null))
        .catch((err) => {
          console.log('error is here in post: ' + err);
          callback(null);
        });
    }
};
