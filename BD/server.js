const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Import routes
const utilisateursRoutes = require('./routes/utilisateurs');
const medecinsRoutes     = require('./routes/medecins');
const patientsRoutes     = require('./routes/patients');
const rdvRoutes          = require('./routes/rendezvous');
const dossiersRoutes     = require('./routes/dossiers');
const facturesRoutes     = require('./routes/factures');

// Utilisation routes
app.use('/api/utilisateurs', utilisateursRoutes);
app.use('/api/medecins',     medecinsRoutes);
app.use('/api/patients',     patientsRoutes);
app.use('/api/rendezvous',   rdvRoutes);
app.use('/api/dossiers',     dossiersRoutes);
app.use('/api/factures',     facturesRoutes);

// Test
app.get('/', (req, res) => {
  res.json({ message: '🏥 API Cabinet Médical fonctionne !' });
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Serveur sur http://localhost:${process.env.PORT}`);
});