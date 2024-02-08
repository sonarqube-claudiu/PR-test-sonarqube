const { AdapterFactory } = require("../../factories/AdapterFactory");

module.exports = async (_, {userId}, context) => {
    const adapter = AdapterFactory.createAdapter(+process.env.DATA_SOURCE);
    return await adapter.getAllUsers(userId);
};