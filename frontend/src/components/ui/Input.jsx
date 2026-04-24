import React from 'react';

const Input = ({ 
  label, 
  error, 
  className = '', 
  id,
  ...props 
}) => {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`form-control ${error ? 'border-danger' : ''}`}
        {...props}
      />
      {error && <span className="text-danger text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Input;
