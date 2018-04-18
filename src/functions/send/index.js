import Telegram from '../../lib/telegram';
import config from '../../config';

export default (event, context, callback) => {
  const telegram = new Telegram(config);

  const body = JSON.parse(event.body);

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
