'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Home, DollarSign } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    location: '',
    propertyType: '',
    budget: '',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchData.location) params.append('location', searchData.location);
    if (searchData.propertyType) params.append('type', searchData.propertyType);
    if (searchData.budget) params.append('budget', searchData.budget);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      onSubmit={handleSearch}
      className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 md:p-8 max-w-6xl mx-auto"
    >
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-3xl blur-xl"></div>
      
      <div className="relative grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative group">
          <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 group-hover:scale-110 transition-transform" />
          <input
            type="text"
            placeholder="City, Area"
            value={searchData.location}
            onChange={(e) => setSearchData({ ...searchData, location: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none text-gray-900 placeholder-gray-500 font-medium transition-all"
          />
        </div>

        <div className="relative group">
          <Home className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 group-hover:scale-110 transition-transform" />
          <select
            value={searchData.propertyType}
            onChange={(e) => setSearchData({ ...searchData, propertyType: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none text-gray-900 font-medium transition-all"
          >
            <option value="">Property Type</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="flat">Flat</option>
            <option value="penthouse">Penthouse</option>
          </select>
        </div>

        <div className="relative group">
          <DollarSign className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5 group-hover:scale-110 transition-transform" />
          <select
            value={searchData.budget}
            onChange={(e) => setSearchData({ ...searchData, budget: e.target.value })}
            className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none appearance-none text-gray-900 font-medium transition-all"
          >
            <option value="">Budget</option>
            <option value="0-25">Under 25L</option>
            <option value="25-50">25L - 50L</option>
            <option value="50-75">50L - 75L</option>
            <option value="75-100">75L - 1Cr</option>
            <option value="100+">1Cr+</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white py-4 px-8 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/60 transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 opacity-0 hover:opacity-100 transition-opacity"></div>
          <Search className="w-6 h-6 relative z-10" />
          <span className="relative z-10">Search</span>
        </motion.button>
      </div>
    </motion.form>
  );
}
