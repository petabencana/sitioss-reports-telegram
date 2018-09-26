/* eslint-disable max-len */
require('dotenv').config({silent: true});

export default {
    API_KEY: process.env.API_KEY,
    API_GW_WEBHOOK: process.env.API_GW_WEBHOOK,
    BOT_TOKEN: process.env.BOT_TOKEN,
    CARDS_API: process.env.CARDS_API || 'https://data.riskmap.us/cards/',
    CARDS_API_KEY: process.env.CARDS_API_KEY,
    CARDS_DECK: (process.env.CARDS_DECK || 'flood').split(','),
    CARDS_URL: process.env.CARDS_URL || 'https://cards.riskmap.us/flood/',
    PREP_URL: process.env.PREP_URL || 'https://cards.riskmap.us/prep/',
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'en',
    DEFAULT_INSTANCE_COUNTRY_CODE: process.env.DEFAULT_INSTANCE_COUNTRY_CODE || 'us',
    DEFAULT_INSTANCE_REGION_CODE: process.env.DEFAULT_INSTANCE_REGION_CODE,
    ENDPOINT_SEND: process.env.ENDPOINT_SEND,
    ENDPOINT_RECEIVE: process.env.ENDPOINT_RECEIVE,
    MAP_URL: process.env.MAP_URL || 'https://riskmap.us/',
    TELEGRAM_ENDPOINT: process.env.TELEGRAM_ENDPOINT || 'https://api.telegram.org/bot',
};
