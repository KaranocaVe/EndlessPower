import React from 'react'
import { GitHubContributor } from '../utils/github'

interface ContributorCardProps {
  contributor: GitHubContributor
}

const ContributorCard: React.FC<ContributorCardProps> = ({ contributor }) => {
  const handleClick = () => {
    window.open(contributor.html_url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div 
      className="cursor-pointer group"
      onClick={handleClick}
      title={`${contributor.login} - 查看GitHub主页`}
    >
      <img
        src={contributor.avatar_url}
        alt={contributor.login}
        className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-all duration-200 group-hover:scale-110 shadow-sm hover:shadow-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement
          target.src = `https://ui-avatars.com/api/?name=${contributor.login}&background=6B7280&color=fff&size=40`
        }}
      />
    </div>
  )
}

export default ContributorCard
