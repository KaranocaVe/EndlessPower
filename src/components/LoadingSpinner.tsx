import React from 'react'

interface LoadingSpinnerProps {
  text?: string
  className?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  text = '加载中...', 
  className = '' 
}) => {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="loader"></div>
      <span className="font-semibold text-gray-700">{text}</span>
    </div>
  )
}

export default LoadingSpinner
