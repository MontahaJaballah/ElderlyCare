const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  signup,
  login,
  logout
} = require('./userController');

// Authentication routes
router.post('/signup', signup);     // POST /api/users/signup
router.post('/login', login);       // POST /api/users/login
router.post('/logout', logout);     // POST /api/users/logout

// CRUD operations
router.get('/all', getUsers);                    // GET all users
router.get('/find/:id', getUserById);            // GET user by ID
router.post('/create', createUser);              // CREATE new user
router.put('/update/:id', updateUser);           // UPDATE user
router.delete('/delete/:id', deleteUser);        // DELETE user

module.exports = router;
