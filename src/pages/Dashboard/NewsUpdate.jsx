import React, { useState } from "react";

const NewsUpdate = () => {
    const [activeTab, setActiveTab] = useState("latest");

    const newsData = {
        latest: [
            {
                id: 1,
                title: "New Government Scheme Launched",
                description:
                    "A new scheme has been launched to support women entrepreneurs across rural areas.",
                date: "10 Jun 2026",
            },
            {
                id: 2,
                title: "Digital Training Program Started",
                description:
                    "Training sessions for digital literacy have started in multiple districts.",
                date: "09 Jun 2026",
            },
        ],
        announcements: [
            {
                id: 1,
                title: "Application Portal Open",
                description:
                    "Applications for the upcoming program are now open for registration.",
                date: "08 Jun 2026",
            },
            {
                id: 2,
                title: "Last Date Extended",
                description:
                    "Registration deadline has been extended till 30 June 2026.",
                date: "07 Jun 2026",
            },
        ],
        events: [
            {
                id: 1,
                title: "District Workshop Scheduled",
                description:
                    "A district-level workshop will be conducted next week.",
                date: "07 Jun 2026",
            },
            {
                id: 2,
                title: "Entrepreneurship Summit",
                description:
                    "State-level entrepreneurship summit will be organized this month.",
                date: "05 Jun 2026",
            },
        ],
    };

    const tabs = [
        {
            key: "latest",
            label: "Latest News",
        },
        {
            key: "announcements",
            label: "Announcements",
        },
        {
            key: "events",
            label: "Events",
        },
    ];

    return (
        <div className="news-update-container">
            {/* Header */}
            <div className="header-section">
                <div>
                    <h2 className="news-heading">News Updates</h2>
                    <p className="news-subtitle">
                        Stay informed with the latest announcements and events.
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="news-tabs">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`tab-btn ${activeTab === tab.key ? "active-tab" : ""
                            }`}
                        onClick={() => setActiveTab(tab.key)}
                    >
                        <span>{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* News Content */}
            <div className="news-content">
                {newsData[activeTab]?.length > 0 ? (
                    newsData[activeTab].map((item) => (
                        <div className="news-card" key={item.id}>
                            <div className="card-top">
                                <span className="date-badge">{item.date}</span>
                            </div>

                            <h4>{item.title}</h4>

                            <p>{item.description}</p>

                            <button className="read-more-btn">
                                Read More →
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="no-news">
                        No news available at the moment.
                    </div>
                )}
            </div>

            <style jsx>{`
     .news-update-container {
    background: #ffffff;
    border-radius: 24px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
    border-top: 5px solid #16a34a;
    border-left: 2px solid #f59e0b;
    border-right: 2px solid #9333ea;
    height: 100%;
  }

  .header-section {
    margin-bottom: 24px;
  }

  .news-heading {
    margin: 0;
    font-size: 30px;
    font-weight: 800;
    background: linear-gradient(
      90deg,
      #16a34a 0%,
      #f59e0b 50%,
      #9333ea 100%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .news-subtitle {
    margin-top: 8px;
    color: #64748b;
    font-size: 14px;
  }

  .news-tabs {
    display: flex;
    gap: 10px;
    margin
    : 24px;
    overflow-x: auto;
    padding-bottom: 4px;
    
  }

  .news-tabs::-webkit-scrollbar {
    display: none;
  }

  .tab-btn {
    border: none;
    background: #f8fafc;
    color: #475569;
    padding: 12px 18px;
    border-radius: 14px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    white-space: nowrap;
    outline: #f59e0b 1px solid;
    margin-top: 12px;
    margin-left: 1px;
  }

  .tab-btn:hover {
    transform: translateY(-2px);
    background: #fff7ed;
    color: #f59e0b;
  }

  .active-tab {
    color: white;
    background: linear-gradient(
      135deg,
      #16a34a,
      #f59e0b,
      #9333ea
    );
    box-shadow: 0 10px 25px rgba(147, 51, 234, 0.25);
  }

  .news-content {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(320px, 1fr)
    );
    gap: 18px;
  }

  .news-card {
    background: #ffffff;
    border-radius: 18px;
    padding: 20px;
    border: 1px solid #e2e8f0;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }

  .news-card::before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 6px;
    height: 100%;
    background: #9333ea
  }

  .news-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 16px 40px rgba(15, 23, 42, 0.12);
  }

  .card-top {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 12px;
  }

  .date-badge {
    background: linear-gradient(
      135deg,
      rgba(22, 163, 74, 0.12),
      rgba(245, 158, 11, 0.12),
      rgba(147, 51, 234, 0.12)
    );
    color: #9333ea;
    padding: 6px 14px;
    border-radius: 50px;
    font-size: 12px;
    font-weight: 700;
  }

  .news-card h4 {
    margin: 0 0 12px;
    color: #0f172a;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.4;
  }

  .news-card p {
    color: #64748b;
    line-height: 1.7;
    font-size: 14px;
    margin-bottom: 18px;
  }

  .read-more-btn {
    border: none;
    background: transparent;
    color: #9333ea;
    font-weight: 700;
    cursor: pointer;
    padding: 0;
    transition: all 0.3s ease;
  }

  .read-more-btn:hover {
    color: #f59e0b;
    transform: translateX(5px);
  }

  .no-news {
    grid-column: 1 / -1;
    text-align: center;
    padding: 40px;
    color: #94a3b8;
    font-weight: 500;
  }

  @media (max-width: 768px) {
    .news-update-container {
      padding: 18px;
    }

    .news-heading {
      font-size: 24px;
    }

    .news-content {
      grid-template-columns: 1fr;
    }

    .tab-btn {
      padding: 10px 14px;
      font-size: 13px;
    }
  }
      `}</style>
        </div>
    );
};

export default NewsUpdate;