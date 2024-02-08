// src/models/Issue.js

const { Model, DataTypes } = require("sequelize");
const sequelize = require("../utils/db");
const DataSource = require("./DataSource");
const Project = require("./Project");
const Sprint = require("./Sprint");
const Status = require("./Status");
const IssueType = require("./IssueType");

class Issue extends Model {}

Issue.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  data_source_id: {
    type: DataTypes.INTEGER,
    references: {
      model: DataSource,
      key: "id"
    },
    validate: {
      isInt: { msg: "Data source ID must be an integer" }
    }
  },
  external_id: {
    type: DataTypes.STRING(255),
    validate: {
      len: {
        args: [0, 255],
        msg: "External ID must be 255 characters or less"
      }
    }
  },
  project_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Assuming it's required
    references: {
      model: Project,
      key: "id"
    },
    validate: {
      notNull: { msg: "Project ID is required" },
      isInt: { msg: "Project ID must be an integer" }
    }
  },
  sprint_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Sprint,
      key: "id"
    },
    validate: {
      isInt: { msg: "Sprint ID must be an integer" },
    }
  },
  status_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Assuming it's required
    references: {
      model: Status,
      key: "id"
    },
    validate: {
      notNull: { msg: "Status ID is required" },
      isInt: { msg: "Status ID must be an integer" }
    }
  },
  parent_id: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: { msg: "Parent ID must be an integer" },
    }
  },
  subject: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      notNull: { msg: "Subject is required" },
      notEmpty: { msg: "Subject must not be empty" }
    }
  },
  metadata: {
    type: DataTypes.JSON,
    validate: {
      isObject(value) {
        if (value && typeof value !== 'object') {
          throw new Error("Metadata must be a valid JSON object");
        }
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
  },
  created_on: {
    type: DataTypes.DATE
  },
  updated_on: {
    type: DataTypes.DATE
  },
  issue_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false, // Assuming it's required
    references: {
      model: IssueType,
      key: "id"
    },
    validate: {
      notNull: { msg: "Issue type ID is required" },
      isInt: { msg: "Issue type ID must be an integer" }
    }
  },
  position: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: {
      isNumeric: { msg: "Position must be a number" }
    }
  },
  spent_time: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
    validate: {
      isNumeric: { msg: "Spent time must be a number" }
    }
  },
  estimated_time: {
    type: DataTypes.DOUBLE,
    validate: {
      isNumeric: { msg: "Estimated time must be a number" },
    }
  },
  done_ratio: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: { msg: "Done ratio must be an integer" },
      min: {
        args: [0],
        msg: "Done ratio cannot be less than 0"
      },
      max: {
        args: [100],
        msg: "Done ratio cannot be greater than 100"
      }
    }
  },
}, {
  sequelize,
  modelName: "Issue",
  tableName: "issue",
  timestamps: true,
  // updatedAt: 'updated_on',
  // createdAt: 'created_on'
});

module.exports = Issue;
