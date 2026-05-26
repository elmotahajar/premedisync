const Dossier = require('../models/Dossier');
const Prescription = require('../models/Prescription');
const RendezVous = require('../models/RendezVous');
const User = require('../models/User');
const Medecin = require('../models/Medecin');

// Obtenir le dossier médical du patient
exports.getDossier = async (req, res) => {
  try {
    const patientId = req.user.id;
    let dossier = await Dossier.findOne({ where: { patientId } });
    
    if (!dossier) {
      dossier = await Dossier.create({
        patientId,
        historique: "[]",
        allergies: "Aucune allergie signalée",
        antecedents: "Aucun antécédent médical renseigné",
        ordonnances: [],
        documents: []
      });
    }

    // Try to parse JSON fields safely
    let parsedHistorique = [];
    try {
      parsedHistorique = typeof dossier.historique === 'string' ? JSON.parse(dossier.historique) : (dossier.historique || []);
    } catch (e) {
      parsedHistorique = [];
    }

    let parsedDocuments = [];
    try {
      parsedDocuments = typeof dossier.documents === 'string' ? JSON.parse(dossier.documents) : (dossier.documents || []);
    } catch (e) {
      parsedDocuments = [];
    }

    res.json({
      message: 'Dossier médical',
      dossier: {
        id: dossier.id,
        patientId: dossier.patientId,
        historique: parsedHistorique,
        allergies: dossier.allergies || "Aucune allergie signalée",
        antecedents: dossier.antecedents || "Aucun antécédent médical renseigné",
        documents: parsedDocuments
      }
    });
  } catch (error) {
    console.error('Erreur getDossier:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir les ordonnances du patient
exports.getOrdonnances = async (req, res) => {
  try {
    const patientId = req.params.id ? parseInt(req.params.id) : req.user.id;

    const prescs = await Prescription.findAll({
      where: { patientId },
      include: [
        { model: User, as: 'medecin', attributes: ['nom', 'prenom'] }
      ],
      order: [['dateEmission', 'DESC']]
    });

    const formattedPrescriptions = prescs.map(p => {
      let meds = [];
      let posologie = '';
      try {
        meds = typeof p.medicaments === 'string' ? JSON.parse(p.medicaments) : (p.medicaments || []);
        posologie = meds.map(m => m.posologie || '').filter(Boolean).join(', ');
      } catch (e) {
        meds = [];
      }

      const medsStr = meds.map(m => m.nom || m).filter(Boolean).join(', ') || 'Médicaments prescrits';
      const duree = p.duree || (p.dateExpiration
        ? Math.ceil((new Date(p.dateExpiration) - new Date(p.dateEmission)) / (1000 * 60 * 60 * 24)) + ' jours'
        : 'Non précisée');

      return {
        id: p.id,
        date: p.dateEmission,
        medecin: p.medecin ? `Dr. ${p.medecin.prenom} ${p.medecin.nom}` : 'Dr. Martin',
        medicaments: medsStr,
        posologie: posologie || p.notes || 'Voir ordonnance',
        duree,
        statut: p.dateExpiration && new Date(p.dateExpiration) < new Date() ? 'Expirée' : 'Active'
      };
    });

    res.json(formattedPrescriptions);
  } catch (error) {
    console.error('Erreur getOrdonnances:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Obtenir l'historique des consultations
exports.getHistorique = async (req, res) => {
  try {
    const patientId = req.user.id;

    // Fetch consultations from historical appointments or dossier table
    const rdvs = await RendezVous.findAll({
      where: { patientId, statut: 'confirmé' },
      order: [['date', 'DESC']],
    });

    const list = [];
    for (const r of rdvs) {
      const docUser = await User.findByPk(r.medecinId);
      const med = await Medecin.findOne({ where: { id_utilisateur: r.medecinId } });
      list.push({
        id: r.id,
        date: r.date,
        medecin: docUser ? `Dr. ${docUser.prenom} ${docUser.nom}` : 'Dr. Martin',
        specialite: med ? med.specialite : 'Généraliste',
        motif: r.motif
      });
    }

    res.json(list);
  } catch (error) {
    console.error('Erreur getHistorique:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Uploader un document médical
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier uploadé' });
    }

    const patientId = req.user.id;
    let dossier = await Dossier.findOne({ where: { patientId } });
    
    if (!dossier) {
      dossier = await Dossier.create({
        patientId,
        historique: "[]",
        allergies: "Aucune allergie signalée",
        antecedents: "Aucun antécédent médical renseigné",
        ordonnances: [],
        documents: []
      });
    }

    let parsedDocuments = [];
    try {
      parsedDocuments = typeof dossier.documents === 'string' ? JSON.parse(dossier.documents) : (dossier.documents || []);
      if (!Array.isArray(parsedDocuments)) {
        parsedDocuments = [];
      }
    } catch (e) {
      parsedDocuments = [];
    }

    const newDoc = {
      id: Date.now(),
      nom: req.file.originalname,
      type: req.file.mimetype,
      taille: req.file.size,
      chemin: req.file.filename,
      dateUpload: new Date()
    };

    parsedDocuments.push(newDoc);
    dossier.documents = parsedDocuments;
    await dossier.save();

    res.status(201).json({
      message: 'Document uploadé avec succès !',
      document: newDoc
    });
  } catch (error) {
    console.error('Erreur uploadDocument:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir tous les médecins
exports.getMedecins = async (req, res) => {
  try {
    const medecins = await Medecin.findAll();
    const list = [];
    for (const m of medecins) {
      const user = await User.findByPk(m.id_utilisateur);
      if (user) {
        list.push({
          id: m.id_utilisateur,
          nom: `${user.prenom} ${user.nom}`,
          specialite: m.specialite || 'Généraliste',
          ville: 'Casablanca'
        });
      }
    }
    res.json(list);
  } catch (error) {
    console.error('Erreur getMedecins:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir le profil d'un patient par ID (Paramètres)
exports.getPatientById = async (req, res) => {
  try {
    const id = req.params.id || req.user.id;
    const user = await User.findByPk(id, {
      attributes: ['id', 'nom', 'prenom', 'email', 'telephone', 'dateNaissance', 'adresse']
    });
    if (!user) return res.status(404).json({ message: 'Patient introuvable' });
    res.json(user);
  } catch (error) {
    console.error('Erreur getPatientById:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Mettre à jour le profil d'un patient par ID (Paramètres)
exports.updatePatientById = async (req, res) => {
  try {
    const id = req.params.id || req.user.id;
    const { nom, prenom, email, telephone, dateNaissance, adresse } = req.body;
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: 'Patient introuvable' });

    await user.update({ nom, prenom, email, telephone, dateNaissance, adresse });
    res.json({ message: 'Profil mis à jour avec succès', user });
  } catch (error) {
    console.error('Erreur updatePatientById:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};