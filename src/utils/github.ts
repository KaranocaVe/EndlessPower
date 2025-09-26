/**
 * GitHub API 相关工具函数
 * 用于获取项目贡献者信息
 */

export interface GitHubContributor {
  id: number
  login: string
  avatar_url: string
  html_url: string
  contributions: number
  type: 'User' | 'Bot'
  site_admin: boolean
}

export interface ContributorInfo extends GitHubContributor {
  // 扩展信息
  name?: string
  company?: string
  location?: string
  bio?: string
  blog?: string
  public_repos?: number
  followers?: number
  following?: number
  created_at?: string
}

// GitHub仓库信息
const GITHUB_REPO = {
  owner: 'jasonmumiao',
  repo: 'EndlessPower'
}

/**
 * 获取GitHub仓库贡献者列表
 */
export const fetchContributors = async (): Promise<GitHubContributor[]> => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/contributors?per_page=100`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'EndlessPower-App'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
    }

    const contributors: GitHubContributor[] = await response.json()
    
    // 过滤掉机器人账户（可选）
    return contributors.filter(contributor => 
      contributor.type === 'User' && 
      !contributor.login.includes('[bot]')
    )
  } catch (error) {
    console.warn('Failed to fetch contributors:', error)
    // 返回默认贡献者信息作为fallback
    return [
      {
        id: 1,
        login: 'KaranocaVe',
        avatar_url: 'https://github.com/KaranocaVe.png',
        html_url: 'https://github.com/KaranocaVe',
        contributions: 100,
        type: 'User',
        site_admin: false
      }
    ]
  }
}

/**
 * 获取单个用户的详细信息
 */
export const fetchUserDetails = async (username: string): Promise<ContributorInfo | null> => {
  try {
    const response = await fetch(
      `https://api.github.com/users/${username}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'EndlessPower-App'
        }
      }
    )

    if (!response.ok) {
      return null
    }

    const userDetails = await response.json()
    return userDetails
  } catch (error) {
    console.warn('Failed to fetch user details:', error)
    return null
  }
}

/**
 * 获取仓库统计信息
 */
export const fetchRepoStats = async () => {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}`,
      {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          'User-Agent': 'EndlessPower-App'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    const repo = await response.json()
    return {
      stars: repo.stargazers_count || 0,
      forks: repo.forks_count || 0,
      issues: repo.open_issues_count || 0,
      lastUpdated: repo.updated_at,
      language: repo.language,
      license: repo.license?.name || 'Unknown'
    }
  } catch (error) {
    console.warn('Failed to fetch repo stats:', error)
    return {
      stars: 0,
      forks: 0,
      issues: 0,
      lastUpdated: new Date().toISOString(),
      language: 'TypeScript',
      license: 'MIT'
    }
  }
}

/**
 * 格式化贡献数
 */
export const formatContributions = (count: number): string => {
  if (count >= 1000) {
    return `${Math.floor(count / 1000)}k+`
  }
  return count.toString()
}

/**
 * 获取贡献者等级标识
 */
export const getContributorBadge = (contributions: number): { 
  label: string
  color: string 
  icon: string 
} => {
  if (contributions >= 100) {
    return {
      label: '核心贡献者',
      color: 'bg-gradient-to-r from-purple-500 to-pink-500',
      icon: '👑'
    }
  } else if (contributions >= 50) {
    return {
      label: '高级贡献者',
      color: 'bg-gradient-to-r from-blue-500 to-indigo-500',
      icon: '🌟'
    }
  } else if (contributions >= 10) {
    return {
      label: '活跃贡献者',
      color: 'bg-gradient-to-r from-green-500 to-emerald-500',
      icon: '🚀'
    }
  } else {
    return {
      label: '贡献者',
      color: 'bg-gradient-to-r from-gray-500 to-gray-600',
      icon: '💡'
    }
  }
}
