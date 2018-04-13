import * as test from 'unit.js';

import Receive from '../functions/receive/receive.js';


/**
 * Telegram library function testing harness
 * @param {Object} config - configuration object
 */
export default function(config) {
  describe('receive/get Testing', function() {
    const config = {
      botToken: 'TOKEN',
      cardsApi: 'https://data.cognicity.com/cards/',
      cardsApiKey: '123',
      cardsUrl: 'https://cards.cognicity.com/',
      defaultLanguage: 'en',
      mapUrl: 'https://map.cognicity.com/',
      telegramEndpoint: 'https://api.telegram.org/bot',
    };

    const receive = new Receive(config);

    const oldSendCard = receive.telegram.sendCard;
    const oldSendDefault = receive.telegram.sendDefault;

    before(function() {
      receive.telegram.sendCard = function(properties) {
        return new Promise((resolve, reject) => {
          resolve('send card');
        });
      };
      receive.telegram.sendDefault = function(properties) {
        return new Promise((resolve, reject) => {
          resolve('send default');
        });
      };
    });

    it('Creates class', function(done) {
      test.value(receive instanceof Receive).is(true);
      done();
    });

    it('Correctly classifies a message with keyword /flood', function(done) {
      let output = receive._classify('/flood');
      test.value(output).is('flood');
      done();
    });

    it('Correctly classifies a message without keyword /flood', function(done) {
      let output = receive._classify('/sunshine');
      test.value(output).is(null);
      done();
    });

    it('Correctly process a flood message', function(done) {
      receive.process(
        {
          message: {
            text: '/flood',
            chat: {
              id: '1',
            },
          },
        }
      ).then((res) => {
        test.value(res).is('send card');
        done();
      });
    });

    it('Correctly process a non-flood message', function(done) {
      receive.process(
        {
          message: {
            text: '/sunshine',
            chat: {
              id: '1',
            },
          },
        }
      ).then((res) => {
        test.value(res).is('send default');
        done();
      });
    });

    after(function() {
      receive.telegram.sendCard = oldSendCard;
      receive.telegram.sendDefault = oldSendDefault;
    });
  });
}
