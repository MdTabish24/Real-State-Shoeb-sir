'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Bhiwandi',
    rating: 5,
    text: 'Found my dream 2BHK apartment within budget. The team was very professional and guided me through every step.',
    image: 'https://i.pravatar.cc/150?img=12',
  },
  {
    name: 'Priya Sharma',
    location: 'Thane',
    rating: 5,
    text: 'Excellent service! They helped me find a perfect villa for my family. Highly recommend their services.',
    image: 'https://i.pravatar.cc/150?img=45',
  },
  {
    name: 'Amit Patel',
    location: 'Kalyan',
    rating: 5,
    text: 'Very transparent process. No hidden charges. Got the best deal for my property investment.',
    image: 'https://i.pravatar.cc/150?img=33',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-xl text-gray-600">Real stories from real customers</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-2xl transition-shadow relative"
            >
              <Quote className="absolute top-6 right-6 w-12 h-12 text-blue-100" />
              
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">{testimonial.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
