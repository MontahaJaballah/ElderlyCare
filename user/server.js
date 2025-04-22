const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Create Express app
const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:4200', 'http://localhost:4201', 'http://localhost:4202'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Handle OPTIONS preflight requests
app.options('*', cors());

// MongoDB connection
const MONGO_URI = 'mongodb://127.0.0.1:27017/elderlycare';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'elderly-care-secret-key';

// User Schemas
const professionnelSanteSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  specialite: { type: String, required: true },
  userType: { type: String, default: 'PROFESSIONNEL_SANTE' },
  disponibilites: [{ 
    date: String, 
    heureDebut: String, 
    heureFin: String 
  }],
  createdAt: { type: Date, default: Date.now }
});

const personneAgeeSchema = new mongoose.Schema({
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  dateNaissance: { type: String, required: true },
  adresse: { type: String, required: true },
  userType: { type: String, default: 'PERSONNE_AGEE' },
  createdAt: { type: Date, default: Date.now }
});

// Password hashing middleware
professionnelSanteSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

personneAgeeSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Password comparison method
professionnelSanteSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

personneAgeeSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Models
const ProfessionnelSante = mongoose.model('ProfessionnelSante', professionnelSanteSchema);
const PersonneAgee = mongoose.model('PersonneAgee', personneAgeeSchema);

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

// Authentication Routes
app.post('/api/auth/register/professionnel', async (req, res) => {
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
      disponibilites: []
    });
    
    const savedProfessionnel = await newProfessionnel.save();
    
    // Generate JWT token
    const token = generateToken(savedProfessionnel, 'PROFESSIONNEL_SANTE');
    
    // Return user without password
    const userResponse = savedProfessionnel.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'Professional registered successfully',
      token,
      type: 'PROFESSIONNEL_SANTE',
      user: userResponse
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/register/personneagee', async (req, res) => {
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
      password
    });
    
    const savedPersonneAgee = await newPersonneAgee.save();
    
    // Generate JWT token
    const token = generateToken(savedPersonneAgee, 'PERSONNE_AGEE');
    
    // Return user without password
    const userResponse = savedPersonneAgee.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      message: 'Elderly person registered successfully',
      token,
      type: 'PERSONNE_AGEE',
      user: userResponse
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
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
    
    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.json({
      message: 'Login successful',
      token,
      type: userType,
      user: userResponse
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 ElderlyCare server running at http://localhost:${PORT}`);
});
