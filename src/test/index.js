/* eline-disable no-console */
/**
 * Unit tests for CogniCity Telegram DM Lambda
 * @file Runs unit tests for cofniCity Telegram DM Lambda
 *
 * Adapted from Tomas Holderness June 2017
 */

//  Unit tests
import testCards from './testLibcards';
import testTelegram from './testLibtelegram';
import testReceive from './testReceive';


//  Call tests with the config
testCards();
testTelegram();
// testMessages(config);
testReceive();

