import Telegram from '../../lib/telegram';
import config from '../../config';

export default (event, context, callback) => {
  const telegram = new Telegram(config);

  const body = JSON.parse(event.body);

  telegram.sendThanks(body).then((response) => {
    console.log('Message sent');
  }).catch((err) => {
    console.log('Error sending message. ' + err.message);
  });
};
