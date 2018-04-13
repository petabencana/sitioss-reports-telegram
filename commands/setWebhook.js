import axios from 'axios';
require('dotenv').config();
import config from '../src/config';
axios.post(config.TELEGRAM_ENDPOINT + config.BOT_TOKEN + '/setWebhook' + '?' + 'url=' + config.API_GW + '&max_connections=100' + '&allowed_updates=["message"]')
    .then((res) => {
        console.log(res);
    }).catch((err) => console.log(err));
