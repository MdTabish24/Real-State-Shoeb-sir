'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import HowItWorks from '@/components/HowItWorks';
import Image from 'next/image';

export default function Home() {
  const [currentWord, setCurrentWord] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const words = ['reliable', 'professional', 'local', 'personal'];

  useEffect(() => {
    const word = words[currentWord];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < word.length) {
          setDisplayText(word.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentWord((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);
    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentWord]);

  return (
    <main className="min-h-screen bg-[#C4F1F4]">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/frontpg.jpg"
            alt="Real Estate Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4 max-w-7xl mx-auto py-20"
        >
          {/* Premium Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-full mb-8"
          >
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white font-semibold">India's Premium Real Estate Platform</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight"
          >
            Find Your{' '}
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 animate-gradient">
                Dream Home
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              />
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-2xl md:text-3xl text-gray-300 mb-16 font-light"
          >
            Connect with <span className="text-blue-400 font-semibold">verified builders</span>.
            Experience <span className="text-cyan-400 font-semibold">hassle-free</span> property buying.
          </motion.p>

          <SearchBar />

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 flex flex-wrap justify-center gap-8"
          >

          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2"
            >
              <motion.div className="w-1 h-2 bg-white rounded-full" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* Typing Animation Section */}
      <section className="py-20 bg-[#C4F1F4]">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#544e49] mb-4">
              At EstateHub, we take greate pride in sincerely offering a{' '}
              <span className="text-blue-600">
                {displayText}
                <span className="animate-pulse">|</span>
              </span>
              {' '}service
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Property Action Cards */}
      <section className="pt-4 pb-20 bg-[#C4F1F4]">
        <div className="w-full px-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'rent', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600' },
              { title: 'let', image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=600' },
              { title: 'buy', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600' },
              { title: 'Sell', image: 'https://images.unsplash.com/photo-1560184897-ae75f418493e?w=600' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="relative h-96 rounded-lg overflow-hidden group cursor-pointer"
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-3xl font-bold mb-2">Looking to</h3>
                  <h2 className="text-white text-4xl font-black mb-4">{item.title}</h2>
                  <Link href="/properties">
                    <button className="bg-white text-[#544e49] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-fit">
                      Find out more
                    </button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      <HowItWorks />
    </main>
  );
}
