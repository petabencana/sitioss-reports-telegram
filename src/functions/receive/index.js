import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import {handleResponse} from '../../lib/util';
import Telegram from '../../lib/telegram';

const _bodySchema = Joi.object(); // Check telegram object exists

/**
 * Webhook handler for incoming Telegram messages
 * @function telegramWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
export default async (event, context, callback) => {
  try {
    console.log('Lambda handler loading');
    console.log('Incoming payload: ', event.body);
    // Validate body
    const payload = await Joi.validate(event.body, _bodySchema);
    // Reply to Telegram directly to stop duplicate messages
    handleResponse(callback, 200, {});
    // Class
    const telegram = new Telegram(config);
    // Send reply message
    await telegram.sendReply(payload.message);
    console.log('Message sent');
  } catch (err) {
    if (err.isJoi) {
      // tell Telegram to ingore errors, but stop process
      handleResponse(callback, 200, {});
      console.log('Validation error: ' + err.details[0].message);
    } else {
      // tell Telegram to ignore errors, but stop process
      console.log('Error ' + err.message);
      handleResponse(callback, 200, {});
    }
  }
};
