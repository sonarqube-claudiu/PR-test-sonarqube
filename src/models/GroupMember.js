const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const Group = require("./Group");
const User = require("./User");

class GroupMember extends Model {}

GroupMember.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
    group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    }
},{
    sequelize,
    modelName: 'GroupMember',
    tableName: 'groupmember',
    timestamps: false
});

module.exports = GroupMember;