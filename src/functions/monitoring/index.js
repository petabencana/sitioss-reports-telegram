// Local objects
import config from '../../config';
import Monitoring from '../../lib/Monitoring';

/**
 * Endpoint for monitoring Telegram lambdas
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default (event, context, callback) => {
    // Monitoring instance
    const mtr = new Monitoring(config);

    // Make requests
    Promise.all([mtr.send(), mtr.receive()])
        .then((res) => callback(null, res))
        .catch((err) => callback(err));
};
