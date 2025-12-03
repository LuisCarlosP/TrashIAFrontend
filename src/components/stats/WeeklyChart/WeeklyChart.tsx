import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import './WeeklyChart.css';

interface WeeklyChartProps {
  data: number[];
  language: 'es' | 'en';
  title: string;
}

const WeeklyChart = ({ data, language, title }: WeeklyChartProps) => {
  const maxValue = Math.max(...data, 1);

  const getDayLabels = (): string[] => {
    const days = language === 'es' 
      ? ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    const labels: string[] = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      labels.push(days[date.getDay()]);
    }
    
    return labels;
  };

  const dayLabels = getDayLabels();

  return (
    <section className="weekly-section">
      <h2>
        <FontAwesomeIcon icon={faCalendarWeek} />
        {title}
      </h2>
      <div className="weekly-chart">
        {data.map((count, index) => (
          <div key={index} className="week-bar">
            <div className="week-bar-container">
              <div 
                className="week-bar-fill"
                style={{ height: `${(count / maxValue) * 100}%` }}
              >
                {count > 0 && <span className="week-bar-value">{count}</span>}
              </div>
            </div>
            <span className="week-day">{dayLabels[index]}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WeeklyChart;
