const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// GET /admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalMedecins = await User.count({ where: { role: 'medecin' } });
    const totalSecretaires = await User.count({ where: { role: 'secretaire' } });
    const totalPatients = await User.count({ where: { role: 'patient' } });

    return res.json({
      indicateurs: {
        totalPatients,
        totalMedecins,
        totalSecretaires,
        totalUsers,
      }
    });
  } catch (error) {
    console.error('getDashboard:', error);
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// GET /admin/personnel
exports.listerPersonnel = async (req, res) => {
  console.log('📥 listerPersonnel appelé par:', req.user);
  try {
    const users = await User.findAll({
      where: { role: ['medecin', 'secretaire'] },
      attributes: ['id', 'nom', 'prenom', 'email', 'role']
    });
    return res.json({ personnel: users });
  } catch (error) {
    console.error('listerPersonnel:', error);
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// POST /admin/personnel
exports.creerPersonnel = async (req, res) => {
  console.log('📥 creerPersonnel body:', req.body);
  try {
    const { nom, prenom, email, role, telephone } = req.body;

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(409).json({ message: 'Un compte avec cet email existe déjà.' });
    }

    const tempPassword = Math.random().toString(36).slice(-8) + 'Med1!';
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await User.create({
      nom,
      prenom,
      email,
      password: hashedPassword,
      role: role || 'medecin',
    });

    return res.status(201).json({
      message: `Compte ${role} créé avec succès.`,
      tempPassword,
      user: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      }
    });
  } catch (error) {
    console.error('creerPersonnel:', error);
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// GET /admin/personnel/:id
exports.getPersonnel = async (req, res) => {
  try {
    const membre = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] },
    });
    if (!membre) return res.status(404).json({ message: 'Membre introuvable.' });
    return res.json(membre);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// PUT /admin/personnel/:id
exports.modifierPersonnel = async (req, res) => {
  try {
    const membre = await User.findByPk(req.params.id);
    if (!membre) return res.status(404).json({ message: 'Membre introuvable.' });

    const { nom, prenom, email } = req.body;
    await membre.update({ nom, prenom, email });

    return res.json({ message: 'Profil mis à jour.', membre });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// DELETE /admin/personnel/:id
exports.desactiverPersonnel = async (req, res) => {
  try {
    const membre = await User.findByPk(req.params.id);
    if (!membre) return res.status(404).json({ message: 'Membre introuvable.' });
    await membre.destroy();
    return res.json({ message: 'Compte supprimé.' });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// GET /admin/finances/rapport
exports.getRapportFinancier = async (req, res) => {
  try {
    return res.json({ nbFactures: 0, totalEmis: '0.00', factures: [] });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// GET /admin/statistiques/revenus
exports.getStatistiquesRevenus = async (req, res) => {
  try {
    return res.json([]);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};

// GET /admin/medecins/:id/planning
exports.getPlanningMedecin = async (req, res) => {
  try {
    return res.json([]);
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur.', error: error.message });
  }
};