const Medecin = require('../models/Medecin');
const Disponibilite = require('../models/Disponibilite');
const RendezVous = require('../models/RendezVous');
const Dossier = require('../models/Dossier');
const CompteRendu = require('../models/CompteRendu');
const Prescription = require('../models/Prescription');
const User = require('../models/User');
const { Op } = require('sequelize');

const parseJsonList = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

// GET /medecin/profil
exports.getProfil = async (req, res) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } });
    const [medecin] = await Medecin.findOrCreate({
      where: { id_utilisateur: req.user.id },
      defaults: {
        id_utilisateur: req.user.id,
        specialite: 'Généraliste',
        numeroOrdre: null,
        tarif: 0,
        secteur: 1,
      },
    });

    res.json({
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      specialite: medecin.specialite,
      numeroOrdre: medecin.numeroOrdre,
      tarif: medecin.tarif,
      secteur: medecin.secteur,
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// PUT /medecin/profil
exports.updateProfil = async (req, res) => {
  try {
    const medecin = await Medecin.findOne({ where: { id_utilisateur: req.user.id } });
    if (!medecin) return res.status(404).json({ message: 'Profil médecin introuvable' });

    const { specialite, tarif, secteur } = req.body;
    await medecin.update({ specialite, tarif, secteur });

    res.json({ message: 'Profil mis à jour', medecin });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// GET /medecin/planning
exports.getPlanning = async (req, res) => {
  try {
    const disponibilites = await Disponibilite.findAll({
      where: { id_medecin: req.user.id },
      order: [['jour', 'ASC'], ['heureDebut', 'ASC']],
    });
    res.json(disponibilites);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// POST /medecin/disponibilite
exports.ajouterDisponibilite = async (req, res) => {
  try {
    const { jour, heureDebut, heureFin, estConge } = req.body;

    const dispo = await Disponibilite.create({
      id_medecin: req.user.id,
      jour,
      heureDebut,
      heureFin,
      estConge: estConge || false,
    });

    res.status(201).json({ message: 'Disponibilité ajoutée', dispo });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// DELETE /medecin/disponibilite/:id
exports.supprimerDisponibilite = async (req, res) => {
  try {
    const dispo = await Disponibilite.findOne({
      where: { id: req.params.id, id_medecin: req.user.id }
    });
    if (!dispo) return res.status(404).json({ message: 'Disponibilité introuvable' });

    await dispo.destroy();
    res.json({ message: 'Disponibilité supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// GET /medecin/conges
exports.getConges = async (req, res) => {
  try {
    const conges = await Disponibilite.findAll({
      where: { id_medecin: req.user.id, estConge: true },
    });
    res.json(conges);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// POST /medecin/conge
exports.ajouterConge = async (req, res) => {
  try {
    const { jour, heureDebut, heureFin } = req.body;
    const conge = await Disponibilite.create({
      id_medecin: req.user.id,
      jour,
      heureDebut,
      heureFin,
      estConge: true,
    });
    res.status(201).json({ message: 'Congé ajouté', conge });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// DELETE /medecin/conge/:id
exports.supprimerConge = async (req, res) => {
  try {
    const conge = await Disponibilite.findOne({
      where: { id: req.params.id, id_medecin: req.user.id, estConge: true }
    });
    if (!conge) return res.status(404).json({ message: 'Congé introuvable' });

    await conge.destroy();
    res.json({ message: 'Congé supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// GET /medecin/patients-jour
exports.getPatientsJour = async (req, res) => {
  try {
    const aujourd_hui = new Date().toISOString().split('T')[0];

    const rendezVous = await RendezVous.findAll({
      where: {
        dateHeure: {
          [Op.between]: [
            `${aujourd_hui} 00:00:00`,
            `${aujourd_hui} 23:59:59`
          ]
        }
      },
      order: [['dateHeure', 'ASC']],
    });

    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// GET /medecin/:id/patients
exports.getPatientsMedecin = async (req, res) => {
  try {
    const { id } = req.params;
    const rendezVous = await RendezVous.findAll({
      where: { medecinId: id },
      order: [['dateHeure', 'ASC']],
    });

    res.json(rendezVous);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// POST /medecin/compte-rendu
exports.creerCompteRendu = async (req, res) => {
  try {
    const { patientId, rendezVousId, symptomes, diagnostic, traitement, recommandations } = req.body;
    const numericPatientId = Number(patientId);
    const numericRendezVousId = rendezVousId ? Number(rendezVousId) : null;

    if (!Number.isInteger(numericPatientId) || numericPatientId <= 0 || !diagnostic) {
      return res.status(400).json({ message: 'Patient et diagnostic sont requis' });
    }

    const rendezVous = numericRendezVousId
      ? await RendezVous.findByPk(numericRendezVousId)
      : await RendezVous.findOne({
          where: { patientId: numericPatientId, medecinId: req.user.id },
          order: [['dateHeure', 'DESC']],
        });

    if (!rendezVous) {
      return res.status(404).json({ message: 'Rendez-vous introuvable' });
    }

    const compteRendu = await CompteRendu.create({
      rendezVousId: rendezVous.id,
      medecinId: req.user.id,
      patientId: numericPatientId,
      motifConsultation: symptomes || rendezVous.motif || 'Consultation',
      diagnostic,
      observations: recommandations || null,
      traitement: traitement || null,
      dateConsultation: new Date(),
      prochainRdv: null,
    });

    const dossier = await Dossier.findOne({ where: { patientId: numericPatientId } });
    if (dossier) {
      const historique = parseJsonList(dossier.historique);
      historique.unshift({
        id: compteRendu.id,
        date: compteRendu.dateConsultation,
        motif: compteRendu.motifConsultation,
        diagnostic: compteRendu.diagnostic,
      });
      dossier.historique = JSON.stringify(historique);
      await dossier.save();
    }

    return res.status(201).json({ message: 'Compte rendu créé', compteRendu });
  } catch (err) {
    console.error('Erreur creerCompteRendu:', err);
    return res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// GET /medecin/compte-rendu/:patientId
exports.getComptesRenduPatient = async (req, res) => {
  try {
    const patientId = Number(req.params.patientId);
    if (!Number.isInteger(patientId) || patientId <= 0) {
      return res.status(400).json({ message: 'Identifiant patient invalide' });
    }

    const [patient, medecin, dossier] = await Promise.all([
      User.findByPk(patientId, { attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }),
      User.findByPk(req.user.id, { attributes: ['id', 'nom', 'prenom', 'email', 'telephone'] }),
      Dossier.findOne({ where: { patientId } })
    ]);

    if (!patient) {
      return res.status(404).json({ message: 'Patient introuvable' });
    }

    const safeDossier = dossier || await Dossier.create({
      patientId,
      historique: '[]',
      allergies: '',
      antecedents: '',
      ordonnances: [],
      documents: []
    });

    const comptesRendus = await CompteRendu.findAll({
      where: { patientId },
      include: [
        { model: RendezVous, as: 'rendezVous', attributes: ['id', 'dateHeure', 'motif', 'statut'] },
        { model: User, as: 'medecin', attributes: ['id', 'nom', 'prenom'] },
      ],
      order: [['dateConsultation', 'DESC']],
    });

    const prescriptions = await Prescription.findAll({
      where: { patientId },
      include: [
        { model: CompteRendu, as: 'compteRendu', attributes: ['id', 'dateConsultation'] },
      ],
      order: [['dateEmission', 'DESC']],
    });

    const historiqueDossier = parseJsonList(safeDossier.historique);
    const historiqueConsultations = comptesRendus.map((cr) => ({
      id: cr.id,
      date: cr.dateConsultation,
      motif: cr.motifConsultation,
      diagnostic: cr.diagnostic,
      traitement: cr.traitement || '',
      observations: cr.observations || '',
      prochainRdv: cr.prochainRdv || null,
      rendezVousId: cr.rendezVousId,
    }));

    return res.json({
      message: 'Consultation patient',
      patient,
      medecin,
      dossier: {
        id: safeDossier.id,
        patientId: safeDossier.patientId,
        historique: historiqueConsultations.length > 0 ? historiqueConsultations : historiqueDossier,
        allergies: safeDossier.allergies || 'Aucune allergie signalée',
        antecedents: safeDossier.antecedents || 'Aucun antécédent médical renseigné',
        documents: parseJsonList(safeDossier.documents),
        ordonnances: parseJsonList(safeDossier.ordonnances),
      },
      comptesRendus: comptesRendus.map((cr) => ({
        id: cr.id,
        rendezVousId: cr.rendezVousId,
        medecinId: cr.medecinId,
        patientId: cr.patientId,
        motifConsultation: cr.motifConsultation,
        diagnostic: cr.diagnostic,
        observations: cr.observations || '',
        traitement: cr.traitement || '',
        dateConsultation: cr.dateConsultation,
        prochainRdv: cr.prochainRdv || null,
        rendezVous: cr.rendezVous || null,
        medecin: cr.medecin || null,
      })),
      prescriptions: prescriptions.map((p) => ({
        id: p.id,
        compteRenduId: p.compteRenduId,
        medecinId: p.medecinId,
        patientId: p.patientId,
        medicaments: parseJsonList(p.medicaments),
        dateEmission: p.dateEmission,
        dateExpiration: p.dateExpiration || null,
        notes: p.notes || '',
      })),
    });
  } catch (err) {
    console.error('Erreur getComptesRenduPatient:', err);
    return res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// POST /medecin/prescription
exports.creerPrescription = async (req, res) => {
  try {
    const { compteRenduId, patientId, medicaments, dateExpiration, notes } = req.body;
    if (!compteRenduId || !patientId || !Array.isArray(medicaments) || medicaments.length === 0) {
      return res.status(400).json({ message: 'Compte rendu, patient et médicaments sont requis' });
    }

    const prescription = await Prescription.create({
      compteRenduId,
      medecinId: req.user.id,
      patientId,
      medicaments,
      dateEmission: new Date(),
      dateExpiration: dateExpiration || null,
      notes: notes || null,
    });

    return res.status(201).json({ message: 'Prescription créée', prescription });
  } catch (err) {
    console.error('Erreur creerPrescription:', err);
    return res.status(500).json({ message: 'Erreur serveur', erreur: err.message });
  }
};

// GET /medecin/prescriptions/:patientId
exports.getPrescriptionsPatient = async (req, res) => {
  res.status(501).json({ message: 'Non implémenté' });
};