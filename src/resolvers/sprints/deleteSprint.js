const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { sprintId }, context) => {
    const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
    return await adapter.deleteSprint(sprintId);
};
