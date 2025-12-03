import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartPie } from '@fortawesome/free-solid-svg-icons';
import { getMaterialDisplayName, getMaterialColor, getMaterialIcon } from '../../../services/history';
import './MaterialChart.css';

interface MaterialChartProps {
  materials: Record<string, number>;
  total: number;
  language: 'es' | 'en';
  title: string;
}

const MaterialChart = ({ materials, total, language, title }: MaterialChartProps) => {
  const sortedMaterials = Object.entries(materials).sort(([, a], [, b]) => b - a);

  return (
    <section className="material-section">
      <h2>
        <FontAwesomeIcon icon={faChartPie} />
        {title}
      </h2>
      <div className="material-chart">
        {sortedMaterials.map(([material, count]) => {
          const percentage = Math.round((count / total) * 100);
          return (
            <div key={material} className="material-bar">
              <div className="material-info">
                <span 
                  className="material-dot" 
                  style={{ backgroundColor: getMaterialColor(material) }}
                ></span>
                <i className={`fas ${getMaterialIcon(material)}`}></i>
                <span className="material-name">
                  {getMaterialDisplayName(material, language)}
                </span>
                <span className="material-count">{count}</span>
              </div>
              <div className="bar-container">
                <div 
                  className="bar-fill"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: getMaterialColor(material) 
                  }}
                ></div>
              </div>
              <span className="material-percentage">{percentage}%</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default MaterialChart;
