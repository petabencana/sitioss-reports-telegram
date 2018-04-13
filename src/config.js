require('dotenv').config({silent: true});

export default {
    API_GW: process.env.API_GW,
    BOT_TOKEN: process.env.BOT_TOKEN,
    CARDS_API: process.env.CARDS_API || 'https://data.riskmap.us/cards/',
    CARDS_API_KEY: process.env.CARDS_API_KEY,
    CARDS_URL: process.env.CARDS_URL || 'https://cards.riskmap.us/',
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'en',
    MAP_URL: process.env.MAP_URL || 'https://riskmap.us/',
    TELEGRAM_ENDPOINT: process.env.TELEGRAM_ENDPOINT || 'https://api.telegram.org/bot',
};
