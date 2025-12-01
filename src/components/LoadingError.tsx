import './LoadingError.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCircleExclamation } from '@fortawesome/free-solid-svg-icons'

interface LoadingProps {
  message: string
}

export function Loading({ message }: LoadingProps) {
  return (
    <div className="loading">
      <FontAwesomeIcon icon={faSpinner} className="spinner" spin />
      <p>{message}</p>
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
