const express = require('express');
const router = express.Router();
const db = require('../models/db');
const bcrypt = require('bcryptjs');

// GET — Tous les utilisateurs
router.get('/', (req, res) => {
  const sql = 'SELECT id, nom, prenom, email, telephone, dateCreation FROM Utilisateur';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET — Un utilisateur par ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Utilisateur WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(results[0]);
  });
});

// POST — Créer un utilisateur
router.post('/', async (req, res) => {
  const { nom, prenom, email, motDePasse, telephone } = req.body;
  const hash = await bcrypt.hash(motDePasse, 10);
  const sql = `INSERT INTO Utilisateur (nom, prenom, email, motDePasse, telephone, dateCreation) 
               VALUES (?, ?, ?, ?, ?, NOW())`;
  db.query(sql, [nom, prenom, email, hash, telephone], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Utilisateur créé !', id: result.insertId });
  });
});

// PUT — Modifier un utilisateur
router.put('/:id', (req, res) => {
  const { nom, prenom, email, telephone } = req.body;
  const sql = `UPDATE Utilisateur SET nom=?, prenom=?, email=?, telephone=? WHERE id=?`;
  db.query(sql, [nom, prenom, email, telephone, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Utilisateur modifié !' });
  });
});

// DELETE — Supprimer un utilisateur
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Utilisateur WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Utilisateur supprimé !' });
  });
});

module.exports = router;