const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { projectId }) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  return await adapter.getProjectJournals(projectId);
};
