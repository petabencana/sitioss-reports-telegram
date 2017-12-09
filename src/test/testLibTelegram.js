import * as test from 'unit.js';
import telegram from '../lib/telegram/';

const msg = {
  event: {
    type: 'message_create',
    message_create: {
      target: {
        recipient_id: undefined,
      },
      message_data: {
        text: `RiskMap bot helps you report flooding in realtime. `
        + `Send /flood to report. In life-threatening situations always `
        + `call 911.`,
      },
    },
  },
};

/**
 * Telegram library function testing harness
 * @param {Object} config - configuration object
 **/
export default function(config) {
  /**
   * lib/telegram testing harness
  **/
  describe('lib/telegram Testing', function() {
    it('Process a proper Telegram request object', function(done) {
      let requestOptions = telegram(config)._prepareRequest(msg);
      // console.log(telegram(config).config);
      test.value(requestOptions.body).is(msg);
      test.value(requestOptions.json).is(true);
      test.value(requestOptions.headers)
        .is({'content-type': 'application/json'});
      done();
    });
   // TODO: proper crc U& response token for telegram
   it('Respond with proper crc token', function(done) {
     telegram(config).crcResponse('1')
     .then((response) => {
       test.value(response).is({'response_token':
        'sha256=gpHnS6og+oGBB9agylSs5UOjYhAPjm/XLzWLdKp3YTU='});
       done();
       });
     });

   it('Cannot issue telegram post, catch error', function(done) {
     telegram(config).sendMessage(msg)
     .catch((err) => {
       test.value(err.code).is(`ECONNREFUSED`);
       done();
     });
    });
 });
}

