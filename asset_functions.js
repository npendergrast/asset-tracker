const apiCalls = require('./api_calls');
const queries = require('./queries');
const date = require('date-and-time');
const timezone = require('date-and-time/plugin/timezone');

date.plugin(timezone);

async function getAssetValue(assets) {
  let currentValArr = [];
  for (i = 0; i < assets.length; i++) {
    if (i > 0 && i % 5 === 0) {
      await delay(62000);
    }
    let currentVal = await apiCalls.cryptoApiCall(assets[i].code, 'USD');
    currentValArr.push({ code: assets[i].code, val: currentVal });
  }
  return currentValArr;
}

function delay(t) {
  return new Promise((resolve) => {
    setTimeout(resolve, t);
  });
}

function analyseAssets(assetValues, assets) {
  let returnArray = [];
  assets.forEach((element) => {
    element.alert = false;
    element.percentChange = 0;
    let update = false;
    let percentInc = element.percent_inc / 100 + 1;
    let percentDec = 1 - element.percent_inc / 100;
    let value = assetValues.find((obj) => {
      return obj.code === element.code;
    });
    let currentVal =
      Math.round((parseFloat(value.val) + Number.EPSILON) * 1000) / 1000;

    if (element.last_value !== 0) {
      if (currentVal > percentInc * element.last_value) {
        element.newValue = currentVal;
        update = true;
        element.alert = true;
        element.percentChange = getPercentageChange(
          element.last_value,
          currentVal
        );
      }
      if (currentVal < percentDec * element.last_value) {
        element.newValue = currentVal;
        update = true;
        element.alert = true;
        element.percentChange = getPercentageChange(
          element.last_value,
          currentVal
        );
      }
    } else {
      element.newValue = currentVal;
      update = true;
    }
    if (update) {
      returnArray.push(element);
    }
  });
  return returnArray;
}

function getPercentageChange(oldNumber, newNumber) {
  const decreaseValue = oldNumber - newNumber;
  let percentReturn = (decreaseValue / oldNumber) * 100;
  return Math.round((percentReturn + Number.EPSILON) * 100) / 100;
}

function updateDB(analysedAssets) {
  analysedAssets.forEach((element) => {
    queries.updateAssets(element.newValue, element.id);
  });
}

function convertDate(assets) {
  assets.forEach((element) => {
    if (element.last_time !== null) {
      let newDate = date.formatTZ(
        element.last_time,
        'D-MMM h:mm A',
        'Pacific/Auckland'
      );
      element.last_time = newDate;
    } else element.last_time = '';
  });
  return assets;
}

function convertArray(assetValues) {
  assetValues.forEach((element) => {
    element.val = Number(element.val);
  });
  return assetValues;
}

module.exports = {
  getAssetValue,
  analyseAssets,
  updateDB,
  convertDate,
  convertArray,
};
