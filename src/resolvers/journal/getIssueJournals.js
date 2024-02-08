const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { issueId }) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  return await adapter.getIssueJournals(issueId);
};
