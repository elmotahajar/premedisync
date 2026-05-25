const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET — Tous les RDV
router.get('/', (req, res) => {
  const sql = `
    SELECT r.id, r.dateHeure, r.duree, r.motif, r.statut,
           u.nom, u.prenom, r.id_patient
    FROM RendezVous r
    JOIN Utilisateur u ON r.id_patient = u.id
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET — RDV d'un patient
router.get('/patient/:id', (req, res) => {
  db.query('SELECT * FROM RendezVous WHERE id_patient = ?', 
  [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST — Créer un RDV
router.post('/', (req, res) => {
  const { dateHeure, duree, motif, statut, id_patient, id_creneau } = req.body;
  const sql = `INSERT INTO RendezVous (dateHeure, duree, motif, statut, id_patient, id_creneau) 
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.query(sql, [dateHeure, duree, motif, statut, id_patient, id_creneau], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ RDV créé !', id: result.insertId });
  });
});

// PUT — Modifier statut RDV
router.put('/:id', (req, res) => {
  const { statut, motif } = req.body;
  const sql = `UPDATE RendezVous SET statut=?, motif=? WHERE id=?`;
  db.query(sql, [statut, motif, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ RDV modifié !' });
  });
});

// DELETE — Annuler un RDV
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM RendezVous WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ RDV annulé !' });
  });
});

module.exports = router;