import axios from 'axios';
import Bot from '@urbanriskmap/cognicity-bot-core';

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
    this.config.MESSAGES = require('./messages-' +
    this.config.DEFAULT_INSTANCE_COUNTRY_CODE +
    '.json');
    this.bot = new Bot(this.config);
    this.axios = axios;
  }

  /**
   * Method to filter text by keyword
   * @method _classify
   * @private
   * @param {String} text - message from user
   * @return {String} - keyword or null
   */
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
    * Prepares Telegram message + link request object
    * @method _prepareResponse
    * @private
    * @param {String} userId - User or Telegram chat ID for reply
    * @param {Object} message - Bot message object
    * @return {String} - URI for request
  **/
  _prepareLinkResponse(userId, message) {
    const response = this.config.TELEGRAM_ENDPOINT +
            this.config.BOT_TOKEN +
            '/sendmessage?text=' +
            message.text +
            message.link +
            '&chat_id=' +
            userId;
    console.log(response);
    return (response);
  }

    /**
    * Prepares default Telegram message request object
    * @method _prepareDefaultResponse
    * @private
    * @param {String} userId - User or Telegram chat ID for reply
    * @param {Object} message - Bot message object
    * @return {String} - URI for request
  **/
 _prepareDefaultResponse(userId, message) {
  return (this.config.TELEGRAM_ENDPOINT +
          this.config.BOT_TOKEN +
          '/sendmessage?text=' +
          message.text +
          '&chat_id=' +
          userId
        );
}

  /**
    * Send Telegram message
    * @method _sendMessage
    * @private
    * @param {String} requestString - Telegram call
    * @return {Promise} - Result of request
  **/
  _sendMessage(requestString) {
    console.log(requestString);
    return new Promise((resolve, reject) => {
      console.log('Sending request to telegram: ' + requestString);
      this.axios.post(requestString, {})
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

   // TODO - document body properties
  /**
    * Prepare and send a thank you message to user with report ID
    * @method sendThanks
    * @param {Object} body - HTTP body request object
    * @return {Promise} - Result of request
  **/
  sendThanks(body) {
    return new Promise((resolve, reject) => {
      if (body.instanceRegionCode === 'null') {
        // catch reports outside the reporting area and reply a default
        body.instanceRegionCode = this.config.DEFAULT_INSTANCE_REGION_CODE;
      }
      this.bot.thanks(body)
        .then((msg) => {
          const response = this._prepareLinkResponse(body.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
    });
  }

   // TODO - document telegramMessage properties
  /**
    * Respond telegram to user based on input
    * @method sendReply
    * @param {Object} telegramMessage - Telegram requets object
    * @return {Promise} - Result of request
  **/
  sendReply(telegramMessage) {
    return new Promise((resolve, reject) => {
      const properties = {
        userId: String(telegramMessage.chat.id),
        language: this.config.DEFAULT_LANGUAGE,
        network: 'telegram',
      };
      if (this._classify(telegramMessage.text) === 'flood') {
        console.log('this is a flood message');
        this.bot.card(properties)
        .then((msg) => {
          const response = this._prepareLinkResponse(properties.userId, msg);
          console.log('response', response);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      } else {
        this.bot.default(properties)
        .then((msg) => {
          const response = this._prepareDefaultResponse(properties.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      }
    });
  }
}
