'use client';

import { useState, use, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Calendar, CheckCircle, Phone, Mail, User } from 'lucide-react';
import Image from 'next/image';

export default function PropertyDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [showFloorplan, setShowFloorplan] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      const res = await fetch(`/api/properties/get?id=${id}`);
      const data = await res.json();
      if (data.success) {
        console.log('🏠 Property loaded:', data.property);
        setProperty(data.property);
      }
    } catch (error) {
      console.error('❌ Error loading property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-20 bg-[#C4F1F4] flex items-center justify-center">
        <div className="text-2xl text-[#544e49]">Loading...</div>
      </main>
    );
  }

  if (!property) {
    return (
      <main className="min-h-screen pt-20 bg-[#C4F1F4] flex items-center justify-center">
        <div className="text-2xl text-[#544e49]">Property not found</div>
      </main>
    );
  }

  const dummyProperty = {
    id: id,
    title: 'Luxury Apartments in Prime Location',
    location: 'Bhiwandi, Mumbai',
    price: '₹45 Lakhs',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200',
    beds: 2,
    baths: 2,
    area: '1200 sq ft',
    type: 'Apartment',
    description: 'Experience luxury living in this beautifully designed 2BHK apartment. Located in the heart of Bhiwandi with excellent connectivity to Mumbai. Features modern amenities, spacious rooms, and premium finishes.',
    amenities: ['Swimming Pool', 'Gym', '24/7 Security', 'Power Backup', 'Parking', 'Garden', 'Kids Play Area', 'Club House'],
    builder: 'Premium Builders Pvt Ltd',
    possession: 'Ready to Move',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
    ],
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const propertyUrl = `${window.location.origin}/properties/${id}`;
      
      // Send email (will work when SendGrid is configured)
      fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          message: formData.message,
          propertyTitle: property.propertyTitle,
          propertyUrl: propertyUrl,
        }),
      }).catch(err => console.log('Email failed:', err));
      
      setSubmitted(true);
      
      // Open WhatsApp immediately
      setTimeout(() => {
        const whatsappMessage = `Hi, I'm interested in *${property.propertyTitle}*\n\n*Name:* ${formData.name}\n*Phone:* ${formData.phone}\n*Email:* ${formData.email || 'Not provided'}\n*Message:* ${formData.message || 'No message'}\n\n*View Property:* ${propertyUrl}`;
        const whatsappUrl = `https://wa.me/919370944107?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappUrl, '_blank');
        setSubmitted(false);
        setShowForm(false);
        setFormData({ name: '', phone: '', email: '', message: '' });
      }, 1000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <main className="min-h-screen pt-20 bg-[#C4F1F4]">
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold text-[#544e49] mb-2">{property.propertyTitle}</h1>
        <p className="text-xl text-[#544e49] mb-8">{property.location}, {property.city}</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Images */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Main Image/Video Slider */}
              <div className="relative h-[600px] mb-4 group">
                {(() => {
                  const allMedia = property.images || [];
                  const currentMedia = allMedia[currentImageIndex];
                  const isVideo = currentMedia && (currentMedia.includes('youtube.com') || currentMedia.includes('youtu.be'));
                  
                  if (isVideo) {
                    const videoId = currentMedia.includes('watch?v=') ? currentMedia.split('v=')[1]?.split('&')[0] : currentMedia.split('youtu.be/')[1]?.split('?')[0];
                    return (
                      <div className="relative w-full h-full">
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=1&rel=0&modestbranding=1`}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          title="Property Video"
                        />
                      </div>
                    );
                  }
                  
                  return (
                    <Image
                      src={currentMedia || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200'}
                      alt={property.propertyTitle}
                      fill
                      className="object-cover"
                    />
                  );
                })()}
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? (property.images?.length || 1) - 1 : prev - 1))}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  &lt;
                </button>
                <button
                  onClick={() => setCurrentImageIndex((prev) => (prev === (property.images?.length || 1) - 1 ? 0 : prev + 1))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                >
                  &gt;
                </button>
              </div>

              {/* Image/Video Gallery Thumbnails */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {(property.images || []).filter(img => img).map((img, index) => {
                  const isVideo = img.includes('youtube.com') || img.includes('youtu.be');
                  return (
                    <div
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative h-24 min-w-[120px] border-2 cursor-pointer ${
                        currentImageIndex === index ? 'border-blue-600' : 'border-[#544e49]'
                      }`}
                    >
                      {isVideo ? (
                        <div className="w-full h-full bg-black flex items-center justify-center">
                          <span className="text-white text-4xl">▶</span>
                        </div>
                      ) : (
                        <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-6">
                <button 
                  onClick={() => setShowFloorplan(true)}
                  className="bg-[#0a2540] text-white px-6 py-3 font-semibold hover:bg-[#0a2540]/90 transition-colors"
                >
                  Floorplan
                </button>
              </div>


            </motion.div>
          </div>

          {/* Right - Price & Features */}
          <div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="pl-8"
            >
              <h2 className="text-5xl font-bold text-green-600 mb-6 pb-4 border-b-2 border-gray-300">₹{property.price}</h2>
              
              <button 
                onClick={() => setShowForm(!showForm)}
                className="w-full bg-[#00a8e8] text-white py-4 font-bold text-lg mb-8 hover:bg-[#0096d1] transition-colors"
              >
                MAKE ENQUIRY
              </button>

              <h3 className="text-xl font-bold text-[#544e49] mb-4">FEATURES:</h3>
              <ul className="space-y-3 text-[#544e49] text-lg">
                <li className="flex items-start"><span className="text-green-600 mr-3">●</span> {property.beds} Bedrooms - {property.baths} Bathrooms</li>
                <li className="flex items-start"><span className="text-green-600 mr-3">●</span> {property.area} sq ft</li>
                <li className="flex items-start"><span className="text-green-600 mr-3">●</span> {property.propertyType}</li>
                <li className="flex items-start"><span className="text-green-600 mr-3">●</span> {property.possession}</li>
                {(property.amenities || []).slice(0, 4).map((amenity, index) => (
                  <li key={index} className="flex items-start"><span className="text-green-600 mr-3">●</span> {amenity}</li>
                ))}
              </ul>
            </motion.div>

          </div>
        </div>

        {/* Property Summary - Full Width */}
        <div id="property-summary" className="bg-white p-8 mt-8">
          <h2 className="text-2xl font-bold text-[#544e49] mb-4">Property Summary</h2>
          <p className="text-[#544e49] leading-relaxed">{property.description}</p>
        </div>





        {/* Floorplan Popup */}
        {showFloorplan && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowFloorplan(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#544e49]">Floor Plan</h2>
                <button onClick={() => setShowFloorplan(false)} className="text-2xl text-[#544e49] hover:text-red-600">
                  ×
                </button>
              </div>
              {property.floorPlan ? (
                property.floorPlan.endsWith('.pdf') ? (
                  <iframe
                    src={property.floorPlan}
                    className="w-full h-[600px]"
                    title="Floor Plan PDF"
                  />
                ) : (
                  <div className="relative h-[600px]">
                    <Image
                      src={property.floorPlan}
                      alt="Floor Plan"
                      fill
                      className="object-contain"
                    />
                  </div>
                )
              ) : (
                <div className="relative h-[600px]">
                  <Image
                    src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200"
                    alt="Floor Plan"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Enquiry Form Popup */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowForm(false)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-[#544e49]">Contact Us</h2>
                <button onClick={() => setShowForm(false)} className="text-2xl text-[#544e49] hover:text-red-600">
                  ×
                </button>
              </div>
              
              {submitted ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center py-8"
                >
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Thank You!</h3>
                  <p className="text-gray-600">We'll contact you shortly</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Your name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Message
                    </label>
                    <textarea
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      placeholder="Tell us about your requirements..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-[#00a8e8] text-white py-4 font-bold hover:bg-[#0096d1] transition-colors"
                  >
                    Submit Enquiry
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </div>
    </main>
  );
}
