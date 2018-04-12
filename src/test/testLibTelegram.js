import * as test from 'unit.js';
import Telegram from '../lib/telegram';

/**
 * Telegram library function testing harness
 * @param {Object} config - configuration object
 **/
export default function(config) {
  /**
   * lib/telegram testing harness
  **/
  describe('lib/telegram Testing', function() {
    const config = {
      botToken: 'TOKEN',
      cardsApi: 'https://data.cognicity.com/cards',
      cardsApiKey: '123',
      defaultLanguage: process.env.DEFAULT_LANGUAGE,
      mapUrl: process.env.MAP_URL,
      telegramEndpoint: 'https://api.telegram.org/bot',
    };

    const telegram = new Telegram(config);
    const oldSendMessage = telegram._sendMessage;

    it('Creates an instance of the class', function() {
      test.value(telegram instanceof Telegram).is(true);
    });

    it('Succesfully prepares a request', function(done) {
      test.value(telegram._prepareRequest('123', 'test message'))
        .is('https://api.telegram.org/botTOKEN/sendmessage?text=test message&chat_id=123');
      done();
    });

    before(function() {
      telegram._sendMessage = function(req) {
        return new Promise((resolve, reject) => {
          resolve(req);
        });
      };
    });

    it('Sends correct default message', function() {
      telegram.sendDefault(
        {
          language: 'en',
          userId: 'this-is-a-thirty-six-character-strin',
        }
      ).then((res) => {
        test.value(res).is('https://api.telegram.org/botTOKEN/sendmessage?text=RiskMap bot helps you report flooding in realtime. \n        Send /flood to report. In life-threatening situations call 911.&chat_id=this-is-a-thirty-six-character-strin');
      });
    });

    after(function() {
      telegram._sendMessage = oldSendMessage;
    });

    // constructs
    // _prepareRequest returns expected value
    // sends expected message
    // send card passes expected params
    // send thanks passes expected params
    // send default sends the default
 });
}

