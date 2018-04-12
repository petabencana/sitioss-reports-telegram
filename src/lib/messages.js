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
  default: function(lang) {
    let response = messages[config.defaultLanugage].texts.default;
    if (lang in messages) {
      response = messages[lang].texts.default;
    }
    return response;
  },
  card: function(lang, cardId) {
    let response = messages[config.defaultLanguage].texts.default;
    if (lang in messages) {
      response = messages[lang].texts.card +
        config.server.card_endpoint +
        cardId;
    }
    return response;
  },
  thanks: function(lang, reportId) {
    let response = messages[config.defaultLanguage].texts.default;
    if (lang in messages) {
      response = messages[lang].texts.thanks + config.mapUrl + reportId;
    }
    return response;
  },
});
