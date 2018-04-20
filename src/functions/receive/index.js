// Function for sending Telegram messages
// import Receive from './receive';
import config from '../../config';
import Telegram from '../../lib/telegram';

const response = {
  statusCode: 200,
  headers: {},
  body: JSON.stringify({}),
};

const error = {
  statusCode: 500,
  headers: {},
  body: JSON.stringify({message: 'Error with chatbot'}),
};


/**
 * Webhook handler for incoming Telegram messages
 * @function telegramWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
export default (event, context, callback) => {
      console.log('Lambda handler loading')
      console.log('Incoming payload: ', event.message)
      console.log('Incoming payload: ', event.body)

      // Send telegram a reply immediately to stop multiple messages to user.
      callback(null, response);

      const telegram = new Telegram(config);

      telegram.process(JSON.parse(event.body))
        .then((res) => {
          console.log('Reply sent to user');
        })
        .catch((err) => {
          console.log('Error in Telegram reply. ' + err);
          callback(null, error);
        });
};
