const express = require('express');
const router = express.Router();
const { 
  getProfessionnels,
  getPersonnesAgees,
  getProfessionnelById,
  getPersonneAgeeById,
  updateProfessionnel,
  updatePersonneAgee,
  deleteProfessionnel,
  deletePersonneAgee,
  registerProfessionnel,
  registerPersonneAgee,
  login,
  logout,
  addAvailability,
  getAvailability
} = require('./userController');
const { verifyToken, isProfessionnel, isPersonneAgee, isResourceOwner } = require('./authMiddleware');

// Authentication routes
router.post('/auth/login', login);
router.post('/auth/register/professionnel', registerProfessionnel);
router.post('/auth/register/personneagee', registerPersonneAgee);
router.post('/auth/logout', logout);

// Public routes
router.get('/professionnels', getProfessionnels);

// Professional routes
router.get('/professionnels/:id', verifyToken, getProfessionnelById);
router.put('/professionnels/:id', verifyToken, isResourceOwner, updateProfessionnel);
router.delete('/professionnels/:id', verifyToken, isResourceOwner, deleteProfessionnel);

// Availability routes
router.get('/professionnels/:id/disponibilites', verifyToken, getAvailability);
router.post('/professionnels/:id/disponibilites', verifyToken, isProfessionnel, isResourceOwner, addAvailability);

// Elderly person routes
router.get('/personnesagees', verifyToken, isProfessionnel, getPersonnesAgees);
router.get('/personnesagees/:id', verifyToken, getPersonneAgeeById);
router.put('/personnesagees/:id', verifyToken, isResourceOwner, updatePersonneAgee);
router.delete('/personnesagees/:id', verifyToken, isResourceOwner, deletePersonneAgee);

module.exports = router;
