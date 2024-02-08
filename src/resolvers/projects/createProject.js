const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { project, members }, context) => {
  const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
  const parsedProject = JSON.parse(project);
  const parsedMembers = JSON.parse(members);
  return await adapter.createProject(parsedProject, parsedMembers);
};
