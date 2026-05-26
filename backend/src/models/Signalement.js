const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Signalement = sequelize.define('Signalement', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  urgence: {
    type: DataTypes.STRING,
    defaultValue: 'normale',
  },
}, {
  tableName: 'signalements',
  timestamps: true,
});

module.exports = Signalement;
