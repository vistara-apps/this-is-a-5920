import React from 'react'

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = 'bg-white rounded-lg shadow-card border border-gray-100'
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : ''
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default Card