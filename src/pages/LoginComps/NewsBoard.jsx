import React, { useRef, useState, useEffect } from "react";
import newsData from "./News.json";

const THEME_COLORS = {
  blue: "#2563eb",
  red: "#dc2626",
  green: "#16a34a",
  purple: "#7c3aed",
  orange: "#f59e0b",
};

// Static UI text ke liye translations
const TRANSLATIONS = {
  en: {
    kicker: "Update Board",
    live: "Live",
    btnText: "हिंदी",
  },
  hi: {
    kicker: "अपडेट बोर्ड",
    live: "लाइव",
    btnText: "English",
  },
};

export default function NewsBoard({ module = "default", theme = "orange" }) {
  const activeModule = newsData[module] || newsData.default || { items: [] };
  const accent = THEME_COLORS[theme] || THEME_COLORS.blue;

  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [lang, setLang] = useState("en"); // Language state: 'en' or 'hi'

  useEffect(() => {
    const timer = window.setInterval(() => {
      const element = scrollRef.current;

      if (!isPaused && element && element.scrollHeight > element.clientHeight) {
        element.scrollTop += 1;

        if (
          element.scrollTop + element.clientHeight >=
          element.scrollHeight - 1
        ) {
          element.scrollTop = 0;
        }
      }
    }, 40);

    return () => window.clearInterval(timer);
  }, [isPaused, module]);

  const pauseAutoScroll = () => setIsPaused(true);
  const resumeAutoScroll = () => setIsPaused(false);

  // Toggle Language Function
  const toggleLanguage = () => {
    setLang((prevLang) => (prevLang === "en" ? "hi" : "en"));
  };

  const t = TRANSLATIONS[lang];

  return (
    <div
      className="news-board"
      style={{ "--news-accent": accent }}
      onMouseEnter={pauseAutoScroll}
      onMouseLeave={resumeAutoScroll}
    >
      <div className="news-header">
        <div>
          <p className="news-kicker">{t.kicker}</p>
          <h3>
            {lang === "hi" && activeModule.title_hi
              ? activeModule.title_hi
              : activeModule.title}
          </h3>
        </div>

        <div className="header-actions">
          {/* Single Language Toggle Button */}
          <button className="lang-toggle-btn" onClick={toggleLanguage}>
            {t.btnText}
          </button>
          <span className="news-live">{t.live}</span>
        </div>
      </div>

      <p className="news-subtitle">
        {lang === "hi" && activeModule.subtitle_hi
          ? activeModule.subtitle_hi
          : activeModule.subtitle}
      </p>

      <div className="news-list" ref={scrollRef}>
        {(activeModule.items || []).map((item) => (
          <article key={item.id} className="news-item">
            <div className="news-meta">
              <span>{item.date}</span>
              <span>{item.time}</span>
            </div>
            <h4>
              {lang === "hi" && item.title_hi ? item.title_hi : item.title}
            </h4>
            <p>
              {lang === "hi" && item.description_hi
                ? item.description_hi
                : item.description}
            </p>
          </article>
        ))}
      </div>

      <style>{`
        .news-board {
          width: 100%;
          height: 100%;
          min-height: 0;
          min-width: 0;
          box-sizing: border-box;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: rgba(15, 23, 42, 0.18);
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 24px;
          padding: 28px 24px;
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          color: #e2e8f0;
        }

        .news-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 8px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        /* Language Toggle Button Style */
        .lang-toggle-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #fff;
          padding: 5px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .lang-toggle-btn:hover {
          background: var(--news-accent);
          border-color: var(--news-accent);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }

        .news-kicker {
          margin: 0 0 8px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(255, 255, 255, 0.7);
        }

        .news-header h3 {
          margin: 0;
          font-size: clamp(24px, 2vw, 34px);
          line-height: 1.2;
          font-weight: 800;
          color: #ffffff;
        }

        .news-live {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 56px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.22);
          color: #ffffff;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          animation: pulse 2s infinite; 
        }

        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0.4); }
          70% { box-shadow: 0 0 0 6px rgba(220, 38, 38, 0); }
          100% { box-shadow: 0 0 0 0 rgba(220, 38, 38, 0); }
        }

        .news-subtitle {
          margin: 0 0 22px;
          font-size: 15px;
          color: rgba(255, 255, 255, 0.8);
        }

        .news-list {
          flex: 1 1 0;
          height: 0;
          min-height: 0;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          overscroll-behavior: contain;
          scroll-behavior: auto;
          padding-right: 4px;
          -ms-overflow-style: none;  
          scrollbar-width: none;  
        }
        
        .news-list::-webkit-scrollbar {
          display: none; 
        }

        .news-item {
          flex: 0 0 auto;
          background: rgba(15, 23, 42, 0.24);
          border: 1px solid rgba(255, 255, 255, 0.12);
          border-left: 4px solid var(--news-accent);
          border-radius: 16px;
          padding: 16px 16px 14px;
          box-shadow: 0 8px 20px rgba(15, 23, 42, 0.12);
          transition: transform 0.2s ease, background 0.2s ease; 
        }

        .news-item:hover {
          transform: translateX(4px);
          background: rgba(15, 23, 42, 0.4);
        }

        .news-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          color: rgba(255,255,255,0.72);
          font-size: 11px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          margin-bottom: 10px;
        }

        .news-item h4 {
          margin: 0 0 8px;
          font-size: 18px;
          line-height: 1.35;
          color: #ffffff;
        }

        .news-item p {
          margin: 0;
          font-size: 14px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
        }

        @media (max-width: 980px) {
          .news-board {
            min-height: 240px;
          }
        }
      `}</style>
    </div>
  );
}
