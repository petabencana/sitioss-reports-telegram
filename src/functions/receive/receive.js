import telegram from '../../lib/telegram/';
import messages from '../../lib/telegram/messages';
import cards from '../../lib/cards/';

/**
 * Receive object for incoming Telegram direct message interactions
 * @param {Object} config - telegram parameters
 * @return {Object} Function methods
 **/
export default function(config) {
  let methods = {};
  /**
    * Classifies incoming direct messages by keyword
    * @function _filter
    * @param {Object} messageEvent - Telegram message event object
    * @return {String} - Type of message
  **/
  methods._classify = function(messageEvent) {
    // first check this isn't from the bot
    const re = new RegExp(/\/flood/gi);
    if (re.exec(messageEvent.message_create.message_data.text) !== null) {
      return 'flood';
    } else {
      return null;
    }
  };
  /**
    * Issues default reply message to user
    * @function _sendDefault
    * @param {Number} userId - Telegram user ID
    * @return {Object} - Promise that message issued
  **/
  methods._sendDefault = (userId) => new Promise((resolve, reject) => {
    telegram(config).sendMessage(messages(config).default(
      config.app.default_lang, userId))
      .then((response) => resolve(response))
      .catch((err) => {
        reject(new Error(`Error sending message, response `
        + `from Telegram was: ` + err));
      });
  });
  /**
    * Issues card reply message to user
    * @function _sendCard
    * @param {Number} userId - Telegram user ID
    * @return {Object} - Promise that message issued
  **/
  methods._sendCard = (userId) => new Promise((resolve, reject) => {
    cards(config).getCardLink(userId.toString(), 'telegram',
      config.app.default_lang)
      .then((cardId) => {
          // Send message with card link
          telegram(config).sendMessage(messages(config).card(
            config.app.default_lang, userId, cardId))
            .catch((err) => {
              reject(new Error(`Error sending message, response `
            + `from Telegram was: ` + err));
          });
      })
      .catch((err) => {
        reject(err);
      });
  });
  /**
    * Process incoming message and issue reply message if required
    * @function process
    * @param {Object} event - Event object
    * @return {Object} - Promise that all messages issued
  **/
  methods.process = (event) => new Promise((resolve, reject) => {
    let replies = []; // Array of replies for this event
    // loop through direct messages
    event.body.direct_message_events.forEach(function(messageEvent) {
      // check this isn't from the bot
      if (messageEvent.type === 'message_create') {
        // User id
        let userId = messageEvent.message_create.sender_id;
        // Respond based on user input
        switch (methods._classify(messageEvent)) {
          // Send the user a card
          case 'flood':
            // Get a card link
            replies.push(methods._sendCard(userId));
            break;
          // Send the user the default message
          default:
            replies.push(methods._sendDefault(userId));
            break;
        }
      }
    });
    Promise.all(replies).then((values) => {
      resolve(values);
    }).catch((err) => {
      reject(err);
    });
  });
  return methods;
}

