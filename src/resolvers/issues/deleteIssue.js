// const Issue = require("../../models/Issue");
const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { issueId }) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  const response = await adapter.deleteIssue(issueId);
  return response;
};
