const sequelize = require('../config');

const User           = require('./User');
const Patient        = require('./Patient');
const Medecin        = require('./Medecin');
const Secretaire     = require('./Secretaire');
const Administrateur = require('./Administrateur');
const RendezVous     = require('./RendezVous');
const Facture        = require('./Facture');
const FeuilleSoins   = require('./FeuilleSoins');
const AuditLog       = require('./AuditLog');
const SalleConsultation = require('./SalleConsultation');
const Tarif          = require('./Tarif');

// ── Associations ────────────────────────────
Patient.belongsTo(User,        { foreignKey: 'id_utilisateur' });
Medecin.belongsTo(User,        { foreignKey: 'id_utilisateur' });
Secretaire.belongsTo(User,     { foreignKey: 'id_utilisateur' });
Administrateur.belongsTo(User, { foreignKey: 'id_utilisateur' });

RendezVous.belongsTo(Patient,  { foreignKey: 'patientId' });
Facture.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
Facture.belongsTo(User, { foreignKey: 'secretaireId', as: 'secretaire' });
FeuilleSoins.belongsTo(User, { foreignKey: 'patientId', as: 'patient' });
FeuilleSoins.belongsTo(User, { foreignKey: 'medecinId', as: 'medecin' });
FeuilleSoins.belongsTo(User, { foreignKey: 'secretaireId', as: 'secretaire' });

module.exports = {
  sequelize,
  User,
  Utilisateur: User,
  Patient,
  Medecin,
  Secretaire,
  Administrateur,
  RendezVous,
  Facture,
  FeuilleSoins,
  AuditLog,
  SalleConsultation,
  Tarif,
};