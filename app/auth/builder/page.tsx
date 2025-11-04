'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Building2, Phone, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BuilderAuth() {
  const [mode, setMode] = useState<'login' | 'signup' | 'otp'>('login');
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Login
    email: '',
    password: '',
    otp: '',
    
    // Signup - Personal
    fullName: '',
    phone: '',
    
    // Signup - Company
    companyName: '',
    companyAddress: '',
    gstNumber: '',
    panNumber: '',
    
    // Signup - Documents
    registrationCertificate: null as File | null,
    gstCertificate: null as File | null,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Login successful! Redirecting...');
        // TODO: Store session and redirect to dashboard
        window.location.href = '/list-property';
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      alert('Error logging in. Please try again.');
    }
  };

  const handleSignupStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('OTP sent to your email! Please check your inbox.');
        setMode('otp');
      } else {
        alert(data.error || 'Failed to send OTP');
      }
    } catch (error) {
      alert('Error sending OTP. Please try again.');
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          otp: formData.otp,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        alert('Email verified successfully!');
        setMode('signup');
        setStep(2);
      } else {
        alert(data.error || 'Invalid OTP');
      }
    } catch (error) {
      alert('Error verifying OTP. Please try again.');
    }
  };

  const handleSignupComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          phone: formData.phone,
          companyName: formData.companyName,
          companyAddress: formData.companyAddress,
          gstNumber: formData.gstNumber,
          panNumber: formData.panNumber,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStep(4); // Show success message
      } else {
        alert(data.error || 'Registration failed');
      }
    } catch (error) {
      alert('Error during registration. Please try again.');
    }
    console.log('Signup complete:', formData);
    // Show success message
    setStep(4);
  };

  return (
    <main className="min-h-screen pt-20 bg-[#C4F1F4]">
      <div className="max-w-6xl mx-auto px-4 py-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#544e49] mb-4">
            {mode === 'login' ? 'Builder Login' : 'Builder Registration'}
          </h1>
          <p className="text-xl text-[#544e49]">
            {mode === 'login' 
              ? 'Login to manage your properties' 
              : 'Register to list your properties'}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Left Side - Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a2540] rounded-2xl p-8 text-white"
          >
            <h2 className="text-3xl font-bold mb-6">Why List With Us?</h2>
            
            <div className="space-y-6">
              {[
                { icon: Building2, title: 'Verified Platform', desc: 'Only verified builders can list properties' },
                { icon: User, title: 'Quality Leads', desc: 'Get genuine buyer enquiries' },
                { icon: CheckCircle, title: 'Easy Management', desc: 'Manage all your properties in one place' },
                { icon: Phone, title: 'Direct Contact', desc: 'Connect directly with interested buyers' },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                    <p className="text-blue-100">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-white/10 rounded-xl backdrop-blur-sm">
              <p className="text-sm text-blue-100 mb-2">📋 Required Documents:</p>
              <ul className="text-sm space-y-1">
                <li>• Company Registration Certificate</li>
                <li>• GST Certificate</li>
                <li>• PAN Card</li>
                <li>• Valid Phone Number</li>
              </ul>
            </div>
          </motion.div>

          {/* Right Side - Forms */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl p-8 shadow-xl"
          >
            <AnimatePresence mode="wait">
              
              {/* Login Form */}
              {mode === 'login' && (
                <motion.form
                  key="login"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleLogin}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    Login
                  </motion.button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => { setMode('signup'); setStep(1); }}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Don't have an account? Sign up
                    </button>
                  </div>
                </motion.form>
              )}

              {/* OTP Verification */}
              {mode === 'otp' && (
                <motion.form
                  key="otp"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleVerifyOTP}
                  className="space-y-6"
                >
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Verify Your Email</h3>
                    <p className="text-gray-600">
                      We've sent a 6-digit code to<br />
                      <span className="font-semibold">{formData.email}</span>
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={formData.otp}
                      onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-center text-2xl tracking-widest"
                      placeholder="000000"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                  >
                    Verify OTP
                  </motion.button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => console.log('Resend OTP')}
                      className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
                    >
                      Didn't receive code? Resend
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Signup Step 1 - Email & Password */}
              {mode === 'signup' && step === 1 && (
                <motion.form
                  key="signup1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSignupStep1}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-blue-600">Step 1 of 3</span>
                      <span className="text-sm text-gray-500">Email Verification</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '33%' }}></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="your@company.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Create Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="password"
                        required
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="••••••••"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    Send OTP <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-blue-600 hover:text-blue-700 font-semibold"
                    >
                      Already have an account? Login
                    </button>
                  </div>
                </motion.form>
              )}

              {/* Signup Step 2 - Personal & Company Details */}
              {mode === 'signup' && step === 2 && (
                <motion.form
                  key="signup2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={(e) => { e.preventDefault(); setStep(3); }}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-blue-600">Step 2 of 3</span>
                      <span className="text-sm text-gray-500">Personal & Company Info</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="ABC Builders Pvt Ltd"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Address *
                    </label>
                    <textarea
                      required
                      value={formData.companyAddress}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Complete address with city and pincode"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        GST Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.gstNumber}
                        onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="22AAAAA0000A1Z5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        PAN Number *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.panNumber}
                        onChange={(e) => setFormData({ ...formData, panNumber: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="AAAAA0000A"
                      />
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    Continue <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.form>
              )}

              {/* Signup Step 3 - Documents */}
              {mode === 'signup' && step === 3 && (
                <motion.form
                  key="signup3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSignupComplete}
                  className="space-y-6"
                >
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-semibold text-blue-600">Step 3 of 3</span>
                      <span className="text-sm text-gray-500">Upload Documents</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company Registration Certificate *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFormData({ ...formData, registrationCertificate: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      GST Certificate *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                      <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 5MB)</p>
                      <input
                        type="file"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFormData({ ...formData, gstCertificate: e.target.files?.[0] || null })}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-800">
                      <strong>Note:</strong> Your account will be reviewed by our admin team. 
                      You'll receive an email once your account is approved (usually within 24-48 hours).
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow flex items-center justify-center gap-2"
                  >
                    Submit for Approval <CheckCircle className="w-5 h-5" />
                  </motion.button>
                </motion.form>
              )}

              {/* Success Message */}
              {mode === 'signup' && step === 4 && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Registration Submitted!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for registering! Your account is pending admin approval.
                    We'll send you an email once your account is verified.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-sm text-blue-800">
                      <strong>What's next?</strong><br />
                      Our team will verify your documents and approve your account within 24-48 hours.
                      You'll receive login credentials via email.
                    </p>
                  </div>
                  <Link href="/">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                    >
                      Back to Home
                    </motion.button>
                  </Link>
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
