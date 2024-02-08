const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { focusPeriod }, context) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  return await adapter.createFocusPeriod(focusPeriod);
};
