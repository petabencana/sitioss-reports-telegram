// Config
require('dotenv').config();

// Function for sending Telegram messages
import Receive from './receive';

const config = {
  botToken: 'TOKEN',
  cardsApi: 'https://data.cognicity.com/cards/',
  cardsApiKey: '123',
  cardsUrl: 'https://cards.cognicity.com/',
  defaultLanguage: process.env.DEFAULT_LANGUAGE,
  mapUrl: 'https://map.cognicity.com/',
  telegramEndpoint: 'https://api.telegram.org/bot',
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
