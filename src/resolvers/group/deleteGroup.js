const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { groupId }, context) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  const parsedGroupId = JSON.parse(groupId);
  return await adapter.deleteGroup(parsedGroupId);
};
