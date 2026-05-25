const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const sequelize = require('./config');
const authRoutes = require('./routes/authRoutes');
const rendezVousRoutes = require('./routes/rendezVousRoutes');
const patientRoutes = require('./routes/patientRoutes');
const secretaireRoutes = require('./routes/secretaireRoutes');
const adminRoutes = require('./routes/adminRoutes');
const medecinRoutes = require('./routes/medecinRoutes');
const feedbackRoutes = require('./routes/feedbackRoutes');
const twoFARoutes = require('./routes/twoFARoutes');
const salleRoutes = require('./routes/salleRoutes');
const rapportRoutes = require('./routes/rapportRoutes');
const { demarrerTacheNotifications } = require('./controllers/notificationController');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MediSync API is running !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/secretaire', secretaireRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/medecin', medecinRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/auth/2fa', twoFARoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/admin/rapports', rapportRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

// Connexion base de données
sequelize.sync({ alter: true })
  .then(() => {
    console.log('✅ Base de données connectée');
    const PORT = process.env.PORT || 3000;
    demarrerTacheNotifications();
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur le port ${PORT}`);
    });
  })
  .catch((err) => console.error('❌ Erreur base de données:', err));