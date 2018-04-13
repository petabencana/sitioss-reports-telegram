import * as test from 'unit.js';

import Cards from '../lib/cards';
import config from '../config';

/**
 * Telegram library function testing harness
 * @param {Object} config - configuration object
 **/
export default function() {
  describe('lib/cards Testing - internal functionality', function() {
    config.BOT_TOKEN = 'TOKEN',
    config.CARDS_API_KEY = '123';

    const cards = new Cards(config);
    const oldAxios = cards.axios;

    before(function() {
      const mockAxios = {
        post: function(url, body, headers) {
          return new Promise((resolve, reject) => {
            resolve(
              {
                data: {
                  statusCode: 200,
                  created: true,
                  cardId: {
                    url: url,
                    body: body,
                    headers,
                    },
                  },
                }
              );
          });
        },
      };
      cards.axios = mockAxios;
    });

    it('Creates a valid object', function() {
      test.value(cards instanceof Cards).is(true);
    });

    it('Catches invalid properties', function(done) {
      cards.getCardId({})
        .catch((err) => {
          test.value(err.message)
            .is('child "userId" fails because ["userId" is required]');
          done();
        });
    });

    it('Sends correct parameters for request', function(done) {
      cards.getCardId(
        {
          userId: 'this-is-a-thirty-six-character-strin',
          network: 'telegram',
          language: 'en',
        }
      ).then((res) => {
        test.value(res.url).is(config.CARDS_API);
        test.value(res.headers).is({'headers': {'x-api-key': '123'}});
        test.value(res.body).is(
          {
            username: 'this-is-a-thirty-six-character-strin',
            network: 'telegram',
            language: 'en',
          }
        );
        done();
      });
    });

    after(function() {
      cards.axios = oldAxios;
    });
  });

  describe('lib/cards testing - catch bad responses from server', function() {
    config.BOT_TOKEN = 'TOKEN',
    config.CARDS_API_KEY = '123';

    const cards = new Cards(config);
    const oldAxios = cards.axios;

    before(function() {
      const mockAxios = {
        post: function(url, body, headers) {
          return new Promise((resolve, reject) => {
            resolve(
              {
                data: {
                  statusCode: 404,
                  created: false,
                  cardId: {
                    url: url,
                    body: body,
                    headers,
                    },
                  },
                }
              );
          });
        },
      };
      cards.axios = mockAxios;
    });

    it('Catches error return from card server', function(done) {
      cards.getCardId( {
        userId: 'this-is-a-thirty-six-character-strin',
        network: 'telegram',
        language: 'en',
      })
        .catch((err) => {
          test.value(err.message)
            .is('Could not get new card from server. Result was {"statusCode":404,"created":false,"cardId":{"url":"https://data-dev.riskmap.us/cards/","body":{"username":"this-is-a-thirty-six-character-strin","network":"telegram","language":"en"},"headers":{"headers":{"x-api-key":"123"}}}}');
          done();
        });
    });

    after(function() {
      cards.axios = oldAxios;
    });
  });

  describe('lib/cards testing - catch errors with axios', function() {
    config.BOT_TOKEN = 'TOKEN',
    config.CARDS_API_KEY = '123';

    const cards = new Cards(config);
    const oldAxios = cards.axios;

    before(function() {
      const mockAxios = {
        post: function(url, body, headers) {
          return new Promise((resolve, reject) => {
            reject(
              new Error('Generic error')
              );
          });
        },
      };
      cards.axios = mockAxios;
    });

    it('Catches bad return from server', function(done) {
      cards.getCardId( {
        userId: 'this-is-a-thirty-six-character-strin',
        network: 'telegram',
        language: 'en',
      })
        .catch((err) => {
          test.value(err.message).is('Generic error');
          done();
        });
    });

    after(function() {
      cards.axios = oldAxios;
    });
  });
}
