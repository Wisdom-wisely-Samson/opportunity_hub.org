const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const educationSchema = new mongoose.Schema({
  level: { type: String, enum: ['primary', 'secondary', 'vocational', 'bachelors', 'masters', 'phd', 'other'] },
  institution: String,
  field: String,
  startYear: Number,
  endYear: Number,
  current: { type: Boolean, default: false },
}, { _id: false });

const languageSchema = new mongoose.Schema({
  language: String,
  proficiency: { type: String, enum: ['basic', 'conversational', 'fluent', 'native'] },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
  },
  role: {
    type: String,
    enum: ['refugee', 'organization', 'admin'],
    default: 'refugee',
  },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationToken: { type: String, select: false },
  emailVerificationExpires: { type: Date, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },
  refreshToken: { type: String, select: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,

  // Refugee profile
  fullName: { type: String, trim: true },
  gender: { type: String, enum: ['male', 'female', 'other', 'prefer_not_to_say'] },
  dateOfBirth: Date,
  countryOfOrigin: String,
  currentLocation: String,
  refugeeStatus: {
    type: String,
    enum: ['refugee', 'asylum_seeker', 'internally_displaced', 'stateless', 'returnee', 'other'],
  },
  education: [educationSchema],
  skills: [{ type: String, trim: true }],
  languages: [languageSchema],
  bio: { type: String, maxlength: [500, 'Bio cannot exceed 500 characters'] },
  profilePicture: {
    url: { type: String, default: '' },
    publicId: String,
  },
  cv: {
    url: String,
    publicId: String,
    filename: String,
    uploadedAt: Date,
  },
}, {
  timestamps: true,
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ skills: 1 });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Instance methods
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.createEmailVerificationToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + parseInt(process.env.EMAIL_VERIFICATION_EXPIRES) || 86400000;
  return token;
};

userSchema.methods.createPasswordResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + parseInt(process.env.PASSWORD_RESET_EXPIRES) || 3600000;
  return token;
};

userSchema.methods.toPublicJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.emailVerificationToken;
  delete obj.emailVerificationExpires;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
