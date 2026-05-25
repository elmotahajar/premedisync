const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const Medecin = sequelize.define('Medecin', {
  id_utilisateur: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  specialite: {
    type: DataTypes.STRING,
  },
  numeroOrdre: {
    type: DataTypes.STRING,
  },
  tarif: {
    type: DataTypes.DOUBLE,
  },
  secteur: {
    type: DataTypes.INTEGER,
  },
}, {
  tableName: 'medecin',
  timestamps: false,
});

module.exports = Medecin;