import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import './StatCard.css';

interface StatCardProps {
  icon: IconDefinition;
  value: number;
  label: string;
  variant: 'primary' | 'success' | 'warning' | 'streak';
}

const StatCard = ({ icon, value, label, variant }: StatCardProps) => {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-icon">
        <FontAwesomeIcon icon={icon} />
      </div>
      <div className="stat-content">
        <span className="stat-value">{value}</span>
        <span className="stat-label">{label}</span>
      </div>
    </div>
  );
};

export default StatCard;
