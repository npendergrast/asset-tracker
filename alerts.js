const TelegramBot = require('node-telegram-bot-api');
const telegram = require('./keys');
const queries = require('./queries');

const token = telegram.telegramToken;
const bot = new TelegramBot(token);

function alertFunction(analysedAssets) {
  let newString = `<b>CRYPTO COIN ALERT!!</b> \n\n`;
  for (i = 0; i < analysedAssets.length; i++) {
    if (analysedAssets[i].alert) {
      if (
        i === 0 ||
        (i > 0 && analysedAssets[i].user_id !== analysedAssets[i - 1].user_id)
      ) {
        newString = `<b>CRYPTO COIN ALERT!!</b> \n\n`;
      }
      if (analysedAssets[i].percentChange < 0) {
        let message = `<i>${analysedAssets[i].asset_name} (${
          analysedAssets[i].code
        })</i> \nCurrent: ${
          analysedAssets[i].newValue
        } USD \n<b>INCREASE:</b> ${-analysedAssets[i]
          .percentChange}% from last recorded value of ${
          analysedAssets[i].last_value
        } USD on ${analysedAssets[i].last_time} \n\n`;
        if (analysedAssets[i].holding > 0) {
          message =
            message +
            `Total holding: ${
              analysedAssets[i].holding * analysedAssets[i].newValue
            } USD`;
        }
        newString = newString + message;
      }
      if (analysedAssets[i].percentChange > 0) {
        let message = `<i>${analysedAssets[i].asset_name} (${analysedAssets[i].code})</i> \nCurrent: ${analysedAssets[i].newValue} USD \n<b>DECREASE:</b> ${analysedAssets[i].percentChange}% from last recorded value of ${analysedAssets[i].last_value} USD on ${analysedAssets[i].last_time} \n\n`;
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
