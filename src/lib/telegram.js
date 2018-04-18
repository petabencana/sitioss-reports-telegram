import axios from 'axios';
import messages from './messages';
import Cards from './cards';
/**
 * Class for sending CogniCity messages via Telegram
 * @class Telegram
 * @param {Object} config - telegram parameters
 * @return {Object} Function methods
 **/
export default class Telegram {
  /**
   * constructor for class Telegram
   * @param {Object} config - telegram parameters
   */
  constructor(config) {
    this.config = config;
    this.messages = messages(config);
    this.cards = new Cards(config);
    this.axios = axios;
  }

  /**
    * Prepares Telegram message request object
    * @method _prepareRequest
    * @private
    * @param {String} userId - User or Telegram chat ID for reply
    * @param {String} message - Message to send
    * @return {String} - URI for request
  **/
  _prepareRequest(userId, message) {
    return (this.config.TELEGRAM_ENDPOINT +
            this.config.BOT_TOKEN +
            '/sendmessage?text=' +
            message +
            '&chat_id=' +
            userId
          );
  }

  /**
   * Sends a Telegram message
   * @method _sendMessage
   * @private
   * @param {String} requestString - URI for Telegram API
   * @return {Promise} - Result of post request
   */
  _sendMessage(requestString) {
    return new Promise((resolve, reject) => {
      this.axios.post(requestString, {})
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  /**
   * sendCard - Method to send report card to Telegram user
   * @method sendCard
   * @param {Object} properties - properties of message to send
   * @param {String} properties.userId - User ID or chat ID to send message to
   * @param {String} properties.language - Language of response
   * @return {Promise} Result of _sendMessage request
   */
  sendCard(properties) {
    return new Promise((resolve, reject) => {
      // Get a card id
      this.cards.getCardId({
        userId: properties.userId,
        network: 'telegram',
        language: properties.language,
      }).then((cardId) => {
        // Build the response
        const message = this.messages.card(properties.language, cardId);
        const request = this._prepareRequest(properties.userId, message);
        console.log('request', request);
        // Return the promise
        resolve(this._sendMessage(request));
      }).catch((err) => {
        reject(err);
        });
    });
  }

  /**
   * sendThanks - Method to send report link to Telegram user
   * @method sendThanks
   * @param {Object} properties - properties of message to send
   * @param {String} properties.userId - User ID or chat ID to send message to
   * @param {String} properties.reportId - Report identifier for uniquie link
   * @param {String} properties.language - Language of response
   * @param {String} properties.instanceRegionCode - CogniCity region code
   * @return {Promise} Result of _sendMessage request
   */
  sendThanks(properties) {
    const message = this.messages.thanks(properties.language,
      properties.reportId, properties.instanceRegionCode);
    const request = this._prepareRequest(properties.userId, message);
    return this._sendMessage(request);
  }

  /**
   * sendDefault - Method to send default message Telegram user
   * @method sendDefault
   * @param {Object} properties - properties of message to send
   * @param {String} properties.userId - User ID or chat ID to send message to
   * @param {String} properties.language - Language of response
   * @return {Promise} Result of _sendMessage request
   */
  sendDefault(properties) {
    const message = this.messages.default(properties.language);
    const request = this._prepareRequest(properties.userId, message);
    return this._sendMessage(request);
  }
}
