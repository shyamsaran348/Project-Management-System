import React from 'react';
import Navbar from '../components/Navbar';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex-1"
      >
        {children}
      </motion.main>
      <footer className="py-8 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 SDGSync. Technology for Social Good.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-indigo-500 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
