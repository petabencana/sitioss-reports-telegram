import Telegram from '../../lib/telegram';
import config from '../../config';

export default (event, context, callback) => {
  const telegram = new Telegram(config);

  const message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + JSON.stringify(message));

  telegram.sendThanks(
    {
      userId: message.username,
      reportId: message.report_id,
      language: config.DEFAULT_LANGUAGE,
    }
  ).then((response) => {
    console.log('Message sent');
  }).catch((err) => {
    console.log('Error sending message. ' + err.message);
  });
};
