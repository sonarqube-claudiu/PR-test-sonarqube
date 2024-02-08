const { AdapterFactory } = require("../../factories/AdapterFactory");
const Issue = require("../../models/Issue");
const { HttpStatusCodes } = require("../../utils/utils");
const { Op } = require("sequelize");

const GAP_SIZE = 100; // Define a constant for the gap size

module.exports = async (_, { issueId, position }) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  return await adapter.updateIssuePosition(issueId, position);
};
