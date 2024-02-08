// src/models/TimeEntry.js
const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/db");

const Project = require("./Project");
const User = require("./User");
const Issue = require("./Issue");

class TimeEntry extends Model {}

TimeEntry.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Project,
      key: "id"
    },
    validate: {
      notNull: { msg: "Project ID is required" },
      isInt: { msg: "Project ID must be an integer" }
    }
  },
  author_id: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // Replace with your User model reference
      key: "id"
    }
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id"
    },
    validate: {
      notNull: { msg: "User ID is required" },
      isInt: { msg: "User ID must be an integer" }
    }
  },
  issue_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Issue,
      key: "id"
    }
  },
  time: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "Time is required" },
      isInt: { msg: "Time must be an integer" }
    }
  },
  comments: {
    type: DataTypes.STRING(1024)
  },
  activity_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notNull: { msg: "Activity ID is required" },
      isInt: { msg: "Activity ID must be an integer" }
    }
  },
  spent_on: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    validate: {
      notNull: { msg: "Spent on date is required" },
      isDate: { msg: "Spent on date must be a valid date" }
    }
  },
  created_on: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: "Creation date is required" },
      isDate: { msg: "Creation date must be a valid date" }
    }
  },
  updated_on: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      notNull: { msg: "Update date is required" },
      isDate: { msg: "Update date must be a valid date" }
    }
  },
}, {
  sequelize,
  modelName: "TimeEntry",
  tableName: "timeentry",
  timestamps: true,
  createdAt: 'created_on',
  updatedAt: 'updated_on'
});

module.exports = TimeEntry;
