'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowRight, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function PropertiesPage() {
  const [allProperties, setAllProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties/list?limit=100');
      const data = await res.json();
      if (data.success) {
        console.log('🏠 Properties loaded:', data.properties.length);
        setAllProperties(data.properties);
      }
    } catch (error) {
      console.error('❌ Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const [filters, setFilters] = useState({
    category: 'buy',
    minPrice: '',
    maxPrice: '',
    minRent: '',
    maxRent: '',
    minBeds: '',
    type: '',
    minFloorArea: '',
    maxFloorArea: '',
  });

  const filteredProperties = allProperties.filter((property) => {
    if (filters.type && property.propertyType !== filters.type) return false;
    if (filters.minBeds && parseInt(property.beds) < parseInt(filters.minBeds)) return false;
    if (filters.minPrice && parseInt(property.price) < parseInt(filters.minPrice)) return false;
    if (filters.maxPrice && parseInt(property.price) > parseInt(filters.maxPrice)) return false;
    if (filters.minFloorArea && parseInt(property.area) < parseInt(filters.minFloorArea)) return false;
    if (filters.maxFloorArea && parseInt(property.area) > parseInt(filters.maxFloorArea)) return false;
    return true;
  });

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  if (loading) {
    return (
      <main className="min-h-screen pt-20 bg-[#C4F1F4] flex items-center justify-center">
        <div className="text-2xl text-[#544e49]">Loading properties...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-20 bg-[#C4F1F4]">
      <div className="w-full px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-[#544e49] mb-4">Browse Properties</h1>
            <p className="text-xl text-[#544e49]">Find your perfect home from our verified listings</p>
          </motion.div>
        </div>

        {/* Top Filter Bar */}
        <div className="max-w-7xl mx-auto mb-8">
          <div className="bg-[#2c3e50] p-6 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Category Radio Buttons */}
              <div className="lg:col-span-1 space-y-2">
                <label className="flex items-center text-white cursor-pointer">
                  <input type="radio" name="category" value="buy" checked={filters.category === 'buy'} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="mr-2" />
                  Buy
                </label>
                <label className="flex items-center text-white cursor-pointer">
                  <input type="radio" name="category" value="rent" checked={filters.category === 'rent'} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="mr-2" />
                  Rent
                </label>
              </div>

              {/* Conditional Price/Rent Filters */}
              {filters.category === 'buy' ? (
                <>
                  <div className="space-y-2">
                    <label className="block text-white font-semibold">Min Price</label>
                    <select value={filters.minPrice} onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })} className="w-full px-3 py-2 rounded">
                      <option value="">No preference</option>
                      <option value="1000000">₹10 Lakhs</option>
                      <option value="5000000">₹50 Lakhs</option>
                      <option value="10000000">₹1 Crore</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white font-semibold">Max Price</label>
                    <select value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })} className="w-full px-3 py-2 rounded">
                      <option value="">No preference</option>
                      <option value="5000000">₹50 Lakhs</option>
                      <option value="10000000">₹1 Crore</option>
                      <option value="50000000">₹5 Crore</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block text-white font-semibold">Min Rent</label>
                    <select value={filters.minRent} onChange={(e) => setFilters({ ...filters, minRent: e.target.value })} className="w-full px-3 py-2 rounded">
                      <option value="">No preference</option>
                      <option value="10000">₹10,000</option>
                      <option value="25000">₹25,000</option>
                      <option value="50000">₹50,000</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-white font-semibold">Max Rent</label>
                    <select value={filters.maxRent} onChange={(e) => setFilters({ ...filters, maxRent: e.target.value })} className="w-full px-3 py-2 rounded">
                      <option value="">No preference</option>
                      <option value="25000">₹25,000</option>
                      <option value="50000">₹50,000</option>
                      <option value="100000">₹1,00,000</option>
                    </select>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <label className="block text-white font-semibold">Min Beds</label>
                <select value={filters.minBeds} onChange={(e) => setFilters({ ...filters, minBeds: e.target.value })} className="w-full px-3 py-2 rounded">
                  <option value="">No preference</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-white font-semibold">Type</label>
                <select value={filters.type} onChange={(e) => setFilters({ ...filters, type: e.target.value })} className="w-full px-3 py-2 rounded">
                  <option value="">No Preference</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="flat">Flat</option>
                  <option value="penthouse">Penthouse</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-white font-semibold">Min Floor Area</label>
                <select value={filters.minFloorArea} onChange={(e) => setFilters({ ...filters, minFloorArea: e.target.value })} className="w-full px-3 py-2 rounded">
                  <option value="">No preference</option>
                  <option value="500">500 sq ft</option>
                  <option value="1000">1000 sq ft</option>
                  <option value="2000">2000 sq ft</option>
                </select>
              </div>

              {/* Third Row */}
              <div className="space-y-2">
                <label className="block text-white font-semibold">Max Floor Area</label>
                <select value={filters.maxFloorArea} onChange={(e) => setFilters({ ...filters, maxFloorArea: e.target.value })} className="w-full px-3 py-2 rounded">
                  <option value="">No preference</option>
                  <option value="1000">1000 sq ft</option>
                  <option value="2000">2000 sq ft</option>
                  <option value="5000">5000 sq ft</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="block text-white font-semibold">Type</label>
                <select className="w-full px-3 py-2 rounded">
                  <option>No preference</option>
                </select>
              </div>

              <div className="lg:col-span-2 flex items-end">
                <button className="w-full bg-[#7cb342] text-white py-3 rounded font-bold text-lg hover:bg-[#6a9b37] transition-colors">
                  SEARCH
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <p className="text-[#544e49] font-semibold">
              Showing <span className="font-bold">{filteredProperties.length}</span> properties
            </p>
          </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
                >
                  <div className="relative h-56 overflow-hidden">
                    {(() => {
                      const videoUrl = property.videoUrl || (property.images && property.images.find((url: string) => url && (url.includes('youtube.com') || url.includes('youtu.be'))));
                      const displayImage = property.images?.find((img: string) => img && !img.includes('youtube')) || property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';
                      const videoId = videoUrl ? (videoUrl.includes('watch?v=') ? videoUrl.split('v=')[1]?.split('&')[0] : videoUrl.split('youtu.be/')[1]?.split('?')[0]) : null;
                      
                      return videoId ? (
                        <div className="relative w-full h-full">
                          <iframe
                            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&disablekb=1&fs=0`}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            title="Property Video"
                          />
                          <div className="absolute inset-0 pointer-events-none"></div>
                        </div>
                      ) : (
                        <Image
                          src={displayImage}
                          alt={property.propertyTitle}
                          fill
                          className="object-cover hover:scale-110 transition-transform duration-500"
                        />
                      );
                    })()}
                    <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold z-10">
                      {formatPrice(parseInt(property.price))}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#544e49] mb-2">{property.propertyTitle}</h3>
                    <div className="flex items-center text-[#544e49] mb-4">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{property.location}, {property.city}</span>
                    </div>

                    <div className="flex items-center justify-between text-[#544e49] mb-4 pb-4 border-b">
                      <div className="flex items-center gap-1">
                        <Bed className="w-5 h-5" />
                        <span>{property.beds}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="w-5 h-5" />
                        <span>{property.baths}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Square className="w-5 h-5" />
                        <span>{property.area} sq ft</span>
                      </div>
                    </div>

                    <Link href={`/properties/${property.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
                      >
                        View Details <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
        </div>
      </div>
    </main>
  );
}
