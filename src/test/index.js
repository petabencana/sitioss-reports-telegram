/* eline-disable no-console */
/**
 * Unit tests for CogniCity Telegram DM Lambda
 * @file Runs unit tests for cofniCity Telegram DM Lambda
 *
 * Adapted from Tomas Holderness June 2017
 */

// Unit tests
import testCards from './testLibcards';
import testTelegram from './testLibtelegram';
import testMessages from './testMessages';
import testReceive from './testReceive';

const config = {
  server: {
    cardApi: 'http://127.0.0.1/',
    apiKey: process.env.SERVER_API_KEY,
  },
};

// Call tests with the config
testCards(config);
testTelegram(config);
testMessages(config);
testReceive(config);

