import Joi from 'joi'; // validation

// Local objects
import config from '../../config';
import Telegram from '../../lib/telegram';

const _bodySchema = Joi.object().keys({
  userId: Joi.number(),
  instanceRegionCode: Joi.string(),
});

export default async (event, context, callback) => {
  // Log statements
  console.log('\n\nLoading Notify handler\n\n');
  console.log('Incoming body: ' + event.body);
  const telegram = new Telegram(config);

  const body = await Joi.validate(event.body, _bodySchema);

  const response = {
    statusCode: 200,
    headers: {},
    body: JSON.stringify({message: 'Notification sent to user'}),
  };

  const error = {
    statusCode: 500,
    headers: {},
    body: JSON.stringify({message: 'Error sending notification to user'}),
  };

  telegram.sendThanks(body).then((res) => {
    console.log('Message sent');
    callback(null, response);
  }).catch((err) => {
    console.log('Error sending message. ' + err.message);
    callback(null, error);
  });
};
