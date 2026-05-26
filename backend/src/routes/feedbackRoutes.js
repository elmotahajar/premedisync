const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  createFeedback,
  getAllFeedbacks,
  getFeedbacksMedecin,
  signalerProbleme
} = require('../controllers/feedbackController');

router.post('/', auth, createFeedback);
router.get('/', auth, getAllFeedbacks);
router.get('/medecin/:medecinId', auth, getFeedbacksMedecin);
router.post('/signalement', auth, signalerProbleme);

module.exports = router;