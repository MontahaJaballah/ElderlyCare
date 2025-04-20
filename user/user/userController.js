const User = require('./userModel');

// GET all users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET single user by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// POST create new user
const createUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newUser = new User({ name, email, age });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT update user
const updateUser = async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, age },
      { new: true }
    ).select('-password');
    
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE user
const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// SIGNUP - Register a new user
const signup = async (req, res) => {
  try {
    const { name, email, password, age } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new user
    const newUser = new User({ name, email, password, age });
    const savedUser = await newUser.save();
    
    // Return user without password
    const userResponse = savedUser.toObject();
    delete userResponse.password;
    
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN - Authenticate a user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({ message: 'Login successful', user: userResponse });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGOUT - End user session
const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
  getUsers, 
  getUserById, 
  createUser, 
  updateUser, 
  deleteUser,
  signup,
  login,
  logout
};
