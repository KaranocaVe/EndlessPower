import React from 'react'
import { GitHubContributor, formatContributions } from '../utils/github'

interface ContributorCardProps {
  contributor: GitHubContributor
}

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor }) => {
  const handleClick = () => {
    window.open(contributor.html_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg p-3 border border-gray-200/50 dark:border-gray-700/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] group"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-3">
        {/* 头像 */}
        <div className="flex-shrink-0">
          <img
            src={contributor.avatar_url}
            alt={contributor.login}
            className="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = `https://ui-avatars.com/api/?name=${contributor.login}&background=6B7280&color=fff&size=40`
            }}
          />
        </div>

        {/* 信息区域 */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {contributor.login}
          </h3>
          
          <div className="flex items-center space-x-1 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <svg className="w-3 h-3 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatContributions(contributor.contributions)} commits</span>
          </div>
        </div>

        {/* 外链图标 */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default ContributorCard
