// Config
require('dotenv').config();

// Function for sending Telegram messages
import receive from './receive';

const config = {
  oauth: {
    token: process.env.BOT_TOKEN,
  },
  app: {
    default_lang: process.env.DEFAULT_LANG,
    mapUrl: process.env.MAP_URL,
  },
  server: {
    cardApi: process.env.CARD_API,
    apiKey: process.env.X_API_KEY,
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
      receive(config).process(event)
        .then(callback(null))
        .catch((err) => {
          console.log('error is here in post: ' + err);
          callback(null);
        });
};
