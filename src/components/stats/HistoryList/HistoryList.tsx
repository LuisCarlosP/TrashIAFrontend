import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClockRotateLeft, faTrash } from '@fortawesome/free-solid-svg-icons';
import HistoryItem from '../HistoryItem/HistoryItem';
import { type ClassificationRecord } from '../../../services/history';
import './HistoryList.css';

interface HistoryListProps {
  history: ClassificationRecord[];
  language: 'es' | 'en';
  t: {
    recentHistory: string;
    clearHistory: string;
    clearHistoryConfirm: string;
    delete: string;
    today: string;
    yesterday: string;
    daysAgo: string;
  };
  onDelete: (id: string) => void;
  onClearAll: () => void;
}

const HistoryList = ({ history, language, t, onDelete, onClearAll }: HistoryListProps) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return t.today;
    if (diffDays === 1) return t.yesterday;
    if (diffDays < 7) return `${diffDays} ${t.daysAgo}`;
    
    return date.toLocaleDateString(language === 'es' ? 'es-ES' : 'en-US', {
      day: 'numeric',
      month: 'short',
    });
  };

  const handleClearHistory = () => {
    onClearAll();
    setShowClearConfirm(false);
  };

  return (
    <section className="history-section">
      <h2>
        <FontAwesomeIcon icon={faClockRotateLeft} />
        {t.recentHistory}
      </h2>
      
      <div className="history-list">
        {history.slice(0, 10).map((record) => (
          <HistoryItem
            key={record.id}
            record={record}
            language={language}
            dateLabel={formatDate(record.timestamp)}
            onDelete={onDelete}
            deleteTitle={t.delete}
          />
        ))}
      </div>

      {history.length > 0 && (
        <div className="history-actions">
          {!showClearConfirm ? (
            <button 
              className="btn-danger"
              onClick={() => setShowClearConfirm(true)}
            >
              <FontAwesomeIcon icon={faTrash} />
              {t.clearHistory}
            </button>
          ) : (
            <div className="confirm-dialog">
              <span>{t.clearHistoryConfirm}</span>
              <button className="btn-danger" onClick={handleClearHistory}>
                {t.delete}
              </button>
              <button className="btn-secondary" onClick={() => setShowClearConfirm(false)}>
                {language === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default HistoryList;
