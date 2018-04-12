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
    * @param {Object} message - Telegram message event object
    * @return {String} - Type of message
  **/
  methods._classify = function(message) {
    // first check this isn't from the bot
    const re = new RegExp(/\/flood/gi);
    if (re.exec(message.text) !== null) {
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
        const message = event.message;
        // Get UserId (Telegram Chat ID)
        let userId = message.chatId;
        // Respond based on user input
        switch (methods._classify(message)) {
          // Send the user a card
          case 'flood':
            // Get a card link
            methods._sendCard(userId)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
            break;
          // Send the user the default message
          default:
            // Get a card link
            methods._sendDefault(userId)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
            break;
        }
  });
  return methods;
}

