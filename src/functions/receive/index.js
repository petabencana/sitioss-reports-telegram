// Config
require('dotenv').config();

// Function for sending Telegram messages
import Receive from './receive';
import config from '../../config';

/**
 * Webhook handler for incoming Telegram messages
 * @function telegramWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
export default (event, context, callback) => {
      const receive = new Receive(config);

      receive.process(event)
        .then((res) => callback(null))
        .catch((err) => {
          console.log('Error in Telegram reply. ' + err);
          callback(null);
        });
};
