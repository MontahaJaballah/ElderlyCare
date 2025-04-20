const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser
} = require('../user/userController');

// CRUD routes
router.get('/all', getUsers);
router.get('/:id', getUserById);
router.post('/create', createUser);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

module.exports = router;
