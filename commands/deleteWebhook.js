// Remove a Telegram bot webhook
//Rune: npx babel-node commands/deleteWebhook.js
import axios from 'axios';
require('dotenv').config();
import config from '../src/config';
axios.post(config.TELEGRAM_ENDPOINT + config.BOT_TOKEN + '/deleteWebhook')
    .then((res) => {
        console.log(res);
    }).catch((err) => console.log(err));

