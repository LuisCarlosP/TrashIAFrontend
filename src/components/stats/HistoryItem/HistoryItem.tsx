import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRecycle, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getMaterialDisplayName, getMaterialColor, getMaterialIcon, type ClassificationRecord } from '../../../services/history';
import './HistoryItem.css';

interface HistoryItemProps {
  record: ClassificationRecord;
  language: 'es' | 'en';
  dateLabel: string;
  onDelete: (id: string) => void;
  deleteTitle: string;
}

const HistoryItem = ({ record, language, dateLabel, onDelete, deleteTitle }: HistoryItemProps) => {
  return (
    <div className="history-item">
      <div className="history-item-left">
        {record.imagePreview ? (
          <img 
            src={record.imagePreview} 
            alt={record.material} 
            className="history-thumbnail"
          />
        ) : (
          <div 
            className="history-icon"
            style={{ backgroundColor: getMaterialColor(record.material) }}
          >
            <i className={`fas ${getMaterialIcon(record.material)}`}></i>
          </div>
        )}
        <span className="history-material">
          {getMaterialDisplayName(record.material, language)}
        </span>
      </div>
      
      <div className="history-item-right">
        <span className={`history-badge ${record.isRecyclable ? 'yes' : 'no'}`}>
          <FontAwesomeIcon icon={record.isRecyclable ? faRecycle : faTrash} />
        </span>
        <span className="history-confidence">{Math.round(record.confidence * 100)}%</span>
        <span className="history-date">{dateLabel}</span>
        <button 
          className="history-delete-btn"
          onClick={() => onDelete(record.id)}
          title={deleteTitle}
        >
          <FontAwesomeIcon icon={faTimes} />
        </button>
      </div>
    </div>
  );
};

export default HistoryItem;
