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

// Public authentication routes
router.post('/auth/login', login);                                // POST /api/auth/login
router.post('/auth/register/professionnel', registerProfessionnel); // POST /api/auth/register/professionnel
router.post('/auth/register/personneagee', registerPersonneAgee);   // POST /api/auth/register/personneagee
router.post('/auth/logout', logout);                              // POST /api/auth/logout

// Public routes - Get all professionals (for appointment booking)
router.get('/professionnels', getProfessionnels);                    // GET all professionals

// Protected professional routes
router.get('/professionnels/:id', verifyToken, getProfessionnelById);             // GET professional by ID
router.put('/professionnels/:id', verifyToken, isResourceOwner, updateProfessionnel);  // UPDATE professional
router.delete('/professionnels/:id', verifyToken, isResourceOwner, deleteProfessionnel); // DELETE professional

// Protected availability routes (only professionals can manage their availability)
router.get('/professionnels/:id/disponibilites', verifyToken, getAvailability);   // GET professional's availability
router.post('/professionnels/:id/disponibilites', verifyToken, isProfessionnel, isResourceOwner, addAvailability);  // ADD availability slot

// Protected elderly person routes
router.get('/personnesagees', verifyToken, isProfessionnel, getPersonnesAgees);   // Only professionals can see all elderly persons
router.get('/personnesagees/:id', verifyToken, getPersonneAgeeById);              // GET elderly person by ID
router.put('/personnesagees/:id', verifyToken, isResourceOwner, updatePersonneAgee);  // UPDATE elderly person
router.delete('/personnesagees/:id', verifyToken, isResourceOwner, deletePersonneAgee); // DELETE elderly person

module.exports = router;
