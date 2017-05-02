# cognicity-reports-telegram-lambda
This module deploys serverless lambdas that, after user initiates a conversation via Telegram app, fetch a report card from the server and sends it to them

### Install
`npm install`

### Getting started
* Create Telegram bot as explained [here](https://core.telegram.org/bots#creating-a-new-bot) and get `BOT_TOKEN` [here](https://core.telegram.org/bots#generating-an-authorization-token). Configure its About, Description, Commands, Profile picture but hold off on setting up Webhooks until you have configured the webhook.
* Add code for webhooks in handler.js and add it to the functions in serverless.yml file as explained [here](https://medium.com/zingle/creating-a-server-less-telegram-bot-with-aws-lambda-and-aws-api-gateway-36406471b2ca)
* Add the lambda function to listen to relevant SNS topics and add it to the functions in serverless.yml file
* Set up the config files as explained in the `Configuration` section.
* Now, deploy your serverless lambdas as mentioned in the `Run` section
* On successful deployment, you'll get a secure URL for the webhook. Now expose it via API Gateway POST method and deploy it. Set up this API's URL as the webhook as described in this [Guide](https://core.telegram.org/bots/api#setwebhook).
* Send a text to your Telegram bot to test if it is up and running!
* Read `Misc Notes` section to assist in configuration

### Run
`serverless deploy`

### Configuration
Save a copy of sample.env as .env in local directory with appropriate credentials

* `BOT_TOKEN`: Access token created on creating a Telegram bot
* `DEFAULT_LANG`: Current default language is English. You can add more languages here and parameterize replies for each language.
* `CARD_PATH`: Front end's cards URL
* `MAPSERVER`: Front end's map URL
* `X_API_KEY`: API Key needed to make calls to the deployed server (Set it to "" during local testing)
* `PG_CON`: Connection string for the Postgres database
* `SERVER`: Cognicity server URL to fetch unique cardIds

#### Misc Notes
- AWS credentials are stored in bash_profile
- Grasp "username" is userID/senderID from source networks to allow replies in conversation
- Errors are logged to console, but not returned to user currently
- If you want to test with your local Cognicity server instance, set up secure tunnels to localhost using ngrok and use that URL in the .env file. Install 'npm install -g ngrok'. After initializing the server, run 'ngrok http <PORT_NUMBER'. Use the https URL generated and set it in the 'SERVER' section of the env file. This allows the Lambda to interact with the server to fetch card OTL.
