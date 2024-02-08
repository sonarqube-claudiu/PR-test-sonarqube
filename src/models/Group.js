const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const FocusPeriod = require("./FocusPeriod");

class Group extends Model {}

Group.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  description: {
    type: DataTypes.STRING(process.env.INPUT_DESC_MAX_LEN),
    allowNull: true,
    comment: "Optional description for the group",
  },
  focusperiod_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: FocusPeriod,
      key: "id",
    },
  },
},
{
    sequelize,
    modelName: 'Group',
    tableName: 'group',
    timestamps: false
});

module.exports = Group;
