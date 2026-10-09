// src/pages/HeroComponents/HeroLatestUpdates.jsx
import React, { useContext, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../LanguageContext.jsx";
import newsData from "../LoginComps/News.json"; /* NEWS JSON */

/* LANGUAGE CONTENT */
const content = {
  en: { heading: "Latest Updates & Announcements", viewAll: "View All" },
  hi: { heading: "नवीनतम अपडेट एवं घोषणाएँ", viewAll: "सभी देखें" },
};

export default function LatestUpdates() {
  const { lang } = useContext(LanguageContext);
  const t = content[lang] || content.en;

  /* Only one update remains open at a time */
  const [expandedUpdate, setExpandedUpdate] = useState(null);
  const toggleUpdate = (itemKey) =>
    setExpandedUpdate((previous) => (previous === itemKey ? null : itemKey));

  /* Combine updates from every module, sort by DATE ONLY, show latest 4 */
  const latestUpdates = useMemo(
    () =>
      Object.entries(newsData)
        .flatMap(([moduleKey, moduleData]) =>
          (moduleData.items || []).map((item) => ({
            ...item,
            module: moduleKey,
          })),
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4),
    [],
  );

  return (
    <section className="updates-section">
      <div className="updates-container">
        {/* HEADER */}
        <div className="updates-header">
          <div className="updates-heading-wrap">
            <div className="bell-icon">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2>{t.heading}</h2>
          </div>

          <Link to="/news-updates" className="view-all-btn">
            {t.viewAll}
            <span>→</span>
          </Link>
        </div>

        {/* LATEST 4 UPDATES */}
        <div className="updates-list">
          {latestUpdates.map((item) => {
            const title =
              lang === "hi" ? item.title_hi || item.title : item.title;
            const description =
              lang === "hi"
                ? item.description_hi || item.description
                : item.description;
            const itemKey = `${item.module}-${item.id}`;
            const isExpanded = expandedUpdate === itemKey;

            return (
              <div
                key={itemKey}
                className={`update-row ${isExpanded ? "expanded" : ""}`}
                onClick={() => toggleUpdate(itemKey)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggleUpdate(itemKey);
                  }
                }}
                role="button"
                tabIndex={0}
                aria-expanded={isExpanded}
              >
                <div className="update-left">
                  <div
                    className={`update-arrow ${isExpanded ? "expanded" : ""}`}
                  >
                    ›
                  </div>

                  <div className="update-content">
                    <span className="update-title">{title}</span>
                    {/* Hidden by default, visible only when row is clicked */}
                    {isExpanded && description && (
                      <p className="update-description">{description}</p>
                    )}
                  </div>
                </div>

                <time className="update-date">{item.date}</time>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        /* SECTION */
        .updates-section { width: 100%; background: #efece9; padding: 35px 0; box-sizing: border-box; }
        .updates-container { width: 100%; max-width: 1500px; margin: 0 auto; padding: 0 30px; box-sizing: border-box; }

        /* HEADER */
        .updates-header { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 20px; margin-bottom: 18px; }
        .updates-heading-wrap { min-width: 0; display: flex; align-items: center; gap: 13px; }

        /* BELL ICON */
        .bell-icon { width: 30px; height: 30px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; color: #f97316; }
        .bell-icon svg { width: 28px; height: 28px; }

        /* HEADING */
        .updates-heading-wrap h2 { margin: 0; color: #0f2748; font-size: calc(26px * var(--font-scale, 1)); font-weight: 800; line-height: 1.2; }

        /* VIEW ALL */
        .view-all-btn {
          flex-shrink: 0; display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          min-height: 42px; padding: 8px 18px; color: #f97316; background: #ffffff; border: 1.5px solid #f97316;
          border-radius: 22px; text-decoration: none; font-size: calc(13px * var(--font-scale, 1)); font-weight: 700;
          white-space: nowrap; transition: background 0.25s ease, color 0.25s ease, gap 0.25s ease;
        }
        .view-all-btn:hover { color: #ffffff; background: #f97316; gap: 11px; }
        .view-all-btn span { font-size: 17px; line-height: 1; }

        /* LIST */
        .updates-list { width: 100%; display: flex; flex-direction: column; gap: 8px; }

        /* UPDATE ROW */
        .update-row {
          width: 100%; min-height: 48px; padding: 10px 18px; display: flex; align-items: flex-start;
          justify-content: space-between; gap: 20px; box-sizing: border-box;
          background: linear-gradient(90deg, #f4f9fd 0%, #edf6fc 100%); border: 1px solid #e5edf4; border-radius: 7px;
          cursor: pointer; outline: none; transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .update-row:hover { background: #eaf5fc; border-color: #d7e6f0; box-shadow: 0 4px 12px rgba(15, 39, 72, 0.06); }
        .update-row:focus-visible { border-color: #f97316; box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.15); }

        /* EXPANDED ROW */
        .update-row.expanded {
          background: linear-gradient(90deg, #eef7fd 0%, #e7f3fb 100%);
          border-color: #cfe3f1; box-shadow: 0 5px 14px rgba(15, 39, 72, 0.07);
        }

        /* LEFT SIDE */
        .update-left { min-width: 0; flex: 1; display: flex; align-items: flex-start; gap: 12px; }

        /* ARROW */
        .update-arrow {
          width: 22px; height: 24px; flex-shrink: 0; display: flex; align-items: center; justify-content: center;
          color: #f97316; font-size: 25px; font-weight: 800; line-height: 1; transform-origin: center; transition: transform 0.25s ease;
        }
        .update-arrow.expanded { transform: rotate(90deg); }

        /* CONTENT */
        .update-content { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 6px; }
        .update-title { min-width: 0; color: #26496d; font-size: calc(14px * var(--font-scale, 1)); font-weight: 650; line-height: 1.4; }

        /* DESCRIPTION */
        .update-description {
          width: 100%; margin: 0; padding-top: 2px; color: #64748b; font-size: calc(12px * var(--font-scale, 1));
          font-weight: 500; line-height: 1.55; overflow-wrap: anywhere; animation: updateDescriptionOpen 0.25s ease;
        }
        @keyframes updateDescriptionOpen {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* DATE */
        .update-date { flex-shrink: 0; padding-top: 2px; color: #475569; font-size: calc(13px * var(--font-scale, 1)); font-weight: 500; white-space: nowrap; }

        /* 1400+ */
        @media (min-width: 1400px) {
          .updates-container { max-width: 1600px; padding: 0 50px; }
          .updates-heading-wrap h2 { font-size: calc(28px * var(--font-scale, 1)); }
          .update-row { padding: 11px 20px; }
          .update-title { font-size: calc(14.5px * var(--font-scale, 1)); }
          .update-description { font-size: calc(12.5px * var(--font-scale, 1)); }
          .update-date { font-size: calc(13.5px * var(--font-scale, 1)); }
        }

        /* 1200 */
        @media (max-width: 1200px) {
          .updates-container { padding: 0 24px; }
          .updates-heading-wrap h2 { font-size: calc(24px * var(--font-scale, 1)); }
          .update-title { font-size: calc(13.5px * var(--font-scale, 1)); }
          .update-description { font-size: calc(11.5px * var(--font-scale, 1)); }
        }

        /* 1024 */
        @media (max-width: 1024px) {
          .updates-container { padding: 0 20px; }
          .updates-heading-wrap h2 { font-size: calc(23px * var(--font-scale, 1)); }
          .update-row { padding: 9px 15px; gap: 16px; }
          .update-description { font-size: calc(11px * var(--font-scale, 1)); }
        }

        /* 900 */
        @media (max-width: 900px) {
          .updates-section { padding: 30px 0; }
          .updates-container { padding: 0 18px; }
          .updates-heading-wrap h2 { font-size: calc(22px * var(--font-scale, 1)); }
          .update-title { font-size: calc(13px * var(--font-scale, 1)); }
          .update-description { font-size: calc(10.8px * var(--font-scale, 1)); }
          .update-date { font-size: calc(11.5px * var(--font-scale, 1)); }
        }

        /* 600 */
        @media (max-width: 600px) {
          .updates-section { padding: 25px 0; }
          .updates-container { padding: 0 14px; }
          .updates-header { align-items: flex-start; gap: 12px; margin-bottom: 15px; }
          .updates-heading-wrap { gap: 8px; }
          .bell-icon { width: 25px; height: 25px; }
          .bell-icon svg { width: 23px; height: 23px; }
          .updates-heading-wrap h2 { font-size: calc(18px * var(--font-scale, 1)); }
          .view-all-btn { min-height: 35px; padding: 6px 12px; font-size: calc(11px * var(--font-scale, 1)); }
          .update-row { padding: 10px 11px; gap: 10px; }
          .update-left { gap: 7px; }
          .update-arrow { width: 18px; height: 21px; font-size: 21px; }
          .update-title { font-size: calc(12px * var(--font-scale, 1)); }
          .update-description { font-size: calc(10.5px * var(--font-scale, 1)); line-height: 1.45; }
          .update-date { font-size: calc(10.5px * var(--font-scale, 1)); }
        }

        /* 400 */
        @media (max-width: 400px) {
          .updates-container { padding: 0 10px; }
          .updates-heading-wrap h2 { font-size: calc(16px * var(--font-scale, 1)); }
          .view-all-btn { padding: 5px 9px; font-size: calc(10px * var(--font-scale, 1)); }
          .update-row { padding: 9px 10px; gap: 8px; }
          .update-left { gap: 6px; }
          .update-arrow { width: 16px; font-size: 19px; }
          .update-title { font-size: calc(11px * var(--font-scale, 1)); }
          .update-description { font-size: calc(9.5px * var(--font-scale, 1)); line-height: 1.4; }
          .update-date { font-size: calc(9.5px * var(--font-scale, 1)); }
        }
      `}</style>
    </section>
  );
}
