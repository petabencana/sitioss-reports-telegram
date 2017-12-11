import telegram from '../../lib/telegram/';
import messages from '../../lib/telegram/messages';

onst config = {
    oauth: { 
          token: process.env.BOT_TOKEN,
        },
    app: {
          default_lang: process.env.DEFAULT_LANG,
        },
    server: {
          card_endpoint: `https://cards.riskmap.us/flood/`,
          card_api: `https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards`,
          api_key: process.env.X_API_KEY,
        },
};

module.exports.telegramReply = (event, context, callback) => {
  // This module listens to SNS Telegram topic and reads the message published
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + JSON.stringify(message));
  // Prepare message
  let msg = messages(config).thanks('en', message.username, message.report_id);
  // Send message to user
  telegram(config).sendMessage(msg)
    .then((response) => console.log('Message sent.'))
    .catch((err) => console.log(`Error sending message, response from Twitter `
    + `was: ` + JSON.stringify(err))); 
};

