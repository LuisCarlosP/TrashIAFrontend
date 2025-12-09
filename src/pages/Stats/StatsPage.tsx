import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faRecycle, faTrash, faFire, faChartBar } from '@fortawesome/free-solid-svg-icons';
import { StatCard, MaterialChart, WeeklyChart, HistoryList } from '../../components/stats';
import { PageBackground } from '../../components';
import {
  getStats,
  getHistory,
  clearHistory,
  deleteClassification,
  type UserStats,
  type ClassificationRecord,
} from '../../services/history';
import './StatsPage.css';

interface StatsPageProps {
  language: 'es' | 'en';
  t: {
    statsTitle: string;
    statsSubtitle: string;
    totalClassifications: string;
    recyclableItems: string;
    nonRecyclableItems: string;
    co2Saved: string;
    waterSaved: string;
    energySaved: string;
    treesEquivalent: string;
    streakDays: string;
    materialBreakdown: string;
    weeklyActivity: string;
    recentHistory: string;
    noHistory: string;
    startClassifying: string;
    clearHistory: string;
    clearHistoryConfirm: string;
    environmentalImpact: string;
    yourProgress: string;
    delete: string;
    today: string;
    yesterday: string;
    daysAgo: string;
    day: string;
  };
}

const StatsPage = ({ language, t }: StatsPageProps) => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [history, setHistory] = useState<ClassificationRecord[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setStats(getStats());
    setHistory(getHistory());
  };

  const handleClearHistory = () => {
    clearHistory();
    loadData();
  };

  const handleDeleteRecord = (id: string) => {
    deleteClassification(id);
    loadData();
  };

  if (!stats || history.length === 0) {
    return (
      <div className="stats-wrapper">
        <PageBackground opacity={0.08} />
        <main className="stats-page">
          <div className="stats-empty">
            <div className="empty-icon">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <h2>{t.noHistory}</h2>
            <p>{t.statsSubtitle}</p>
            <Link to="/trashia" className="btn-primary">
              <FontAwesomeIcon icon={faCamera} />
              {t.startClassifying}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="stats-wrapper">
      <PageBackground opacity={0.15} />
      <main className="stats-page">
        <header className="stats-header">
          <h1>{t.statsTitle}</h1>
          <p>{t.statsSubtitle}</p>
        </header>

        <section className="stats-grid">
          <StatCard
            icon={faCamera}
            value={stats.totalClassifications}
            label={t.totalClassifications}
            variant="primary"
          />
          <StatCard
            icon={faRecycle}
            value={stats.recyclableCount}
            label={t.recyclableItems}
            variant="success"
          />
          <StatCard
            icon={faTrash}
            value={stats.nonRecyclableCount}
            label={t.nonRecyclableItems}
            variant="warning"
          />
          <StatCard
            icon={faFire}
            value={stats.streakDays}
            label={t.streakDays}
            variant="streak"
          />
        </section>

        <div className="stats-two-columns">
          <MaterialChart
            materials={stats.byMaterial}
            total={stats.totalClassifications}
            language={language}
            title={t.materialBreakdown}
          />
          <WeeklyChart
            data={stats.weeklyClassifications}
            language={language}
            title={t.weeklyActivity}
          />
        </div>

        <HistoryList
          history={history}
          language={language}
          t={{
            recentHistory: t.recentHistory,
            clearHistory: t.clearHistory,
            clearHistoryConfirm: t.clearHistoryConfirm,
            delete: t.delete,
            today: t.today,
            yesterday: t.yesterday,
            daysAgo: t.daysAgo,
          }}
          onDelete={handleDeleteRecord}
          onClearAll={handleClearHistory}
        />
      </main>
    </div>
  );
};

export default StatsPage;
