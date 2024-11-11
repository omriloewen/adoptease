const Candidate = require('../models/candidateModel');

// Add a candidate
const addCandidate = async (req, res) => {
  const { name, phoneNumber, wantedDog, interviewer, score } = req.body;

  try {
    const candidate = await Candidate.create({
      name,
      phoneNumber,
      wantedDog,
      interviewer,
      score,
      colorMark : ''
    });
    res.status(201).json(candidate);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// View all candidates
const getCandidates = async (req, res) => {
  try {
    const candidates = await Candidate.findAll();
    res.json(candidates);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update candidate
const updateCandidate = async (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;
  
    try {
      const candidate = await Candidate.findByPk(id);
  
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      await candidate.update(updatedData);
      res.status(200).json({ message: 'Candidate updated successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error updating candidate', error });
    }
  };

  const updateUserColorMark = async (req, res) => {
    const { id } = req.params;
    const { colorMark } = req.body;  // Only accept the role field from the request body
  
    try {
      const candidate = await Candidate.findByPk(id);
  
      if (!candidate) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Ensure that only the role field is updated
      await candidate.update({ colorMark });
  
      res.status(200).json({ message: 'candidate colorMark updated successfully' });
    } catch (error) {
      console.error('Error updating candidate colorMark:', error.message);  // Log the specific error
      res.status(500).json({ message: 'Error updating candidate colorMark', error: error.message });
    }
  };
  
  // Delete candidate
  const deleteCandidate = async (req, res) => {
    const { id } = req.params;
  
    try {
      const candidate = await Candidate.findByPk(id);
  
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      await candidate.destroy();
      res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting candidate', error });
    }
  };

  const getCandidateById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const candidate = await Candidate.findByPk(id);  // Find the user by primary key (ID)
  
      if (!candidate) {
        return res.status(404).json({ message: 'Candidate not found' });
      }
  
      res.status(200).json(candidate);  // Send back the user data
    } catch (error) {
      console.error('Error fetching candidate by ID:', error);
      res.status(500).json({ message: 'Error fetching candidate by ID' });
    }
  };

module.exports = { addCandidate, getCandidates, updateCandidate, deleteCandidate, getCandidateById, updateUserColorMark};