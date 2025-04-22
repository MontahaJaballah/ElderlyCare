const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Common schema fields for both user types
const baseUserFields = {
  prenom: { type: String, required: true },
  nom: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  telephone: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  userType: { type: String, required: true, enum: ['PROFESSIONNEL_SANTE', 'PERSONNE_AGEE'] }
};

// Schema for ProfessionnelSante
const professionnelSanteSchema = new mongoose.Schema({
  ...baseUserFields,
  specialite: { type: String, required: true, enum: [
    'GERIATRIE', 'CARDIOLOGIE', 'NEUROLOGIE', 'PSYCHIATRIE', 
    'ORTHOPEDISTE', 'OPHTALMOLOGUE', 'DERMATOLOGUE', 'GENERALISTE'
  ]},
  disponibilites: [{ 
    date: { type: String, required: true },
    heureDebut: { type: String, required: true },
    heureFin: { type: String, required: true }
  }]
});

// Schema for PersonneAgee
const personneAgeeSchema = new mongoose.Schema({
  ...baseUserFields,
  dateNaissance: { type: String, required: true },
  adresse: { type: String, required: true }
});

// Password hashing middleware
const hashPassword = async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) return next();
  
  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password along with the new salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
};

// Add pre-save middleware to both schemas
professionnelSanteSchema.pre('save', hashPassword);
personneAgeeSchema.pre('save', hashPassword);

// Method to compare passwords
const comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

professionnelSanteSchema.methods.comparePassword = comparePassword;
personneAgeeSchema.methods.comparePassword = comparePassword;

// Create models
const ProfessionnelSante = mongoose.model('ProfessionnelSante', professionnelSanteSchema);
const PersonneAgee = mongoose.model('PersonneAgee', personneAgeeSchema);

module.exports = { ProfessionnelSante, PersonneAgee };
