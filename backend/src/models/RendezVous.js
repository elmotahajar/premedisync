const { DataTypes } = require('sequelize');
const sequelize = require('../config');

const RendezVous = sequelize.define('RendezVous', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  patientId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_patient',
  },
  medecinId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_medecin',
  },
  dateHeure: {
    type: DataTypes.DATE,
    allowNull: false,
    field: 'dateHeure',
  },
  motif: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  statut: {
    type: DataTypes.ENUM('confirmé', 'annulé', 'en attente'),
    defaultValue: 'en attente',
  },
  duree: {
    type: DataTypes.INTEGER,
    defaultValue: 30,
  },
  estPourTiers: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'estPourTiers',
  },
}, {
  tableName: 'rendezvous',
  timestamps: false,
});

module.exports = RendezVous;