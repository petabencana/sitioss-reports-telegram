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
      const response = {
        statusCode: 200,
        headers: {},
        body: JSON.stringify({}),
      };
      // Send telegram a reply immediately to stop multiple messages to user.
      callback(null, response);

      const receive = new Receive(config);
      receive.process(JSON.parse(event.body))
        .then((res) => {
          console.log('Reply sent to user');
        })
        .catch((err) => {
          console.log('Error in Telegram reply. ' + err);
          callback(null);
        });
};
