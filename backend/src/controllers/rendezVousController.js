const RendezVous = require('../models/RendezVous');
const User = require('../models/User');
const Medecin = require('../models/Medecin');
const { envoyerConfirmationRDV, envoyerAnnulationRDV } = require('./emailController');
const { Op } = require('sequelize');

// Créer un rendez-vous
exports.createRendezVous = async (req, res) => {
  try {
    const { medecinId, date, heure, motif } = req.body;
    const patientId = req.user.id;

    if (!medecinId || !date || !heure || !motif) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const rdv = await RendezVous.create({
      patientId,
      medecinId,
      date,
      heure,
      motif,
      statut: 'confirmé',
      duree: 30
    });

    try {
      await envoyerConfirmationRDV(req.user.email, rdv);
    } catch (e) {
      console.warn('Erreur envoi email confirmation:', e.message);
    }

    res.status(201).json({
      message: 'Rendez-vous créé avec succès !',
      rendezVous: rdv
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
      order: [['date', 'ASC'], ['heure', 'ASC']]
    });

    const formattedList = [];
    for (const r of rdvs) {
      const docUser = await User.findByPk(r.medecinId);
      const med = await Medecin.findOne({ where: { id_utilisateur: r.medecinId } });
      formattedList.push({
        id: r.id,
        date: r.date,
        heure: r.heure,
        dateHeure: `${r.date}T${r.heure}`,
        medecinNom: docUser ? `Dr. ${docUser.prenom} ${docUser.nom}` : 'Dr. Martin',
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
      whereClause.date = {
        [Op.gte]: today
      };
      whereClause.statut = {
        [Op.ne]: 'annulé'
      };
    }

    const rdvs = await RendezVous.findAll({
      where: whereClause,
      order: [['date', 'ASC'], ['heure', 'ASC']]
    });

    const formattedList = [];
    for (const r of rdvs) {
      const docUser = await User.findByPk(r.medecinId);
      const med = await Medecin.findOne({ where: { id_utilisateur: r.medecinId } });
      formattedList.push({
        id: r.id,
        date: r.date,
        heure: r.heure,
        dateHeure: `${r.date}T${r.heure}`,
        medecinNom: docUser ? `Dr. ${docUser.prenom} ${docUser.nom}` : 'Dr. Martin',
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

    if (date) rdv.date = date;
    if (heure) rdv.heure = heure;
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
    const { medecinId, date, heure, motif, tiers } = req.body;
    const patientId = req.user.id;

    const rdv = await RendezVous.create({
      patientId,
      medecinId,
      date,
      heure,
      motif,
      statut: 'confirmé',
      duree: 30
    });

    try {
      await envoyerConfirmationRDV(req.user.email, rdv);
    } catch (e) {
      console.warn('Erreur envoi email tiers:', e.message);
    }

    res.status(201).json({
      message: 'Rendez-vous créé pour le tiers avec succès !',
      rendezVous: rdv
    });
  } catch (error) {
    console.error('Erreur createRendezVousTiers:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};