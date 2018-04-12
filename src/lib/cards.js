import axios from 'axios';
import Joi from 'joi';

const propertiesSchema = Joi.object().keys({
    userId: Joi.string().min(36).max(36).required(),
    network: Joi.string().required(),
    language: Joi.string().required()
});

/**
 * Cards class - get CogniCity report card links
 * @class Cards
 */
export default class Cards {
    /**
     * Constructor for class Cards
     * @param {Object} config - configuration object
     * @param {String} config.cardsApi - cards endpoint
     * @param {String} config.cardsApiKey - cards endpoint API key
     */
    constructor(config) {
        this.config = config;
        this.axios = axios;
    }
    /**
     * getCard - get a new CogniCity card
     * @param {Object} properties - card request properties
     * @param {String} properties.userId - unique user identifier
     * @param {String} properties.network - user network (e.g. 'Telegram')
     * @param {String} properties.language - user language code (e.g. 'en')
     * @return {Promise} Request response
     */
    getCardId(properties) {
        return new Promise((resolve, reject) => {

            Joi.validate(properties, propertiesSchema, function(err, value){
                if (err) reject(err);
            });

            const headers = {
                'headers': {
                    'x-api-key': this.config.cardsApiKey,
                },
            };

            const body = {
                username: properties.userId,
                network: properties.network,
                language: properties.language,
            };

            this.axios.post(this.config.cardsApi, body, headers)
                .then((res) => {
                    if (res.statusCode === 200 && res.created === true) {
                        resolve(res.cardId);
                    } else {
                        reject(new Error(`Could not get new card from server.` +
                            ` Status code was ` + res.statusCode));
                    }
                })
                .catch((err) => reject(err));
        });
    }
}
