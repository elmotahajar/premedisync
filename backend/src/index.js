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

// Static files
app.use('/uploads', express.static(require('path').join(__dirname, 'uploads')));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'MediSync API is running !' });
});

app.use('/api/auth', authRoutes);
app.use('/api/rendez-vous', rendezVousRoutes);
app.use('/api/rendezvous', rendezVousRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/secretaire', secretaireRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/medecin', medecinRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/avis', feedbackRoutes);
app.use('/api/auth/2fa', twoFARoutes);
app.use('/api/salles', salleRoutes);
app.use('/api/admin/rapports', rapportRoutes);

// ─── Custom patient-space routes ────────────────────────────
const auth = require('./middleware/auth');
const upload = require('./middleware/upload');
const { signalerProbleme, createFeedback, getAllFeedbacks } = require('./controllers/feedbackController');
const { getDossier, uploadDocument, getOrdonnances, getPatientById, updatePatientById } = require('./controllers/patientController');

// /api/signalements
const signalementsRouter = express.Router();
signalementsRouter.post('/', auth, signalerProbleme);
app.use('/api/signalements', signalementsRouter);

// /api/dossier/patient/:id  (GET + POST document)
const dossierRouter = express.Router();
dossierRouter.get('/patient/:id', auth, getDossier);
dossierRouter.post('/patient/:id/documents', auth, upload.single('document'), uploadDocument);
app.use('/api/dossier', dossierRouter);

// /api/prescriptions/patient/:id
const prescriptionsRouter = express.Router();
prescriptionsRouter.get('/patient/:id', auth, getOrdonnances);
app.use('/api/prescriptions', prescriptionsRouter);

// /api/avis/patient/:id  + POST /api/avis
const avisRouter = express.Router();
avisRouter.get('/patient/:id', auth, getAllFeedbacks);
avisRouter.get('/', auth, getAllFeedbacks);
avisRouter.post('/', auth, createFeedback);
app.use('/api/avis', avisRouter);

// /api/patients/:id  (GET + PUT for Paramètres)
const patientsRouter = express.Router();
patientsRouter.get('/:id', auth, getPatientById);
patientsRouter.put('/:id', auth, updatePatientById);
app.use('/api/patients', patientsRouter);

// 404 + error handlers
app.use((req, res) => {
  res.status(404).json({ message: 'Route introuvable' });
});

app.use((err, req, res, next) => {
  console.error('❌ Erreur serveur:', err);
  res.status(500).json({ message: 'Erreur serveur interne' });
});

// DB sync + start
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