const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET — Tous les patients
router.get('/', (req, res) => {
  const sql = `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone,
           p.numeroSecu, p.dateNaissance, p.adresse
    FROM Utilisateur u
    JOIN Patient p ON u.id = p.id_utilisateur
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET — Un patient par ID
router.get('/:id', (req, res) => {
  const sql = `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone,
           p.numeroSecu, p.dateNaissance, p.adresse
    FROM Utilisateur u
    JOIN Patient p ON u.id = p.id_utilisateur
    WHERE u.id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Patient non trouvé' });
    res.json(results[0]);
  });
});

// POST — Ajouter un patient
router.post('/', (req, res) => {
  const { id_utilisateur, numeroSecu, dateNaissance, adresse } = req.body;
  const sql = `INSERT INTO Patient (id_utilisateur, numeroSecu, dateNaissance, adresse) 
               VALUES (?, ?, ?, ?)`;
  db.query(sql, [id_utilisateur, numeroSecu, dateNaissance, adresse], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Patient ajouté !' });
  });
});

// PUT — Modifier un patient
router.put('/:id', (req, res) => {
  const { numeroSecu, dateNaissance, adresse } = req.body;
  const sql = `UPDATE Patient SET numeroSecu=?, dateNaissance=?, adresse=? 
               WHERE id_utilisateur=?`;
  db.query(sql, [numeroSecu, dateNaissance, adresse, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Patient modifié !' });
  });
});

// DELETE — Supprimer un patient
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Patient WHERE id_utilisateur = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Patient supprimé !' });
  });
});

module.exports = router;