import React from 'react';

const KpiCards = ({ selectedYear, kpiData, onCardClick }) => {
  const cards = [
    { key: 'totalTarget', label: 'Total Target', value: kpiData?.totalTarget },
    { key: 'totalOnboarded', label: 'Total Onboarded', value: kpiData?.totalOnboarded },
    { key: 'totalEnrolled', label: 'Total Enrolled in Batch', value: kpiData?.totalEnrolled },
    { key: 'totalBatchesFormed', label: 'Total Batches Formed', value: kpiData?.totalBatchesFormed },
    
    { key: 'pending', label: 'Pending', value: kpiData?.pending },
    { key: 'ongoing', label: 'Ongoing', value: kpiData?.ongoing },
    { key: 'completed', label: 'Completed', value: kpiData?.completed },
    { key: 'closureSubmitted', label: 'Closure Submitted', value: kpiData?.closureSubmitted },
    { key: 'rejected', label: 'Rejected', value: kpiData?.rejected },
    { key: 'overallAchievement', label: 'Achievement', value: `${kpiData?.overallAchievement || 0}%`, highlight: true },
  ];

  const borderClasses = [
    'border-blue',
    'border-indigo',
    'border-purple',
    'border-teal',
    'border-orange',
    'border-blue',
    'border-green',
    'border-pink',
    'border-red',
    'border-yellow',
    'border-green',
  ];

  const formatValue = (value) => {
    if (value === undefined || value === null) return 0;
    return typeof value === 'string' ? value : value.toLocaleString();
  };

  const clickableKeys = ['totalEnrolled', 'totalBatchesFormed',  'pending', 'ongoing', 'completed', 'closureSubmitted', 'rejected',];
  const isClickable = (key) => clickableKeys.includes(key);
  const handleCardClick = (key) => {
    if (!isClickable(key)) return;
    onCardClick?.(key);
  };

  return (
    <>
      <style>{`
        /* 🔥 Grid ko update kiya taaki cards chote aur compact dikhein */
        .kpi-grid {
          display: grid;
          /* 150px ka min-width diya hai taaki ek line me zyada cards aa sakein */
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        /* 🔥 Cards ko chota kiya gaya hai (padding kam karke) */
        .kpi-card {
          background: white;
          padding: 16px; 
          border-radius: 10px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        .kpi-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }
        .kpi-card.clickable {
          cursor: pointer;
        }

        .kpi-label {
          font-size: 12px; /* Label chota kiya */
          font-weight: 600;
          color: #64748b;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
        
        .kpi-value {
          font-size: 22px; /* Number ki size thodi adjust ki */
          font-weight: 700;
          color: #1e293b;
        }

        .text-success { color: #10b981 !important; }

        /* 🔥 Har card ke liye alag border colors */
        .border-blue { border-left: 4px solid #3b82f6; }
        .border-indigo { border-left: 4px solid #6366f1; }
        .border-purple { border-left: 4px solid #a855f7; }
        .border-green { border-left: 4px solid #10b981; }
        .border-teal { border-left: 4px solid #14b8a6; }
        .border-orange { border-left: 4px solid #f97316; }
        .border-yellow { border-left: 4px solid #f59e0b; }
        .border-pink { border-left: 4px solid #ec4899; }
        .border-red { border-left: 4px solid #ef4444; }
      `}</style>

      <div className="kpi-grid">
        {cards.map((card, index) => {
          const clickable = isClickable(card.key);
          return (
            <div
              key={card.key}
              className={`kpi-card ${card.highlight ? 'border-green' : borderClasses[index]} ${clickable ? 'clickable' : ''}`}
              onClick={() => handleCardClick(card.key)}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              onKeyDown={(e) => {
                if (clickable && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  handleCardClick(card.key);
                }
              }}
            >
              <div className="kpi-label">{card.label}</div>
              <div className={`kpi-value ${card.highlight ? 'text-success' : ''}`}>
                {formatValue(card.value)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default KpiCards;