import axios from 'axios';
import Bot from '@urbanriskmap/cognicity-bot-core';
import messages from './messages.json';

// language.
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
    this.config.MESSAGES = messages;
    this.bot = new Bot(this.config);
    this.axios = axios;
  }

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

  _sendMessage(requestString) {
    return new Promise((resolve, reject) => {
      this.axios.post(requestString, {})
        .then((response) => resolve(response))
        .catch((err) => reject(err));
    });
  }

  sendThanks(httpBody) {
    return new Promise((resolve, reject) => {
      this.bot.thanks(httpBody)
        .then((msg) => {
          const response = this._prepareRequest(httpBody.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
    });
  }

  process(telegramMessage) {
    return new Promise((resolve, reject) => {
      const properties = {
        userId: String(telegramMessage.chat.id),
        language: this.config.DEFAULT_LANGUAGE,
      };
      if (this._classify(telegramMessage.text) === 'flood') {
        this.bot.cards(properties)
        .then((msg) => {
          const response = this._prepareRequest(properties.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      } else {
        this.bot.default(properties)
        .then((msg) => {
          const response = this._prepareRequest(properties.userId, msg);
          resolve(this._sendMessage(response));
        }).catch((err) => reject(err));
      }
    });
  }
}
