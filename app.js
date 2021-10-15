const queries = require('./queries');
const alerts = require('./alerts');
const assetFunction = require('./asset_functions');

launch();

async function launch() {
  let assets = await queries.getAssets();
  const codes = await queries.getCodes();
  if (assets !== 'failed' && codes !== 'failed') {
    assets = assetFunction.convertDate(assets);
    let assetValues = await assetFunction.getAssetValue(codes);
    assetValues = assetFunction.convertArray(assetValues);
    let analysedAssets = assetFunction.analyseAssets(assetValues, assets);
    if (analysedAssets.length > 0) {
      console.log(analysedAssets);
      alerts.alertFunction(analysedAssets);
      assetFunction.updateDB(analysedAssets);
    }
  }
}
