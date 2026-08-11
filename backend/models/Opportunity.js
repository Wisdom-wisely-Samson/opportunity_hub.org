const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [5000, 'Description cannot exceed 5000 characters'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['job', 'scholarship', 'grant', 'training', 'internship', 'fellowship', 'entrepreneurship'],
  },
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    default: null,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  isRemote: { type: Boolean, default: false },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
  },
  requirements: [{ type: String, trim: true }],
  benefits: [{ type: String, trim: true }],
  tags: [{ type: String, lowercase: true, trim: true }],
  status: {
    type: String,
    enum: ['active', 'closed', 'draft', 'expired'],
    default: 'active',
  },
  applicationCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },

  // Cover image
  coverImage: {
    url: { type: String, default: null },
    publicId: { type: String, default: null }, // Cloudinary public_id for deletion
  },

  // Type-specific fields
  salary: String,
  fundingAmount: String,
  duration: String,
  eligibility: String,
  howToApply: String,
  applicationType: {
    type: String,
    enum: ['internal', 'external'],
    default: 'internal',
  },
  externalLink: String,
}, {
  timestamps: true,
});

// Text search index
opportunitySchema.index({ title: 'text', description: 'text', tags: 'text' });
// Filter indexes
opportunitySchema.index({ category: 1 });
opportunitySchema.index({ status: 1 });
opportunitySchema.index({ deadline: 1 });
opportunitySchema.index({ organization: 1 });
opportunitySchema.index({ postedBy: 1 });
opportunitySchema.index({ createdAt: -1 });

// Auto-expire opportunities past deadline
opportunitySchema.pre('find', function () {
  // Optionally auto-update expired opportunities
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
