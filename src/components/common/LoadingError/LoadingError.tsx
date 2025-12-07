import './LoadingError.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

interface LoadingProps {
  message: string
}

export function Loading({ message }: LoadingProps) {
  // Split message into main text and subtext if it contains "..."
  const parts = message.split('...');
  const mainText = parts[0] + '...';
  const subText = parts[1]?.trim() || '';

  return (
    <div className="loading">
      <div className="loading-content">
        <div className="spinner-container">
          <FontAwesomeIcon icon={faSpinner} className="spinner" spin />
        </div>
        <p className="loading-text">{mainText}</p>
        {subText && <p className="loading-subtext">{subText}</p>}
        <div className="loading-progress"></div>
      </div>
    </div>
  )
}

interface ErrorMessageProps {
  message: string
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className="error-card">
      <FontAwesomeIcon icon={faCircleExclamation} className="error-icon" />
      <p>{message}</p>
    </div>
  )
}
