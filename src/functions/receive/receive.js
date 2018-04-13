import Telegram from '../../lib/telegram';

/**
 * Receive object for incoming Telegram message interactions
 * @param {Object} config - Telegram parameters
 * @return {Object} Function methods
 **/
export default class Receive {
  /**
   * constructor - constructor for Receive class
   * @param {Object} config - Configuration object
   */
  constructor(config) {
    this.config = config;
    this.telegram = new Telegram(this.config);
  }

  /**
    * Classifies incoming direct messages by keyword
    * @function _classify
    * @param {String} text - Telegram message text from user
    * @return {String} - Type of message
  **/
  _classify(text) {
    // filter the message by keyword
    const re = new RegExp(/\/flood/gi);
    if (re.exec(text) !== null) {
      return 'flood';
    } else {
      return null;
    }
  }

  /**
    * Process incoming message and issue reply message if required
    * @function process
    * @param {Object} event - Lambda event object
    * @return {Promise} - Response from send message request
  **/
  process(event) {
    console.log(event);
    const message = event.message; // The incoming Telegram message object
    // Build properties object for telegram class methods
    const properties = {
      userId: String(message.chat.id),
      language: this.config.DEFAULT_LANGUAGE,
    };
    // Reply based on message content
    switch (this._classify(message.text)) {
      case 'flood':
        return (this.telegram.sendCard(properties));
      default:
        return (this.telegram.sendDefault(properties));
    }
  }
}
