import React from 'react'
import { GitHubContributor, formatContributions, getContributorBadge } from '../utils/github'

interface ContributorCardProps {
  contributor: GitHubContributor
  rank: number
}

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor, rank }) => {
  const badge = getContributorBadge(contributor.contributions)

  const handleClick = () => {
    window.open(contributor.html_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 group"
      onClick={handleClick}
    >
      {/* 排名标识 */}
      {rank <= 3 && (
        <div className="absolute -top-2 -right-2">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg ${
            rank === 1 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
            rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
            'bg-gradient-to-r from-amber-600 to-amber-800'
          }`}>
            {rank}
          </div>
        </div>
      )}

      <div className="flex items-center space-x-3">
        {/* 头像 */}
        <div className="relative flex-shrink-0">
          <img
            src={contributor.avatar_url}
            alt={contributor.login}
            className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-colors"
            onError={(e) => {
              // 头像加载失败时的默认处理
              const target = e.target as HTMLImageElement
              target.src = `https://ui-avatars.com/api/?name=${contributor.login}&background=3B82F6&color=fff&size=48`
            }}
          />
          
          {/* 等级图标 */}
          <div className="absolute -bottom-1 -right-1 text-lg">
            {badge.icon}
          </div>
        </div>

        {/* 信息区域 */}
        <div className="flex-1 min-w-0">
          {/* 用户名 */}
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {contributor.login}
            </h3>
            
            {/* 等级徽章 */}
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium text-white ${badge.color} shadow-sm`}>
              {badge.label}
            </span>
          </div>

          {/* 贡献统计 */}
          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{formatContributions(contributor.contributions)}</span>
              <span>commits</span>
            </div>
            
            {rank <= 5 && (
              <div className="flex items-center space-x-1">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">Top {rank}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 悬停效果指示器 */}
      <div className="mt-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          查看GitHub主页
        </div>
      </div>
    </div>
  )
}

export default ContributorCard
