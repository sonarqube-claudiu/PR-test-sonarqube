const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, { sprint }, context) => {
    const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
    const parsedSprint = JSON.parse(sprint);
    return await adapter.updateSprint(parsedSprint);
};
