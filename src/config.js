require('dotenv').config({silent: true});

export default {
    API_KEY: process.env.API_KEY,
    API_GW_WEBHOOK: process.env.API_GW_WEBHOOK,
    BOT_TOKEN: process.env.BOT_TOKEN,
    ENDPOINT_SEND: process.env.ENDPOINT_SEND,
    ENDPOINT_RECEIVE: process.env.ENDPOINT_RECEIVE,
    CARDS_API: process.env.CARDS_API || 'https://data.riskmap.us/cards/',
    CARDS_API_KEY: process.env.CARDS_API_KEY,
    CARDS_URL: process.env.CARDS_URL || 'https://cards.riskmap.us/flood/',
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'en',
    MAP_URL: process.env.MAP_URL || 'https://riskmap.us/',
    TELEGRAM_ENDPOINT: process.env.TELEGRAM_ENDPOINT || 'https://api.telegram.org/bot',
};
