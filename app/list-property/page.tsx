'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, DollarSign, Home, Upload, CheckCircle, X } from 'lucide-react';

export default function ListProperty() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    builderName: '',
    builderPhone: '',
    builderEmail: '',
    propertyTitle: '',
    propertyType: '',
    location: '',
    city: '',
    price: '',
    beds: '',
    baths: '',
    area: '',
    description: '',
    amenities: [] as string[],
    possession: '',
  });
  
  const [files, setFiles] = useState<File[]>([]);
  const [floorPlan, setFloorPlan] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const amenitiesList = [
    'Swimming Pool', 'Gym', '24/7 Security', 'Power Backup',
    'Parking', 'Garden', 'Kids Play Area', 'Club House',
    'Lift', 'CCTV', 'Fire Safety', 'Intercom'
  ];

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      console.log('📁 Files selected:', newFiles.map(f => f.name));
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFloorPlanChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      console.log('📐 Floor plan selected:', e.target.files[0].name);
      setFloorPlan(e.target.files[0]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File) => {
    const isVideo = file.type.startsWith('video/');
    console.log(`📤 Uploading ${isVideo ? 'video' : 'file'}: ${file.name}`);
    
    const formData = new FormData();
    formData.append('file', file);
    
    if (isVideo) {
      formData.append('title', `Property Video - ${file.name}`);
      const res = await fetch('/api/upload/youtube', { method: 'POST', body: formData });
      const data = await res.json();
      console.log('✅ YouTube upload result:', data);
      return data.url;
    } else {
      formData.append('folder', 'properties');
      const res = await fetch('/api/upload/imagekit', { method: 'POST', body: formData });
      const data = await res.json();
      console.log('✅ ImageKit upload result:', data);
      return data.url;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      console.log('🚀 Starting property submission...');
      
      // Upload all files
      const uploadedUrls = [];
      let videoUrl = '';
      for (const file of files) {
        try {
          const url = await uploadFile(file);
          if (file.type.startsWith('video/')) {
            videoUrl = url;
          } else {
            uploadedUrls.push(url);
          }
        } catch (error) {
          console.error('❌ Upload failed for:', file.name, error);
          if (!file.type.startsWith('video/')) {
            throw error;
          }
        }
      }
      console.log('✅ All files uploaded:', uploadedUrls);
      
      // Upload floor plan
      let floorPlanUrl = '';
      if (floorPlan) {
        console.log('📐 Uploading floor plan...');
        const formData = new FormData();
        formData.append('file', floorPlan);
        formData.append('folder', 'floorplans');
        const res = await fetch('/api/upload/imagekit', { method: 'POST', body: formData });
        const data = await res.json();
        floorPlanUrl = data.url;
        console.log('✅ Floor plan uploaded:', floorPlanUrl);
      }
      
      // Save to Firestore
      const propertyData = {
        ...formData,
        images: uploadedUrls,
        videoUrl: videoUrl,
        floorPlan: floorPlanUrl,
      };
      
      console.log('💾 Saving to Firestore:', propertyData);
      const res = await fetch('/api/properties/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyData),
      });
      
      const result = await res.json();
      console.log('✅ Property saved:', result);
      
      setSubmitted(true);
    } catch (error) {
      console.error('❌ Submission error:', error);
      alert('Failed to submit property. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen pt-20 bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-12 shadow-2xl text-center max-w-md"
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Submission Successful!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for listing your property. Our team will verify the details and activate your listing within 24-48 hours.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.href = '/'}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
          >
            Back to Home
          </motion.button>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">List Your Property</h1>
          <p className="text-xl text-gray-600">Reach thousands of potential buyers</p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= s ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {s}
                </div>
                {s < 3 && <div className={`w-16 h-1 ${step > s ? 'bg-blue-600' : 'bg-gray-300'}`} />}
              </div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg"
        >
          <form onSubmit={handleSubmit}>
            {/* Step 1: Builder Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Builder Information</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Builder/Company Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.builderName}
                    onChange={(e) => setFormData({ ...formData, builderName: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Your company name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.builderPhone}
                      onChange={(e) => setFormData({ ...formData, builderPhone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="+91 98765 43210"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.builderEmail}
                      onChange={(e) => setFormData({ ...formData, builderEmail: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Property Details */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Property Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.propertyTitle}
                    onChange={(e) => setFormData({ ...formData, propertyTitle: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="e.g., Luxury 2BHK Apartment"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Property Type *
                    </label>
                    <select
                      required
                      value={formData.propertyType}
                      onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="">Select Type</option>
                      <option value="apartment">Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="flat">Flat</option>
                      <option value="penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="4500000"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Mumbai"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Location/Area *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Bhiwandi"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bedrooms *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.beds}
                      onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Bathrooms *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.baths}
                      onChange={(e) => setFormData({ ...formData, baths: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Area (sq ft) *
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="1200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                    placeholder="Describe your property..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Amenities & Photos */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Amenities & Additional Info</h2>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Select Amenities
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {amenitiesList.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.amenities.includes(amenity)}
                          onChange={() => handleAmenityToggle(amenity)}
                          className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Possession Status *
                  </label>
                  <select
                    required
                    value={formData.possession}
                    onChange={(e) => setFormData({ ...formData, possession: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select Status</option>
                    <option value="ready">Ready to Move</option>
                    <option value="under-construction">Under Construction</option>
                    <option value="upcoming">Upcoming</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Upload Photos/Videos *
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label
                    htmlFor="file-upload"
                    className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">Images, Videos, PDFs, Documents</p>
                  </label>
                  
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                          <span className="text-sm text-gray-700">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Floor Plan (Image/PDF)
                  </label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFloorPlanChange}
                    className="hidden"
                    id="floorplan-upload"
                  />
                  <label
                    htmlFor="floorplan-upload"
                    className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600 text-sm">Upload floor plan</p>
                  </label>
                  
                  {floorPlan && (
                    <div className="mt-2 bg-gray-50 p-3 rounded-lg">
                      <span className="text-sm text-gray-700">{floorPlan.name}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold"
                >
                  Previous
                </motion.button>
              )}
              
              {step < 3 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setStep(step + 1)}
                  className="ml-auto px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold"
                >
                  Next
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={uploading}
                  className="ml-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg font-semibold disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Submit Property'}
                </motion.button>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
