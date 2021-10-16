const TelegramBot = require('node-telegram-bot-api');
const telegram = require('./keys');
const queries = require('./queries');

const token = telegram.telegramToken;
const bot = new TelegramBot(token);

function alertFunction(analysedAssets) {
  let newString;
  let message;
  for (i = 0; i < analysedAssets.length; i++) {
    if (analysedAssets[i].alert) {
      let totalHolding =
        Math.round(
          (analysedAssets[i].holding * analysedAssets[i].newValue +
            Number.EPSILON) *
            100
        ) / 100;
      if (
        i === 0 ||
        (i > 0 && analysedAssets[i].user_id !== analysedAssets[i - 1].user_id)
      ) {
        newString = `<b>ASSET ALERT \u{26A0}</b> \n\n`;
      }
      if (analysedAssets[i].percentChange !== 0) {
        message = `<i>${analysedAssets[i].asset_name} (${analysedAssets[i].code})</i>\n`;

        if (analysedAssets[i].percentChange < 0) {
          message =
            message +
            `<b>\u{1F680} INCREASE: ${-analysedAssets[i].percentChange}%</b>\n`;
        }
        if (analysedAssets[i].percentChange > 0) {
          message =
            message +
            `<b>\u{2B07} DECREASE: ${analysedAssets[i].percentChange}%</b>\n`;
        }
        message =
          message +
          `Current value: ${analysedAssets[i].newValue} ${analysedAssets[i].currency}\nPrevious value: ${analysedAssets[i].last_value} ${analysedAssets[i].currency}\n(recorded on: ${analysedAssets[i].last_time})\n`;
        if (analysedAssets[i].holding > 0) {
          message =
            message +
            `<b>Total holding: ${totalHolding} ${analysedAssets[i].currency}</b>`;
        }
        message = message + `\n\n`;
        newString = newString + message;
      }
      if (analysedAssets.length === 1) {
        sendAlert(newString, analysedAssets[i].user_id);
      } else if (i + 1 < analysedAssets.length) {
        if (analysedAssets[i].user_id !== analysedAssets[i + 1].user_id) {
          sendAlert(newString, analysedAssets[i].user_id);
          newString = '';
        }
      } else {
        sendAlert(newString, analysedAssets[i].user_id);
      }
    }
  }
}

async function sendAlert(alertMessage, userID) {
  const telegramID = await queries.getTelegramID(userID);
  bot.sendMessage(telegramID, alertMessage, {
    parse_mode: 'HTML',
  });
}

module.exports = {
  alertFunction,
};
