const axios = require('axios');
const { apiKey } = require('./keys');

async function cryptoApiCall(coin, currency) {
  let currentVal;
  try {
    await axios
      .get(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${coin}&to_currency=${currency}&apikey=${apiKey}`
      )
      .then(function (response) {
        if (response.data.hasOwnProperty('Realtime Currency Exchange Rate')) {
          currentVal =
            response.data['Realtime Currency Exchange Rate'][
              '5. Exchange Rate'
            ];
        } else {
          console.log(response.data);
          currentVal = 'no value';
        }
      });
    return currentVal;
  } catch (error) {
    return 'failed';
  }
}

module.exports = {
  cryptoApiCall,
};
