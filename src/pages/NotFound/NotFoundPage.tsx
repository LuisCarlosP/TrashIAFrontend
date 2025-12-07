import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome, faRecycle, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import './NotFoundPage.css'

interface NotFoundPageProps {
    t: {
        notFoundTitle: string
        notFoundSubtitle: string
        notFoundDescription: string
        notFoundButton: string
        notFoundTip: string
    }
}

export default function NotFoundPage({ t }: NotFoundPageProps) {
    return (
        <div className="not-found-page">
            <div className="not-found-background"></div>

            <div className="not-found-content">
                <div className="not-found-icon">
                    <FontAwesomeIcon icon={faRecycle} />
                </div>

                <p className="not-found-subtitle">{t.notFoundSubtitle}</p>
                <h1 className="not-found-title">{t.notFoundTitle}</h1>

                <p className="not-found-description">{t.notFoundDescription}</p>

                <Link to="/" className="not-found-button">
                    <FontAwesomeIcon icon={faHome} />
                    {t.notFoundButton}
                </Link>

                <div className="not-found-tip">
                    <FontAwesomeIcon icon={faLightbulb} className="tip-icon" />
                    <p>{t.notFoundTip}</p>
                </div>
            </div>
        </div>
    )
}
