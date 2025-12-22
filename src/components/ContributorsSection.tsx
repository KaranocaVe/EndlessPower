import { Button, Card } from '@heroui/react'
import { useContributors } from '../hooks/useContributors'
import LoadingSpinner from './LoadingSpinner'

export default function ContributorsSection() {
  const { contributors, repoStats, stats, isLoading, error, lastUpdated, refresh } = useContributors()

  return (
    <div className="ep-contrib">
      <div className="ep-contrib-header">
        <div className="ep-contrib-title">项目贡献者</div>
        <Button variant="secondary" onPress={refresh} isDisabled={isLoading}>
          {isLoading ? '加载中…' : '刷新'}
        </Button>
      </div>

      {error && <div className="ep-contrib-error">{error}</div>}

      {repoStats && (
        <div className="ep-contrib-stats">
          <Card className="ep-contrib-stat">
            <Card.Content>
              <div className="ep-contrib-number is-warning">{repoStats.stars}</div>
              <div className="ep-contrib-label">Stars</div>
            </Card.Content>
          </Card>
          <Card className="ep-contrib-stat">
            <Card.Content>
              <div className="ep-contrib-number is-success">{stats.totalContributors}</div>
              <div className="ep-contrib-label">贡献者</div>
            </Card.Content>
          </Card>
          <Card className="ep-contrib-stat">
            <Card.Content>
              <div className="ep-contrib-number">{repoStats.forks}</div>
              <div className="ep-contrib-label">Forks</div>
            </Card.Content>
          </Card>
        </div>
      )}

      {isLoading ? (
        <div className="ep-contrib-loading">
          <LoadingSpinner label="加载贡献者…" />
        </div>
      ) : (
        <>
          <div className="ep-contrib-grid">
            {contributors.slice(0, 12).map((c) => (
              <button
                key={c.id}
                type="button"
                className="ep-contrib-avatar"
                aria-label={`查看 ${c.login} 的 GitHub 主页`}
                onClick={() => window.open(c.html_url, '_blank', 'noopener,noreferrer')}
              >
                <img
                  src={c.avatar_url}
                  alt={c.login}
                  loading="lazy"
                  onError={(event) => {
                    const img = event.currentTarget
                    img.onerror = null
                    img.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.login)}&background=6B7280&color=fff&size=80`
                  }}
                />
              </button>
            ))}
          </div>

          {contributors.length > 12 && (
            <div className="ep-contrib-more">还有 {contributors.length - 12} 位贡献者</div>
          )}

          {lastUpdated && <div className="ep-contrib-updated">最后更新：{lastUpdated.toLocaleString()}</div>}
        </>
      )}
    </div>
  )
}

