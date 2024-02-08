const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { group, selectedUsers }, context) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  return await adapter.createGroup(group, selectedUsers);
};
