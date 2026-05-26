const RendezVous = require('../models/RendezVous');
const User = require('../models/User');
const Patient = require('../models/Patient');
const Medecin = require('../models/Medecin');
const { envoyerConfirmationRDV, envoyerAnnulationRDV } = require('./emailController');
const { Op } = require('sequelize');

const pad = (value) => String(value).padStart(2, '0');

const normalizeDateHeure = (value) => {
  if (!value) {
    return { date: null, heure: null };
  }

  const dateValue = value instanceof Date ? value : new Date(value);
  if (!Number.isNaN(dateValue.getTime())) {
    return {
      date: `${dateValue.getFullYear()}-${pad(dateValue.getMonth() + 1)}-${pad(dateValue.getDate())}`,
      heure: `${pad(dateValue.getHours())}:${pad(dateValue.getMinutes())}`
    };
  }

  const [datePart = null, timePart = ''] = String(value).split(/[T ]/);
  return {
    date: datePart,
    heure: timePart ? timePart.slice(0, 5) : null
  };
};

const buildDateHeure = (date, heure) => {
  const normalizedHeure = heure && heure.length === 5 ? `${heure}:00` : heure;
  return `${date} ${normalizedHeure}`;
};

const ensurePatientRow = async (patientId) => {
  let patient = await Patient.findByPk(patientId);
  if (!patient) {
    patient = await Patient.create({ id_utilisateur: patientId });
  }
  return patient;
};

