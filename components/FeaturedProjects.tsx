'use client';

import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const projects = [
  {
    id: 1,
    title: 'Luxury Apartments',
    location: 'Bhiwandi, Mumbai',
    price: '₹45 Lakhs',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800',
    beds: 2,
    baths: 2,
    area: '1200 sq ft',
    type: 'Apartment',
  },
  {
    id: 2,
    title: 'Modern Villas',
    location: 'Thane West',
    price: '₹1.2 Crores',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800',
    beds: 3,
    baths: 3,
    area: '2500 sq ft',
    type: 'Villa',
  },
  {
    id: 3,
    title: 'Premium Flats',
    location: 'Kalyan',
    price: '₹35 Lakhs',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
    beds: 2,
    baths: 2,
    area: '1000 sq ft',
    type: 'Flat',
  },
];

export default function FeaturedProjects() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Properties</h2>
          <p className="text-xl text-gray-600">Handpicked properties from verified builders</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                  {project.price}
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h3>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-4 h-4 mr-2" />
                  <span>{project.location}</span>
                </div>

                <div className="flex items-center justify-between text-gray-700 mb-6 pb-6 border-b">
                  <div className="flex items-center gap-1">
                    <Bed className="w-5 h-5" />
                    <span>{project.beds} Beds</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="w-5 h-5" />
                    <span>{project.baths} Baths</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Square className="w-5 h-5" />
                    <span>{project.area}</span>
                  </div>
                </div>

                <Link href={`/properties/${project.id}`}>
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

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link href="/properties">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              View All Properties
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
