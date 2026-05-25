const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET — Tous les dossiers
router.get('/', (req, res) => {
  db.query('SELECT * FROM DossierMedical', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET — Dossier d'un patient
router.get('/patient/:id', (req, res) => {
  db.query('SELECT * FROM DossierMedical WHERE id_patient = ?', 
  [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST — Créer un dossier
router.post('/', (req, res) => {
  const { id_patient } = req.body;
  const sql = `INSERT INTO DossierMedical (dateCreation, date, id_patient) 
               VALUES (NOW(), NOW(), ?)`;
  db.query(sql, [id_patient], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Dossier créé !', id: result.insertId });
  });
});

// DELETE — Supprimer un dossier
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM DossierMedical WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Dossier supprimé !' });
  });
});

module.exports = router;