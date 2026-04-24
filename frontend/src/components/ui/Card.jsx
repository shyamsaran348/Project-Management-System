import React from 'react';
import { motion } from 'framer-motion';

const Card = ({ 
  children, 
  className = '', 
  hover = true, 
  glass = false,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -8, transition: { duration: 0.3 } } : {}}
      className={`card ${glass ? 'glass' : ''} ${hover ? 'card-hover' : ''} ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Card;
