import * as test from 'unit.js';

import Telegram from '../lib/telegram';
import config from '../config';

/**
 * Telegram library function testing harness
 */
export default function() {
  describe('Telegram bot testing', function() {
    const telegram = new Telegram(config);
    const oldTelegramBot = telegram.bot;
    const oldAxios = telegram.axios;
    let axiosError = false;
    let botError = false;

    before(function() {
      const mockThanks = function(properties) {
        return new Promise((resolve, reject) => {
          if (botError === false) {
            resolve({text: 'mocked thanks message', link: ' link'});
          } else {
            reject(new Error(`bot error`));
          }
        });
      };

      const mockDefault = function(properties) {
        return new Promise((resolve, reject) => {
          if (botError === false) {
            resolve({text: 'mocked default message'});
          } else {
            reject(new Error(`bot error`));
          }
        });
      };

      const mockCard = function(properties) {
        return new Promise((resolve, reject) => {
          if (botError === false) {
            resolve({text: 'mocked card message', link: ' card'});
          } else {
            reject(new Error(`bot error`));
          }
        });
      };

      const mockAxios = function(properties, body) {
        return new Promise((resolve, reject) => {
          if (axiosError === false) {
            resolve(properties);
          } else {
            reject(new Error(`Axios error`));
          }
        });
      };

      telegram.bot = {
        default: mockDefault,
        card: mockCard,
        thanks: mockThanks,
      };

      telegram.axios = {
        post: mockAxios,
      };
    });

    it('Creates class', function(done) {
      test.value(telegram instanceof Telegram).is(true);
      done();
    });

    it('Can get thanks messsage', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'jbd',
        reportId: '1',
        userId: '1',
      };
      telegram.sendThanks(body)
        .then((res) => {
          test.value(res).is('https://api.telegram.org/bot' + config.BOT_TOKEN + '/sendmessage?text=mocked thanks message link&chat_id=1');
          done();
        });
    });

    it('Can get thanks - when instanceRegionCode null', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'null',
        reportId: '1',
        userId: '1',
      };
      telegram.sendThanks(body)
        .then((res) => {
          test.value(res).is('https://api.telegram.org/bot' + config.BOT_TOKEN + '/sendmessage?text=mocked thanks message link&chat_id=1');
          done();
        });
    });

    it('Can catch bot error with thanks messsage', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'jbd',
        reportId: '1',
        userId: '1',
      };
      botError = true;
      telegram.sendThanks(body)
        .catch((err) => {
          test.value(err.message).is('bot error');
          botError = false;
          done();
        });
    });

    it('Can get card message', function(done) {
      const message = {
        chat: {
          id: 1,
        },
        text: '/flood',
      };
      telegram.sendReply(message)
        .then((res) => {
          test.value(res).is('https://api.telegram.org/bot' + config.BOT_TOKEN + '/sendmessage?text=mocked card message card&chat_id=1');
          done();
        });
    });

    it('Can handle axios error geting card message', function(done) {
      const message = {
        chat: {
          id: 1,
        },
        text: '/flood',
      };
      axiosError = true;
      telegram.sendReply(message)
        .catch((err) => {
          test.value(err.message).is('Axios error');
          axiosError = false;
          done();
        });
    });

    it('Can get default messsage', function(done) {
      const message = {
        chat: {
          id: 1,
        },
        text: 'spam',
      };
      telegram.sendReply(message)
        .then((res) => {
          test.value(res).is('https://api.telegram.org/bot' + config.BOT_TOKEN + '/sendmessage?text=mocked default message&chat_id=1');
          done();
        });
    });

    it('Can catch error getting default messsage', function(done) {
      const message = {
        chat: {
          id: 1,
        },
        text: 'spam',
      };
      botError = true;
      telegram.sendReply(message)
        .catch((err) => {
          test.value(err.message).is('bot error');
          done();
        });
    });

    it('Can catch error getting card messsage', function(done) {
      const message = {
        chat: {
          id: 1,
        },
        text: '/flood',
      };
      botError = true;
      telegram.sendReply(message)
        .catch((err) => {
          test.value(err.message).is('bot error');
          done();
        });
    });


    after(function() {
      telegram.bot = oldTelegramBot;
      telegram.axios = oldAxios;
    });
  });
}
