const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { addCandidate, getCandidates, updateCandidate, deleteCandidate, getCandidateById, updateUserColorMark } = require('../controllers/candidateController');
const router = express.Router();

// Route for adding candidates (available to all roles)
router.post('/', protect, authorize('mc' ,'ac', 'manager'), addCandidate);

// Route for viewing candidates (available to input_view and input_view_modify)
router.get('/', protect, authorize('mc','vc', 'manager'), getCandidates);

router.get('/:id', protect, authorize('mc','manager'), getCandidateById); 


// Update candidate details (Only for managers)
router.put('/:id', protect, authorize('mc','manager'), updateCandidate);

// Delete a candidate (Only for managers)
router.delete('/:id', protect, authorize('mc','manager'), deleteCandidate);

router.put('/:id/colorMark', protect, authorize('manager','vc','mc'), updateUserColorMark);


module.exports = router;