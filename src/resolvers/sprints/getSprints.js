const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { projectId }, context) => {
    const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
    return await adapter.getSprints(projectId);
};
