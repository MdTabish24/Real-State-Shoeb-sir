import mongoose from 'mongoose';

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
  },
  verified: {
    type: Boolean,
    default: false,
  },
  attempts: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Auto-delete expired OTPs after expiry
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Index for faster queries
OTPSchema.index({ email: 1, verified: 1 });

export default mongoose.models.OTP || mongoose.model('OTP', OTPSchema);
