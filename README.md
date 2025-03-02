[![Build Status](https://travis-ci.org/urbanriskmap/cognicity-reports-telegram.svg?branch=dev)](https://travis-ci.org/urbanriskmap/cognicity-reports-telegram) [![Coverage Status](https://coveralls.io/repos/github/urbanriskmap/cognicity-reports-telegram/badge.svg?branch=master)](https://coveralls.io/github/urbanriskmap/cognicity-reports-telegram?branch=master) [![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](http://www.gnu.org/licenses/gpl-3.0) 

# sitioss-reports-telegram

## Telegram Bot
Allows Telegram users to submit flood reports via text message chat bot.
Part of the CogniCity platform, deployed for [Urban Risk Map](https://riskmap.us).

This module deploys two AWS lambda functions:
1. A webhook for incoming messages from Telegram
2. A reply function to send confirmation messages

### Install
`npm install`

### Requirements
- CogniCity:
    * This function is designed to work with Cognicity Server v3.0.6 or later, running CogniCity Schema v3.0.7 or later.
- Node:
    * v8.10 or later (ES6 syntax is transpiled using Babel)

### Getting started
* Create Telegram bot as explained [here](https://core.telegram.org/bots#creating-a-new-bot) and get `BOT_TOKEN` [here](https://core.telegram.org/bots#generating-an-authorization-token). Configure its About, Description, Commands, Profile picture but hold off on setting up webhooks until you have configured the webhook.
* Create two AWS API gatway endpoints for the webhook and send functions
* Add the appropriate parameters in `src/config` and `.env`.
* Use the `commands/setWebook` function to tell Telegram the address of the API gateway
* Deploy the functions either by manual upload or edit the `.travis.yml` file to deploy using Travis.
* Send a text to your Telegram bot to test if it is up and running!
* Read `Misc Notes` section to assist in configuration

### Test
`npm run test`

### Configuration
Save a copy of sample.env as .env in local directory with appropriate credentials
* `API_GW_WEBHOOK`: The API gateway address for Telegram to trigger the webhook function
* `BOT_TOKEN`: Access token created on creating a Telegram bot
* `CARDS_API`: CogniCity server endpoint to get unique report card links
* `CARDS_DECK`: Array of [flood,prep] for what decks should be deployed
* `CARDS_API_KEY`: CogniCity server API key
* `CARDS_URL`: Client address for cards
* `PREP_URL`: Client address for prep cards
* `DEFAULT_INSTANCE_COUNTRY_CODE`: Default country for message files (e.g. 'us')
* `DEFAULT_LANGUAGE`: Current default language is English. You can add more languages here and parameterize replies for each language
* `MAP_SERVER`: Client address for map
* `TELEGRAM_ENDPOINT`: Telegram's API

#### Misc Notes
- Depending on your deployment method you may need to add the above parameters to the Lambda functions in the AWS web console
