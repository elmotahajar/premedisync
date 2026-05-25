const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET — Toutes les factures
router.get('/', (req, res) => {
  const sql = `
    SELECT f.id, f.date, f.montantTotal, f.statut,
           f.id_rendezvous, f.id_secretaire
    FROM Facture f
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET — Une facture par ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM Facture WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ message: 'Facture non trouvée' });
    res.json(results[0]);
  });
});

// POST — Créer une facture
router.post('/', (req, res) => {
  const { montantTotal, statut, id_rendezvous, id_secretaire } = req.body;
  const sql = `INSERT INTO Facture (date, montantTotal, statut, id_rendezvous, id_secretaire) 
               VALUES (NOW(), ?, ?, ?, ?)`;
  db.query(sql, [montantTotal, statut, id_rendezvous, id_secretaire], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Facture créée !', id: result.insertId });
  });
});

// PUT — Modifier une facture
router.put('/:id', (req, res) => {
  const { montantTotal, statut } = req.body;
  const sql = `UPDATE Facture SET montantTotal=?, statut=? WHERE id=?`;
  db.query(sql, [montantTotal, statut, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Facture modifiée !' });
  });
});

// DELETE — Supprimer une facture
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM Facture WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: '✅ Facture supprimée !' });
  });
});

module.exports = router;