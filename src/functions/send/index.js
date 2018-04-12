/* import telegram from '../../lib/telegram/';
import messages from '../../lib/telegram/messages';

const config = {
    oauth: {
          token: process.env.BOT_TOKEN,
        },
    app: {
          defaultLang: process.env.DEFAULT_LANG,
        },
};

module.exports.telegramReply = (event, context, callback) => {
  // This module listens to SNS Telegram topic and reads the message published
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + JSON.stringify(message));
  // Prepare message
  let msg = messages(config).thanks(config.app.defaultLang, message.username,
    message.report_id);
  // Send message to user
  telegram(config).sendMessage(msg)
    .then((response) => console.log('Message sent.'))
    .catch((err) => console.log(`Error sending message, response from Twitter `
    + `was: ` + JSON.stringify(err)));
};*/

