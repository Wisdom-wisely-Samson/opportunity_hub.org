const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  organizationName: {
    type: String,
    required: [true, 'Organization name is required'],
    trim: true,
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  type: {
    type: String,
    enum: ['ngo', 'employer', 'university', 'training_provider', 'government', 'other'],
    default: 'other',
  },
  website: {
    type: String,
    match: [/^https?:\/\/.+/, 'Please enter a valid URL starting with http:// or https://'],
  },
  logo: {
    url: { type: String, default: '' },
    publicId: String,
  },
  contactEmail: {
    type: String,
    lowercase: true,
    trim: true,
  },
  contactPhone: String,
  address: String,
  country: String,
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String,
  },
  isVerified: { type: Boolean, default: false },
  verifiedAt: Date,
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true,
});

organizationSchema.index({ user: 1 });
organizationSchema.index({ isVerified: 1 });
organizationSchema.index({ type: 1 });

module.exports = mongoose.model('Organization', organizationSchema);
