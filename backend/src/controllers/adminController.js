const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Patient = require('../models/Patient');
const RendezVous = require('../models/RendezVous');
const Facture = require('../models/Facture');

const formatDayKey = (date) => date.toISOString().slice(0, 10);
const formatMonthKey = (date) => date.toISOString().slice(0, 7);

const buildLastNDays = (days) => {
  const values = [];
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - offset);
    values.push(date);
  }
  return values;
};

const buildLastNMonths = (months) => {
  const values = [];
  for (let offset = months - 1; offset >= 0; offset -= 1) {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    date.setMonth(date.getMonth() - offset);
    values.push(date);
  }
  return values;
};

const percentChange = (current, previous) => {
  if (!previous && !current) return 0;
  if (!previous) return 100;
  return Math.round(((current - previous) / previous) * 100);
};

// GET /admin/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const now = new Date();
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    const fourteenDaysAgo = new Date(todayStart);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 13);
    const thirtyDaysAgo = new Date(todayStart);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29);
    const sixtyDaysAgo = new Date(todayStart);
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 59);

    const [totalUsers, totalMedecins, totalSecretaires, totalPatients, patients, rendezVous, factures] = await Promise.all([
      User.count(),
      User.count({ where: { role: 'medecin' } }),
      User.count({ where: { role: 'secretaire' } }),
      User.count({ where: { role: 'patient' } }),
      User.findAll({ where: { role: 'patient' }, attributes: ['id', 'nom', 'prenom'] }),
      RendezVous.findAll({ attributes: ['id', 'patientId', 'medecinId', 'dateHeure', 'statut', 'motif'] }),
      Facture.findAll({ attributes: ['id', 'patientId', 'montantTotal', 'montantPaye', 'statut', 'dateEmission'] })
    ]);

    const recentRendezVous = rendezVous
      .map((rdv) => ({ ...rdv.get({ plain: true }), dateHeure: new Date(rdv.dateHeure) }))
      .filter((rdv) => !Number.isNaN(rdv.dateHeure.getTime()))
      .sort((left, right) => right.dateHeure - left.dateHeure);

    const appointmentCounts = new Map();
    buildLastNDays(7).forEach((date) => appointmentCounts.set(formatDayKey(date), 0));
    recentRendezVous.forEach((rdv) => {
      const key = formatDayKey(rdv.dateHeure);
      if (appointmentCounts.has(key)) {
        appointmentCounts.set(key, appointmentCounts.get(key) + 1);
      }
    });

    const appointmentsLabels = [...appointmentCounts.keys()];
    const appointmentsValues = [...appointmentCounts.values()];

    const doctorCounts = new Map();
    for (const rdv of recentRendezVous.filter((item) => item.statut !== 'annulé')) {
      doctorCounts.set(rdv.medecinId, (doctorCounts.get(rdv.medecinId) || 0) + 1);
    }

    const topDoctors = [...doctorCounts.entries()]
      .sort((left, right) => right[1] - left[1])
      .slice(0, 5);

    const doctorLabels = [];
    const doctorValues = [];
    for (const [doctorId, count] of topDoctors) {
      const doctor = await User.findByPk(doctorId, { attributes: ['nom', 'prenom'] });
      doctorLabels.push(doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : `Médecin #${doctorId}`);
      doctorValues.push(count);
    }

    const activePatientIds = new Set(
      recentRendezVous
        .filter((rdv) => rdv.dateHeure >= thirtyDaysAgo)
        .map((rdv) => rdv.patientId)
    );

    const newPatientIds = new Set(
      recentRendezVous
        .filter((rdv) => rdv.dateHeure >= sevenDaysAgo)
        .map((rdv) => rdv.patientId)
    );

    const inactivePatientIds = patients
      .map((patient) => patient.id)
      .filter((patientId) => !activePatientIds.has(patientId));

    const patientStatusLabels = ['Actifs', 'Inactifs', 'Nouveaux'];
    const patientStatusValues = [activePatientIds.size, inactivePatientIds.length, newPatientIds.size];

    const monthBuckets = buildLastNMonths(6);
    const revenuePerMonth = new Map(monthBuckets.map((date) => [formatMonthKey(date), 0]));
    const unpaidPerMonth = new Map(monthBuckets.map((date) => [formatMonthKey(date), 0]));

    factures.forEach((facture) => {
      const emission = facture.dateEmission ? new Date(facture.dateEmission) : null;
      if (!emission || Number.isNaN(emission.getTime())) return;
      const key = formatMonthKey(emission);
      if (!revenuePerMonth.has(key)) return;

      const paid = Number(facture.montantPaye || 0);
      const total = Number(facture.montantTotal || 0);
      revenuePerMonth.set(key, revenuePerMonth.get(key) + paid);
      unpaidPerMonth.set(key, unpaidPerMonth.get(key) + Math.max(total - paid, 0));
    });

    const revenueLabels = [...revenuePerMonth.keys()].map((key) => {
      const [year, month] = key.split('-');
      return `${month}/${year}`;
    });
    const revenueValues = [...revenuePerMonth.values()];

    const totalRevenue = [...revenuePerMonth.values()].reduce((sum, value) => sum + value, 0);
    const totalUnpaid = [...unpaidPerMonth.values()].reduce((sum, value) => sum + value, 0);

    const confirmedLast7 = recentRendezVous.filter((rdv) => rdv.dateHeure >= sevenDaysAgo && rdv.statut === 'confirmé').length;
    const confirmedPrevious7 = recentRendezVous.filter((rdv) => rdv.dateHeure < sevenDaysAgo && rdv.dateHeure >= fourteenDaysAgo && rdv.statut === 'confirmé').length;
    const appointmentsLast7 = recentRendezVous.filter((rdv) => rdv.dateHeure >= sevenDaysAgo).length;
    const appointmentsPrevious7 = recentRendezVous.filter((rdv) => rdv.dateHeure < sevenDaysAgo && rdv.dateHeure >= fourteenDaysAgo).length;
    const revenueLast30 = factures
      .filter((facture) => facture.dateEmission && new Date(facture.dateEmission) >= thirtyDaysAgo)
      .reduce((sum, facture) => sum + Number(facture.montantPaye || 0), 0);
    const revenuePrevious30 = factures
      .filter((facture) => facture.dateEmission && new Date(facture.dateEmission) < thirtyDaysAgo && new Date(facture.dateEmission) >= sixtyDaysAgo)
      .reduce((sum, facture) => sum + Number(facture.montantPaye || 0), 0);

    // Build doctor names map for recent activities
    const doctorNames = new Map();
    await Promise.all(
      [...new Set(recentRendezVous.map((rdv) => rdv.medecinId))].map(async (doctorId) => {
        const doctor = await User.findByPk(doctorId, { attributes: ['nom', 'prenom'] });
        doctorNames.set(doctorId, doctor ? `Dr. ${doctor.prenom} ${doctor.nom}` : `Médecin #${doctorId}`);
      })
    );

    const recentActivities = recentRendezVous.slice(0, 10).map((rdv) => {
      const patient = patients.find((item) => item.id === rdv.patientId);
      return {
        id: rdv.id,
        patientName: patient ? `${patient.prenom} ${patient.nom}` : `Patient #${rdv.patientId}`,
        doctorName: doctorNames.get(rdv.medecinId) || `Médecin #${rdv.medecinId}`,
        date: rdv.dateHeure.toISOString().replace('T', ' ').slice(0, 16),
        status: rdv.statut === 'confirmé' ? 'confirmed' : rdv.statut === 'annulé' ? 'cancelled' : 'pending'
      };
    });

    return res.json({
      indicateurs: {
        totalPatients,
        totalMedecins,
        totalSecretaires,
        totalUsers,
        totalRendezVous: rendezVous.length,
        totalRevenus: Number(totalRevenue.toFixed(2)),
        totalImpayes: Number(totalUnpaid.toFixed(2)),
      },
      kpiCards: [
        { title: 'Patients', icon: '🧑‍⚕️', value: totalPatients, trend: percentChange(activePatientIds.size, inactivePatientIds.length || 1), trendLabel: 'Patients actifs vs inactifs', subtitle: 'Base patients réelle' },
        { title: 'Médecins', icon: '👨‍⚕️', value: totalMedecins, trend: 0, trendLabel: 'Comptage réel', subtitle: 'Comptes médicaux actifs' },
        { title: 'Rendez-vous', icon: '📅', value: rendezVous.length, trend: percentChange(appointmentsLast7, appointmentsPrevious7), trendLabel: '7 derniers jours vs précédents', subtitle: 'Rendez-vous enregistrés' },
        { title: 'Revenus', icon: '💰', value: Number(totalRevenue.toFixed(0)), trend: percentChange(revenueLast30, revenuePrevious30), trendLabel: '30 derniers jours vs précédents', subtitle: 'Montants payés' }
      ],
      quickStats: [
        { label: 'Taux de rendez-vous confirmés', value: `${appointmentsLast7 ? Math.round((confirmedLast7 / appointmentsLast7) * 100) : 0}%`, icon: '📊', color: '#10b981' },
        { label: 'Consultations / jour', value: `${appointmentsLast7 ? Math.round(appointmentsLast7 / 7) : 0}`, icon: '🗓️', color: '#f59e0b' },
        { label: 'Patients actifs', value: `${activePatientIds.size}`, icon: '🏥', color: '#0ea5e9' },
        { label: 'Factures impayées', value: `${Math.round(totalUnpaid)} €`, icon: '💳', color: '#ef4444' }
      ],
      charts: {
        appointmentsPerDay: { labels: appointmentsLabels, values: appointmentsValues },
        consultationsByDoctor: { labels: doctorLabels, values: doctorValues },
        patientsByStatus: { labels: patientStatusLabels, values: patientStatusValues },
        revenueVsUnpaid: { labels: revenueLabels, values: revenueValues }
      },
      recentActivities,
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