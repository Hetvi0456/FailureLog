const express = require('express');
const router = express.Router();
const {
  createFailure,
  getFailures,
  getFailureById,
  updateFailure,
  deleteFailure
} = require('../controllers/failure.controller');
const { protect } = require('../middleware/auth.middleware');

// Protect all failure routes
router.use(protect);

router.post('/', createFailure);
router.get('/', getFailures);
router.get('/:id', getFailureById);
router.put('/:id', updateFailure);
router.delete('/:id', deleteFailure);

module.exports = router;
