import mongoose from 'mongoose';

const LeadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    lowercase: true,
    trim: true,
  },
  message: {
    type: String,
  },
  propertyId: {
    type: String,
  },
  propertyTitle: {
    type: String,
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'site-visit', 'negotiation', 'closed', 'lost'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
LeadSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
LeadSchema.index({ createdAt: -1 });
LeadSchema.index({ status: 1 });

export default mongoose.models.Lead || mongoose.model('Lead', LeadSchema);
