import mongoose from 'mongoose';

const BuilderSchema = new mongoose.Schema({
  // Authentication
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  
  // Personal Info
  fullName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  
  // Company Info
  company: {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    gstNumber: {
      type: String,
      required: true,
    },
    panNumber: {
      type: String,
      required: true,
    },
  },
  
  // Documents
  documents: {
    registrationCertificate: String,
    gstCertificate: String,
  },
  
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  
  // Verification
  emailVerified: {
    type: Boolean,
    default: false,
  },
  
  // Metadata
  approvedBy: {
    type: String,
  },
  approvedAt: {
    type: Date,
  },
  rejectedAt: {
    type: Date,
  },
  rejectionReason: {
    type: String,
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
BuilderSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Indexes
BuilderSchema.index({ email: 1 });
BuilderSchema.index({ status: 1 });
BuilderSchema.index({ createdAt: -1 });

export default mongoose.models.Builder || mongoose.model('Builder', BuilderSchema);