// Créer un rendez-vous
exports.createRendezVous = async (req, res) => {
  try {
    const patientId = Number(req.body.patientId ?? req.user.id);
    const medecinId = Number(req.body.medecinId ?? req.body.doctorId);
    const date = req.body.date;
    const heure = req.body.heure ?? req.body.timeSlot;
    const motif = req.body.motif;
    const statut = req.body.statut ?? req.body.status ?? 'confirmé';
    const duree = Number(req.body.duree ?? req.body.duration ?? 30);

    if (!Number.isInteger(patientId) || patientId <= 0) {
      return res.status(400).json({ message: 'Le patient est requis' });
    }

    if (!Number.isInteger(medecinId) || medecinId <= 0 || !date || !heure || !motif) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    await ensurePatientRow(patientId);

    const rdv = await RendezVous.create({
      patientId,
      medecinId,
      dateHeure: buildDateHeure(date, heure),
      motif,
      statut,
      duree,
      estPourTiers: false
    });

    const { date: formattedDate, heure: formattedHeure } = normalizeDateHeure(rdv.dateHeure);

    try {
      await envoyerConfirmationRDV(req.user.email, rdv);
    } catch (e) {
      console.warn('Erreur envoi email confirmation:', e.message);
    }

    res.status(201).json({
      message: 'Rendez-vous créé avec succès !',
      rendezVous: {
        id: rdv.id,
        patientId: rdv.patientId,
        medecinId: rdv.medecinId,
        date: formattedDate,
        heure: formattedHeure,
        dateHeure: rdv.dateHeure,
        motif: rdv.motif,
        statut: rdv.statut,
        duree: rdv.duree
      }
    });
  } catch (error) {
    console.error('Erreur createRendezVous:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir tous les rendez-vous de l'utilisateur
exports.getRendezVous = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let whereClause = {};
    if (role === 'patient') {
      whereClause = { patientId: userId };
    } else if (role === 'medecin') {
      whereClause = { medecinId: userId };
    }

    const rdvs = await RendezVous.findAll({
      where: whereClause,
      order: [['dateHeure', 'ASC']]
    });

    const formattedList = [];
    for (const r of rdvs) {
      const { date, heure } = normalizeDateHeure(r.dateHeure);
      const docUser = await User.findByPk(r.medecinId);
      const med = await Medecin.findOne({ where: { id_utilisateur: r.medecinId } });
        formattedList.push({
        id: r.id,
          patientId: r.patientId,
          medecinId: r.medecinId,
        date,
        heure,
        dateHeure: r.dateHeure,
          medecinNom: docUser ? `Dr. ${docUser.prenom} ${docUser.nom}` : 'Médecin non renseigné',
        specialite: med ? med.specialite : 'Généraliste',
        motif: r.motif,
        statut: r.statut
      });
    }

    res.json(formattedList);
  } catch (error) {
    console.error('Erreur getRendezVous:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les rendez-vous d'un patient spécifique (avec support optionnel upcoming)
exports.getRendezVousPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { upcoming } = req.query;

    let whereClause = { patientId: id };

    if (upcoming === '1') {
      const today = new Date().toISOString().split('T')[0];
      whereClause.dateHeure = {
        [Op.gte]: `${today} 00:00:00`
      };
      whereClause.statut = {
        [Op.ne]: 'annulé'
      };
    }

    const rdvs = await RendezVous.findAll({
      where: whereClause,
      order: [['dateHeure', 'ASC']]
    });

    const formattedList = [];
    for (const r of rdvs) {
      const { date, heure } = normalizeDateHeure(r.dateHeure);
      const docUser = await User.findByPk(r.medecinId);
      const med = await Medecin.findOne({ where: { id_utilisateur: r.medecinId } });
        formattedList.push({
        id: r.id,
          patientId: r.patientId,
          medecinId: r.medecinId,
        date,
        heure,
        dateHeure: r.dateHeure,
          medecinNom: docUser ? `Dr. ${docUser.prenom} ${docUser.nom}` : 'Médecin non renseigné',
        specialite: med ? med.specialite : 'Généraliste',
        motif: r.motif,
        statut: r.statut
      });
    }

    res.json(formattedList);
  } catch (error) {
    console.error('Erreur getRendezVousPatient:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Modifier un rendez-vous
exports.updateRendezVous = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, heure, motif, statut } = req.body;

    const rdv = await RendezVous.findByPk(id);
    if (!rdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    if (date || heure) {
      const current = normalizeDateHeure(rdv.dateHeure);
      rdv.dateHeure = buildDateHeure(date || current.date, heure || current.heure);
    }
    if (motif) rdv.motif = motif;
    if (statut) rdv.statut = statut;

    await rdv.save();

    res.json({
      message: 'Rendez-vous modifié avec succès !',
      rendezVous: rdv
    });
  } catch (error) {
    console.error('Erreur updateRendezVous:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Annuler un rendez-vous
exports.cancelRendezVous = async (req, res) => {
  try {
    const { id } = req.params;

    const rdv = await RendezVous.findByPk(id);
    if (!rdv) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    rdv.statut = 'annulé';
    await rdv.save();

    try {
      await envoyerAnnulationRDV(req.user.email, rdv);
    } catch (e) {
      console.warn('Erreur envoi email annulation:', e.message);
    }

    res.json({ message: 'Rendez-vous annulé avec succès !' });
  } catch (error) {
    console.error('Erreur cancelRendezVous:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Créer un rendez-vous pour un tiers
exports.createRendezVousTiers = async (req, res) => {
  try {
    const patientId = Number(req.body.patientId ?? req.user.id);
    const medecinId = Number(req.body.medecinId ?? req.body.doctorId);
    const date = req.body.date;
    const heure = req.body.heure ?? req.body.timeSlot;
    const motif = req.body.motif;
    const statut = req.body.statut ?? req.body.status ?? 'confirmé';
    const duree = Number(req.body.duree ?? req.body.duration ?? 30);

    if (!Number.isInteger(patientId) || patientId <= 0) {
      return res.status(400).json({ message: 'Le patient est requis' });
    }

    if (!Number.isInteger(medecinId) || medecinId <= 0 || !date || !heure || !motif) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    await ensurePatientRow(patientId);

    const rdv = await RendezVous.create({
      patientId,
      medecinId,
      dateHeure: buildDateHeure(date, heure),
      motif,
      statut,
      duree,
      estPourTiers: true
    });

    const { date: formattedDate, heure: formattedHeure } = normalizeDateHeure(rdv.dateHeure);

    try {
      await envoyerConfirmationRDV(req.user.email, rdv);
    } catch (e) {
      console.warn('Erreur envoi email tiers:', e.message);
    }

    res.status(201).json({
      message: 'Rendez-vous créé pour le tiers avec succès !',
      rendezVous: {
        id: rdv.id,
        patientId: rdv.patientId,
        medecinId: rdv.medecinId,
        date: formattedDate,
        heure: formattedHeure,
        dateHeure: rdv.dateHeure,
        motif: rdv.motif,
        statut: rdv.statut,
        duree: rdv.duree
      }
    });
  } catch (error) {
    console.error('Erreur createRendezVousTiers:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};