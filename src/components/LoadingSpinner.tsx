import { memo } from 'react'

type LoadingSpinnerProps = {
  label?: string
}

function LoadingSpinner({ label = '加载中…' }: LoadingSpinnerProps) {
  return (
    <div className="ep-spinner" role="status" aria-live="polite" aria-label={label}>
      <span className="ep-spinner-dot" aria-hidden="true" />
      <span className="ep-spinner-text">{label}</span>
    </div>
  )
}

export default memo(LoadingSpinner)

