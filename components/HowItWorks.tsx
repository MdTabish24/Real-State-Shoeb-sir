'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function HowItWorks() {
  const [properties, setProperties] = useState<any[]>([]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties/list');
      const data = await res.json();
      if (data.success) {
        console.log('🏠 Properties loaded:', data.properties.length);
        setProperties(data.properties);
      }
    } catch (error) {
      console.error('❌ Error loading properties:', error);
    }
  };

  console.log('Properties state:', properties);
  
  const displayProperties = properties.length > 0 ? properties : [];

  return (
    <>
      {/* Welcome Section */}
      <section className="py-20 bg-[#C4F1F4]">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="pr-8"
            >
              <h3 className="text-2xl font-semibold text-[#544e49] mb-4">Welcome to</h3>
              <h2 className="text-4xl md:text-5xl font-bold text-[#544e49] mb-6">
                EstateHub
              </h2>
              <p className="text-lg text-[#544e49] leading-relaxed">
                From our prominent offices situated in Bhiwandi we deal with all aspects of residential and commercial property. We sell, let and manage property and we act on behalf of clients wanting to invest in rental apartments, or who are searching for a property for their own use…
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative h-96 rounded-lg overflow-hidden shadow-xl pl-8"
            >
              <Image
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
                alt="Estate Office"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#544e49] mb-6">
              Place your trust in us
            </h2>
            <p className="text-lg text-[#544e49] leading-relaxed">
              The EstateHub Group was established in 2025. For many years we have been recognised as specialists in residential sales, rentals, property management and investment. Since our start in Bromley we have since grown and expanded and moved location, and now operate from Central London Westminster and Pimlico Estate and Letting Agent offices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Properties Section */}
      <section className="py-20 bg-[#C4F1F4]">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-semibold text-[#544e49] mb-2">A selection of our</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-[#544e49]">Available Properties</h2>
        </div>
        <div className="w-full px-2">
          {displayProperties.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-2xl text-[#544e49]">No properties available yet</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mx-auto">
            {displayProperties.map((property, index) => {
              const videoUrl = property.videoUrl || (property.images && property.images.find((url: string) => url && (url.includes('youtube.com') || url.includes('youtu.be'))));
              const displayImage = property.images?.find((img: string) => img && !img.includes('youtube')) || property.images?.[0] || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800';
              const videoId = videoUrl ? (videoUrl.includes('watch?v=') ? videoUrl.split('v=')[1]?.split('&')[0] : videoUrl.split('youtu.be/')[1]?.split('?')[0]) : null;
              
              return (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative h-[500px] group cursor-pointer overflow-hidden rounded-lg bg-gray-200"
              >
                {videoId ? (
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
                  <img
                    src={displayImage}
                    alt={property.propertyTitle || property.title}
                    className="w-full h-full object-cover"
                    loading="eager"
                    onError={(e) => {
                      console.log('Image failed:', e.currentTarget.src);
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800';
                    }}
                  />
                )}

                <div className="absolute bottom-0 left-0 bg-white p-4 max-w-xs group-hover:-translate-y-2 transition-transform duration-700 ease-in-out">
                  <h3 className="text-lg font-bold text-[#1e3a8a]">{property.propertyTitle || property.title}</h3>
                  <div className="max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-700 ease-in-out">
                    <p className="text-green-600 font-semibold mt-2 mb-3">₹{property.price}</p>
                    <Link href={`/properties/${property.id}`}>
                      <button className="border-2 border-green-600 text-green-600 px-6 py-2 font-semibold hover:bg-green-600 hover:text-white transition-colors">
                        More Details
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
              );
            })}
          </div>
          )}
        </div>
      </section>
    </>
  );
}
