const { Model, DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

class FocusPeriod extends Model {}

FocusPeriod.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    start_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate:{
            isDate: true,
            notEmpty: true,
        }
    },
    end_date: {
        type: DataTypes.DATE,
        allowNull: false,
        validate:{
            isDate: true,
            notEmpty: true,
        }
    },
    description: {
        type: DataTypes.STRING(process.env.INPUT_DESC_MAX_LEN),
        allowNull: true,
        comment: 'Optional description for the focus period',
    },
    data_source_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    external_id: {
        type: DataTypes.STRING,
    }
},
{
    sequelize,
    modelName: 'focusperiod',
    tableName: 'focusperiod', 
    timestamps: false,
    validate: {
        startDateBeforeEndDate() {
            if (new Date(this.start_date) > new Date(this.end_date)) {
                throw new Error('Start date must be before the end date.');
            }
        }
    }
});

module.exports = FocusPeriod;