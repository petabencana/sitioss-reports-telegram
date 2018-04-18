import * as test from 'unit.js';
import Telegram from '../lib/telegram';
import config from '../config';

/**
 * Telegram library function testing harness
 **/
export default function() {
  /**
   * lib/telegram testing harness
  **/
  describe('lib/telegram Testing', function() {
    config.BOT_TOKEN = 'TOKEN',
    config.CARDS_API_KEY = '123';
    config.MAP_URL = 'https://map.cognicity.com/';
    config.CARDS_URL = 'https://cards.cognicity.com/';

    const telegram = new Telegram(config);
    const oldSendMessage = telegram._sendMessage;
    const oldgetCardId = telegram.cards;

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
      telegram.cards = {
        getCardId: function(properties) {
          return new Promise((resolve, reject) => {
            resolve('sample_card_id');
            });
          },
      };
    });

    it('Sends correct default message', function(done) {
      telegram.sendDefault(
        {
          language: 'en',
          userId: 'this-is-a-thirty-six-character-strin',
        }
      ).then((res) => {
        test.value(res).is('https://api.telegram.org/botTOKEN/sendmessage?text=RiskMap bot helps you report flooding in realtime. \n        Send /flood to report. In life-threatening situations call 911.&chat_id=this-is-a-thirty-six-character-strin');
        done();
      });
    });

    it('Sends correct card message', function(done) {
      telegram.sendCard(
        {
          userId: 'this-is-a-thirty-six-character-strin',
          language: 'en',
        }
      ).then((result) => {
        test.value(result).is('https://api.telegram.org/botTOKEN/sendmessage?text=Please report using this one-time link https://cards.cognicity.com/sample_card_id&chat_id=this-is-a-thirty-six-character-strin');
        done();
      });
    });

    it('Sends correct thanks message', function(done) {
      telegram.sendThanks(
        {
          userId: 'this-is-a-thirty-six-character-strin',
          reportId: '1',
          language: 'en',
          instanceRegionCode: 'jbd',
        }
      ).then((result) => {
        console.log(result);
        test.value(result).is('https://api.telegram.org/botTOKEN/sendmessage?text=Thank you for your report. You can access it using this link ' + config.MAP_URL + 'jbd/' + '1' + '&chat_id=this-is-a-thirty-six-character-strin');
        done();
      });
    });

    after(function() {
      telegram._sendMessage = oldSendMessage;
      telegram.cards = oldgetCardId;
    });
 });

 describe('lib/telegram testing - _sendMessage function', function() {
  config.BOT_TOKEN = 'TOKEN',
  config.CARDS_API_KEY = '123';

  const telegram = new Telegram(config);
  const oldAxios = telegram.axios;

  before(function() {
    telegram.axios = {
      post: function(request, body) {
        return new Promise((resolve, reject) => {
          resolve(request);
        });
      },
    };
  });

  it('_sendMessage works', function(done) {
    telegram._sendMessage('dummy_message', false)
      .then((res) => {
        test.value(res).is('dummy_message');
        done();
      });
  });

  after(function() {
    telegram.axios = oldAxios;
  });
 });

 describe('lib/telegram testing - handles errors', function() {
  config.BOT_TOKEN = 'TOKEN',
  config.CARDS_API_KEY = '123';

  const telegram = new Telegram(config);
  const oldAxios = telegram.axios;
  const oldCards = telegram.cards;

  before(function() {
    telegram.axios = {
      post: function(request, body) {
        return new Promise((resolve, reject) => {
          reject(new Error('sample error'));
        });
      },
    };
    telegram.cards = {
      getCardId: function(properties) {
        return new Promise((resolve, reject) => {
          reject(new Error('sample card id error'));
        });
      },
    };
  });

  it('_sendMessage catches errors', function(done) {
    telegram._sendMessage('dummy_message', false)
      .catch((err) => {
        test.value(err.message).is('sample error');
        done();
      });
  });

  it('sendCard catches getcardId errors', function(done) {
    telegram.sendCard('dummy_message', false)
      .catch((err) => {
        test.value(err.message).is('sample card id error');
        done();
      });
  });

  it('catches error with region code', function(done) {
    telegram.sendThanks(
      {
        userId: 'this-is-a-thirty-six-character-strin',
        reportId: '1',
        language: 'en',
        instanceRegionCode: 'err',
      }
    ).catch((err) => {
      test.value(err.message).is('Instance region not found');
      done();
    });
  });

  after(function() {
    telegram.axios = oldAxios;
    telegram.cards = oldCards;
  });
 });
}

