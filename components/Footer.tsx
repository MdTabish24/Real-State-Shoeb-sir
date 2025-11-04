'use client';

import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0a2540] text-white py-12">
      <div className="max-w-7xl mx-auto px-8 md:px-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div className="mb-8 md:mb-0">
            <h3 className="text-xl font-bold mb-4 border-b-2 border-green-500 inline-block pb-1">EstateHub Agents</h3>
            <p className="text-gray-300 mt-6">Bhiwandi, Maharastra</p>
            <p className="text-gray-300 mt-4">Sales: +91 0000000000</p>
            <p className="text-gray-300">Lettings: +91 0000000000</p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">GET SOCIAL</h3>
            <div className="flex gap-4">
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Facebook className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Twitter className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Instagram className="w-6 h-6" />
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                <Linkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
