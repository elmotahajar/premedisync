const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET — Tous les médecins
router.get('/', (req, res) => {
  const sql = `
    SELECT u.id, u.nom, u.prenom, u.email, u.telephone,
           m.specialite, m.numeroOrdre, m.tarif, m.secteur
    FROM Utilisateur u
    JOIN Medecin m ON u.id = m.id_utilisateur
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET — Un médecin par ID
router.get('/:id', (req, res) => {
  const sql = `
    SELECT u.id, u.nom, u.prenom, u.email,
           m.specialite, m.tarif, m.secteur
    FROM Utilisateur u
    JOIN Medecin m ON u.id = m.id_utilisateur
    WHERE u.id = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Médecin non trouvé' });
    res.json(results[0]);
  });
});

// POST — Ajouter un médecin
router.post('/', (req, res) => {
  const { id_utilisateur, specialite, numeroOrdre, tarif, secteur } = req.body;
  const sql = `INSERT INTO Medecin (id_utilisateur, specialite, numeroOrdre, tarif, secteur) 
               VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [id_utilisateur, specialite, numeroOrdre, tarif, secteur], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Médecin ajouté !' });
  });
});

// PUT — Modifier un médecin
router.put('/:id', (req, res) => {
  const { specialite, tarif, secteur } = req.body;
  const sql = `UPDATE Medecin SET specialite=?, tarif=?, secteur=? WHERE id_utilisateur=?`;
  db.query(sql, [specialite, tarif, secteur, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Médecin modifié !' });
  });
});

// DELETE — Supprimer un médecin
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Medecin WHERE id_utilisateur = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Médecin supprimé !' });
  });
});

module.exports = router;