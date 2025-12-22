import React from 'react'
import { useErrorStore } from '../store/errorStore'

const ErrorOverlay: React.FC = () => {
  const { error, clearError } = useErrorStore()

  if (!error) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[2000] flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl text-center max-w-sm">
        <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2">出错了！</h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4">{error}</p>
        <button
          onClick={clearError}
          className="px-4 py-2 bg-red-600 dark:bg-red-700 text-white rounded-lg hover:bg-red-700 dark:hover:bg-red-800 transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  )
}

export default ErrorOverlay
