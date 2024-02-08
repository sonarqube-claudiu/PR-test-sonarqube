// const Issue = require("../../models/Issue");
const { AdapterFactory } = require("../../factories/AdapterFactory");
const Issue = require("../../models/Issue");
const { HttpStatusCodes, post, SOURCES } = require("../../utils/utils");

module.exports = async (_, { issue, assignments }) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  const parsedIssue = JSON.parse(issue);
  const parsedAssignments = JSON.parse(assignments);
  const response = await adapter.createIssue(parsedIssue, parsedAssignments);
  return response;
};
