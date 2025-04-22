const { ProfessionnelSante, PersonneAgee } = require('./userModel');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'elderly-care-secret-key';

// Helper function to generate JWT token
const generateToken = (user, userType) => {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      userType: userType 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Helper function to sanitize user object (remove password)
const sanitizeUser = (user) => {
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

// GET all professionals
const getProfessionnels = async (req, res) => {
  try {
    const professionnels = await ProfessionnelSante.find().select('-password');
    res.json(professionnels);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET all elderly persons
const getPersonnesAgees = async (req, res) => {
  try {
    const personnesAgees = await PersonneAgee.find().select('-password');
    res.json(personnesAgees);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET professional by ID
const getProfessionnelById = async (req, res) => {
  try {
    const professionnel = await ProfessionnelSante.findById(req.params.id).select('-password');
    if (!professionnel) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    res.json(professionnel);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// GET elderly person by ID
const getPersonneAgeeById = async (req, res) => {
  try {
    const personneAgee = await PersonneAgee.findById(req.params.id).select('-password');
    if (!personneAgee) {
      return res.status(404).json({ error: 'Elderly person not found' });
    }
    res.json(personneAgee);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE professional
const updateProfessionnel = async (req, res) => {
  try {
    const { prenom, nom, specialite, telephone, email } = req.body;
    const updatedProfessionnel = await ProfessionnelSante.findByIdAndUpdate(
      req.params.id,
      { prenom, nom, specialite, telephone, email },
      { new: true }
    ).select('-password');
    
    if (!updatedProfessionnel) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    
    res.json(updatedProfessionnel);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE elderly person
const updatePersonneAgee = async (req, res) => {
  try {
    const { prenom, nom, dateNaissance, adresse, telephone, email } = req.body;
    const updatedPersonneAgee = await PersonneAgee.findByIdAndUpdate(
      req.params.id,
      { prenom, nom, dateNaissance, adresse, telephone, email },
      { new: true }
    ).select('-password');
    
    if (!updatedPersonneAgee) {
      return res.status(404).json({ error: 'Elderly person not found' });
    }
    
    res.json(updatedPersonneAgee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE professional
const deleteProfessionnel = async (req, res) => {
  try {
    const deletedProfessionnel = await ProfessionnelSante.findByIdAndDelete(req.params.id);
    
    if (!deletedProfessionnel) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    
    res.json({ message: 'Professional deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// DELETE elderly person
const deletePersonneAgee = async (req, res) => {
  try {
    const deletedPersonneAgee = await PersonneAgee.findByIdAndDelete(req.params.id);
    
    if (!deletedPersonneAgee) {
      return res.status(404).json({ error: 'Elderly person not found' });
    }
    
    res.json({ message: 'Elderly person deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// REGISTER a new professional
const registerProfessionnel = async (req, res) => {
  try {
    const { prenom, nom, specialite, telephone, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await ProfessionnelSante.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new professional
    const newProfessionnel = new ProfessionnelSante({ 
      prenom, 
      nom, 
      specialite, 
      telephone, 
      email, 
      password,
      userType: 'PROFESSIONNEL_SANTE',
      disponibilites: []
    });
    
    const savedProfessionnel = await newProfessionnel.save();
    
    // Generate JWT token
    const token = generateToken(savedProfessionnel, 'PROFESSIONNEL_SANTE');
    
    res.status(201).json({
      message: 'Professional registered successfully',
      token,
      type: 'PROFESSIONNEL_SANTE',
      user: sanitizeUser(savedProfessionnel)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// REGISTER a new elderly person
const registerPersonneAgee = async (req, res) => {
  try {
    const { prenom, nom, dateNaissance, adresse, telephone, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await PersonneAgee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }
    
    // Create new elderly person
    const newPersonneAgee = new PersonneAgee({ 
      prenom, 
      nom, 
      dateNaissance, 
      adresse, 
      telephone, 
      email, 
      password,
      userType: 'PERSONNE_AGEE'
    });
    
    const savedPersonneAgee = await newPersonneAgee.save();
    
    // Generate JWT token
    const token = generateToken(savedPersonneAgee, 'PERSONNE_AGEE');
    
    res.status(201).json({
      message: 'Elderly person registered successfully',
      token,
      type: 'PERSONNE_AGEE',
      user: sanitizeUser(savedPersonneAgee)
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// LOGIN - Authenticate a user
const login = async (req, res) => {
  try {
    const { email, password, type } = req.body;
    
    let user;
    let userType;
    
    // Find user by email and type
    if (type === 'PROFESSIONNEL_SANTE') {
      user = await ProfessionnelSante.findOne({ email });
      userType = 'PROFESSIONNEL_SANTE';
    } else if (type === 'PERSONNE_AGEE') {
      user = await PersonneAgee.findOne({ email });
      userType = 'PERSONNE_AGEE';
    } else {
      return res.status(400).json({ error: 'Invalid user type' });
    }
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    
    // Generate JWT token
    const token = generateToken(user, userType);
    
    res.json({
      message: 'Login successful',
      token,
      type: userType,
      user: sanitizeUser(user)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// LOGOUT - End user session
const logout = async (req, res) => {
  try {
    // JWT is stateless, so we just return success
    // Client-side should remove the token
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Add availability slot for professional
const addAvailability = async (req, res) => {
  try {
    const { date, heureDebut, heureFin } = req.body;
    const professionnelId = req.params.id;
    
    const professionnel = await ProfessionnelSante.findById(professionnelId);
    if (!professionnel) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    
    professionnel.disponibilites.push({ date, heureDebut, heureFin });
    await professionnel.save();
    
    res.status(201).json({
      message: 'Availability added successfully',
      disponibilites: professionnel.disponibilites
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get professional's availability
const getAvailability = async (req, res) => {
  try {
    const professionnelId = req.params.id;
    
    const professionnel = await ProfessionnelSante.findById(professionnelId);
    if (!professionnel) {
      return res.status(404).json({ error: 'Professional not found' });
    }
    
    res.json(professionnel.disponibilites);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { 
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
};
