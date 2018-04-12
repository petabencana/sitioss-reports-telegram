// Config
require('dotenv').config();

// Function for sending Telegram messages
import Receive from './receive';

const config = {
  botToken: process.env.BOT_TOKEN,
  cardApi: process.env.CARD_API,
  cardApiKey: process.env.CARD_API_KEY,
  defaultLanguage: process.env.DEFAULT_LANGUAGE,
  mapUrl: process.env.MAP_URL,
  telegramEndpoint: process.env.telegramEndpoint,
};

/**
 * Webhook handler for incoming Telegram messages
 * @function telegramWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
module.exports.telegramWebhook = (event, context, callback) => {
      const receive = new Receive(config);

      receive.process(event)
        .then((res) => callback(null))
        .catch((err) => {
          console.log('Error in Telegram reply. ' + err);
          callback(null);
        });
};
