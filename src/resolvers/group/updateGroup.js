const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { group, userId }, context) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  const parsedGroup = JSON.parse(group);
  return await adapter.updateGroup(parsedGroup, userId);
};
