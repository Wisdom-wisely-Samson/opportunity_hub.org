const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: [
      'application_submitted',
      'application_accepted',
      'application_rejected',
      'application_reviewed',
      'new_opportunity',
      'organization_verification', // 🔔 added for signup verification
      'organization_verified',     // 🔔 added for when org is approved
      'system',
    ],
    required: true,
  },
  title: { type: String, required: true },   // short heading
  message: { type: String, required: true }, // detailed text
  link: { type: String },                    // optional frontend route (e.g. "/org/verify")
  data: {
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity' },
    applicationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Application' },
    organizationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  isRead: { type: Boolean, default: false },
}, {
  timestamps: true,
});

// Indexes for fast queries
notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);

