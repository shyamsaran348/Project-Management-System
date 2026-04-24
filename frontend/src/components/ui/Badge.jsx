import React from 'react';

const Badge = ({ 
  children, 
  variant = 'sdg-1', 
  className = '',
  ...props 
}) => {
  return (
    <span 
      className={`sdg-badge ${variant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
