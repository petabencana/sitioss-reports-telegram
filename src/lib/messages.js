// Prepare messages for Telegram bot
const messages = {
  en: {
    texts: {
      default: `RiskMap bot helps you report flooding in realtime. 
        Send /flood to report. In life-threatening situations call 911.`,
      card: 'Please report using this one-time link ',
      thanks: 'Thank you for your report. You can access it using this link ',
    },
  },
};

export default (config) => ({
  default: function(language) {
    let response = messages[language].texts.default;
    if (language in messages) {
      response = messages[language].texts.default;
    }
    return response;
  },
  card: function(language, cardId) {
    let response = messages[config.DEFAULT_LANGUAGE].texts.card;
    if (language in messages) {
      response = messages[language].texts.card +
        config.CARDS_URL +
        cardId;
    }
    return response;
  },
  thanks: function(language, reportId, regionName) {
    let response = messages[config.DEFAULT_LANGUAGE].texts.thanks;
    if (language in messages) {
      response = messages[language].texts.thanks + config.MAP_URL +
        regionName + '/?id=' + reportId;
        console.log(response);
    }
    return response;
  },
});
