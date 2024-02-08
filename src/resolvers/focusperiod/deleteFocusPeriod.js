const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { focusPeriodId }, context) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  const parsedId = JSON.parse(focusPeriodId);
  return await adapter.deleteFocusPeriod(parsedId);
};
