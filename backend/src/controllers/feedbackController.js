const Feedback = require('../models/Feedback');
const Signalement = require('../models/Signalement');
const User = require('../models/User');

// Laisser un feedback
exports.createFeedback = async (req, res) => {
  try {
    const { medecinId, note, commentaire } = req.body;
    const patientId = req.user.id;

    if (!note || !commentaire) {
      return res.status(400).json({ message: 'Note et commentaire requis' });
    }

    if (note < 1 || note > 5) {
      return res.status(400).json({ message: 'La note doit être entre 1 et 5' });
    }

    const feedback = await Feedback.create({
      patientId,
      medecinId: medecinId || null,
      note,
      commentaire
    });

    res.status(201).json({
      message: 'Feedback envoyé avec succès !',
      feedback
    });
  } catch (error) {
    console.error('Erreur createFeedback:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Obtenir tous les feedbacks (ou ceux d'un patient)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const whereClause = req.params.id ? { patientId: parseInt(req.params.id) } : {};
    const feedbacks = await Feedback.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });

    const list = [];
    for (const f of feedbacks) {
      const patient = await User.findByPk(f.patientId);
      list.push({
        id: f.id,
        patientId: f.patientId,
        patientNom: patient ? `${patient.prenom} ${patient.nom}` : 'Anonyme',
        medecinId: f.medecinId,
        note: f.note,
        commentaire: f.commentaire,
        date: f.createdAt
      });
    }

    res.json(list);
  } catch (error) {
    console.error('Erreur getAllFeedbacks:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};


// Obtenir les feedbacks d'un médecin
exports.getFeedbacksMedecin = async (req, res) => {
  try {
    const { medecinId } = req.params;
    const feedbacks = await Feedback.findAll({
      where: { medecinId: parseInt(medecinId) },
      order: [['createdAt', 'DESC']]
    });
    
    const moyenneNote = feedbacks.length > 0 
      ? feedbacks.reduce((acc, f) => acc + f.note, 0) / feedbacks.length 
      : 0;

    res.json({
      feedbacks,
      moyenneNote: moyenneNote.toFixed(1),
      totalAvis: feedbacks.length
    });
  } catch (error) {
    console.error('Erreur getFeedbacksMedecin:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Signaler un problème
exports.signalerProbleme = async (req, res) => {
  try {
    const { type, description, urgence } = req.body;
    const patientId = req.user.id;

    if (!type || !description) {
      return res.status(400).json({ message: 'Type et description requis' });
    }

    const signalement = await Signalement.create({
      patientId,
      type,
      description,
      urgence: urgence || 'normale'
    });

    res.status(201).json({
      message: 'Problème signalé avec succès !',
      signalement
    });
  } catch (error) {
    console.error('Erreur signalerProbleme:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};