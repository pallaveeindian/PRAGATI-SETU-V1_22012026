// src/pages/NewsUpdates.jsx
import React, { useContext, useMemo, useState } from "react";
import { FiBell, FiCalendar, FiFilter, FiX } from "react-icons/fi";
import { LanguageContext } from "./LanguageContext.jsx";
import newsData from "./LoginComps/News.json";
import up_logo from "../assets/upgov_logo.jpg";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";

const content = {
  en: {
    eyebrow: "LATEST UPDATES",
    headingStart: "News",
    headingHighlight: "Updates",
    description:
      "Stay informed with the latest announcements, improvements and module-wise updates available on Pragati Setu.",
    filters: "Filters",
    moduleFilter: "Module",
    dateFilter: "Date",
    general: "General",
    allModules: "All Modules",
    clear: "Clear Filters",
    results: "Updates Found",
    noNews: "No updates found for the selected filters.",
    latest: "Latest Update",
  },
  hi: {
    eyebrow: "नवीनतम अपडेट",
    headingStart: "समाचार",
    headingHighlight: "अपडेट",
    description:
      "प्रगति सेतु पर उपलब्ध नवीनतम घोषणाओं, सुधारों एवं मॉड्यूल-वार अपडेट की जानकारी प्राप्त करें।",
    filters: "फ़िल्टर",
    moduleFilter: "मॉड्यूल",
    dateFilter: "तिथि",
    general: "सामान्य",
    allModules: "सभी मॉड्यूल",
    clear: "फ़िल्टर हटाएँ",
    results: "अपडेट मिले",
    noNews: "चयनित फ़िल्टर के लिए कोई अपडेट उपलब्ध नहीं है।",
    latest: "नवीनतम अपडेट",
  },
};

export default function NewsUpdates() {
  const { lang } = useContext(LanguageContext);
  const [fontScale, setFontScale] = useState(1);
  const t = content[lang] || content.en;
  const [selectedModule, setSelectedModule] = useState("default");
  const [selectedDate, setSelectedDate] = useState("");

  const modules = useMemo(() => Object.keys(newsData), []);
  const getModuleLabel = (k) => (k === "default" ? t.general : k.toUpperCase());

  const getComparableDate = (d) => {
    if (!d) return "";
    const date = new Date(d);
    return Number.isNaN(date.getTime())
      ? ""
      : `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  const allNews = useMemo(
    () =>
      Object.entries(newsData).flatMap(([k, d]) =>
        (d.items || []).map((i) => ({ ...i, module: k })),
      ),
    [],
  );

  const filteredNews = useMemo(() => {
    return allNews
      .filter((i) => selectedModule === "all" || i.module === selectedModule)
      .filter(
        (i) => !selectedDate || getComparableDate(i.date) === selectedDate,
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [allNews, selectedModule, selectedDate]);

  return (
    <>
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="news-page">
        <section className="news-page-hero">
          <div className="news-container">
            <div className="news-title-area">
              <div className="news-eyebrow">
                <FiBell />
                <span>{t.eyebrow}</span>
              </div>
              <h1>
                <span className="news-heading-blue">{t.headingStart}</span>{" "}
                <span className="news-heading-orange">
                  {t.headingHighlight}
                </span>
              </h1>
            </div>
          </div>
        </section>

        <section className="news-intro-section">
          <div className="news-container">
            <div className="news-intro-card">
              <div className="news-intro-line"></div>
              <div className="news-intro-icon">
                <FiBell />
              </div>
              <p>{t.description}</p>
            </div>
          </div>
        </section>

        <section className="news-main-section">
          <div className="news-container">
            <div className="news-filter-card">
              <div className="news-filter-heading">
                <FiFilter />
                <span>{t.filters}</span>
              </div>
              <div className="news-filter-group">
                <label htmlFor="module-filter">{t.moduleFilter}</label>
                <select
                  id="module-filter"
                  value={selectedModule}
                  onChange={(e) => setSelectedModule(e.target.value)}
                >
                  <option value="all">{t.allModules}</option>
                  {modules.map((k) => (
                    <option key={k} value={k}>
                      {getModuleLabel(k)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="news-filter-group">
                <label htmlFor="date-filter">{t.dateFilter}</label>
                <div className="news-date-input-wrap">
                  <FiCalendar />
                  <input
                    id="date-filter"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="news-clear-btn"
                onClick={() => {
                  setSelectedModule("default");
                  setSelectedDate("");
                }}
              >
                <FiX />
                <span>{t.clear}</span>
              </button>
            </div>

            <div className="news-results-header">
              <h2>
                {selectedModule === "all"
                  ? t.allModules
                  : getModuleLabel(selectedModule)}
              </h2>
              <div className="news-result-count">
                <strong>{filteredNews.length}</strong>
                <span>{t.results}</span>
              </div>
            </div>

            {filteredNews.length > 0 ? (
              <div className="news-list">
                {filteredNews.map((item, index) => {
                  const title =
                    lang === "hi" ? item.title_hi || item.title : item.title;
                  const description =
                    lang === "hi"
                      ? item.description_hi || item.description
                      : item.description;
                  return (
                    <article
                      key={`${item.module}-${item.id}`}
                      className="news-item"
                    >
                      <div className="news-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="news-item-content">
                        <div className="news-item-meta">
                          <span className="news-module-badge">
                            {getModuleLabel(item.module)}
                          </span>
                          <span className="news-item-date">
                            <FiCalendar />
                            {item.date}
                          </span>
                        </div>
                        <h3>{title}</h3>
                        {description && <p>{description}</p>}
                      </div>
                      {index === 0 && (
                        <div className="latest-badge">{t.latest}</div>
                      )}
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="news-empty-state">
                <div className="news-empty-icon">
                  <FiBell />
                </div>
                <p>{t.noNews}</p>
              </div>
            )}
          </div>
        </section>

        <style>{`
          .news-page,.news-page *{box-sizing:border-box}
          .news-page{width:100%;min-height:100vh;background:#fffaf6;color:#0f2748}
          .news-container{width:100%;max-width:1500px;margin:0 auto;padding:0 30px}
          .news-page-hero{position:relative;width:100%;padding:32px 0 24px;overflow:hidden;background:linear-gradient(90deg,#fffaf6 0%,#ffffff 50%,#fff8f2 100%)}
          .news-page-hero::before,.news-page-hero::after{content:"";position:absolute;width:310px;height:310px;top:-180px;border:35px solid rgba(249,115,22,0.07);border-radius:50%}
          .news-page-hero::before{left:-60px}
          .news-page-hero::after{right:-60px;width:330px;height:330px;top:-190px}
          .news-title-area{position:relative;z-index:2;text-align:center}
          .news-eyebrow{display:inline-flex;align-items:center;justify-content:center;gap:7px;margin-bottom:8px;color:#f15a16;font-size:calc(12px * var(--font-scale,1));font-weight:800;letter-spacing:0.8px}
          .news-eyebrow svg{flex-shrink:0;font-size:16px}
          .news-title-area h1{margin:0;font-size:calc(48px * var(--font-scale,1));font-weight:900;line-height:1.15}
          .news-heading-blue{color:#072d63}
          .news-heading-orange{color:#ff5b0b}
          .news-intro-section,.news-main-section{width:100%;background:#fffaf6}
          .news-intro-section{padding:0 0 18px}
          .news-intro-card{position:relative;width:100%;min-height:105px;padding:18px 28px 18px 42px;display:flex;align-items:center;gap:20px;background:#fff;border:1px solid #eee2d9;border-radius:14px;box-shadow:0 5px 15px rgba(40,53,72,0.04);overflow:hidden}
          .news-intro-line{position:absolute;top:17px;bottom:17px;left:20px;width:6px;border-radius:8px;background:#ff5b0b}
          .news-intro-icon,.news-empty-icon{width:56px;height:56px;display:flex;align-items:center;justify-content:center;border-radius:50%;background:#fff0e7;color:#ff5b0b;font-size:24px}
          .news-intro-icon{flex:0 0 56px}
          .news-intro-icon svg{display:block;width:24px;height:24px;flex-shrink:0}
          .news-intro-card p{flex:1;min-width:0;margin:0;color:#294f80;font-size:calc(15px * var(--font-scale,1));font-weight:600;line-height:1.7}
          .news-main-section{padding:0 0 60px}
          .news-filter-card{width:100%;margin-bottom:26px;padding:16px 18px;display:flex;align-items:flex-end;gap:18px;background:#fff;border:1px solid #eee1d8;border-radius:14px;box-shadow:0 5px 18px rgba(15,39,72,0.05)}
          .news-filter-heading{height:42px;display:flex;align-items:center;justify-content:center;gap:7px;padding:0 15px;color:#fff;background:#ff5b0b;border-radius:8px;font-size:calc(12px * var(--font-scale,1));font-weight:800;white-space:nowrap}
          .news-filter-heading svg,.news-filter-clear svg{flex-shrink:0}
          .news-filter-group{min-width:210px;display:flex;flex-direction:column;gap:6px}
          .news-filter-group label{color:#163d69;font-size:calc(11px * var(--font-scale,1));font-weight:800}
          .news-filter-group select,.news-date-input-wrap input{width:100%;height:42px;border:1px solid #d8e0e8;border-radius:7px;outline:none;background:#fff;color:#1d426d;font-family:inherit;font-size:calc(12px * var(--font-scale,1));font-weight:600}
          .news-filter-group select{padding:0 35px 0 12px;cursor:pointer}
          .news-filter-group select:focus,.news-date-input-wrap input:focus{border-color:#ff5b0b;box-shadow:0 0 0 2px rgba(255,91,11,0.08)}
          .news-date-input-wrap{position:relative;width:210px}
          .news-date-input-wrap > svg{position:absolute;top:50%;left:12px;z-index:2;transform:translateY(-50%);color:#ff5b0b;pointer-events:none;font-size:16px}
          .news-date-input-wrap input{padding:0 10px 0 38px}
          .news-clear-btn{height:42px;margin-left:auto;padding:0 16px;display:inline-flex;align-items:center;justify-content:center;gap:6px;border:1px solid #0b3367;border-radius:7px;background:#0b3367;color:#fff;font-family:inherit;font-size:calc(11px * var(--font-scale,1));font-weight:750;white-space:nowrap;cursor:pointer;transition:background .2s ease,border-color .2s ease}
          .news-clear-btn:hover{background:#ff5b0b;border-color:#ff5b0b}
          .news-results-header{margin-bottom:14px;display:flex;align-items:center;justify-content:space-between;gap:15px}
          .news-results-header h2{margin:0;color:#0b3367;font-size:calc(21px * var(--font-scale,1));font-weight:850}
          .news-result-count{display:flex;align-items:center;gap:6px;padding:7px 12px;border:1px solid #ffd6bf;border-radius:20px;background:#fff2e9;color:#7b4a32;font-size:calc(10px * var(--font-scale,1));font-weight:700}
          .news-result-count strong{color:#ff5b0b;font-size:calc(14px * var(--font-scale,1))}
          .news-list{width:100%;display:flex;flex-direction:column;gap:10px;padding:16px;background:#fff;border:1px solid #eee1d8;border-radius:14px;box-shadow:0 6px 22px rgba(15,39,72,0.05)}
          .news-item{position:relative;width:100%;min-height:115px;display:flex;align-items:center;gap:18px;padding:17px 125px 17px 18px;background:#fff;border:1px solid #e5e9ef;border-radius:9px;overflow:hidden;cursor:default;transition:border-color .2s ease,box-shadow .2s ease,background .2s ease}
          .news-item:nth-child(even){background:#fff9f5}
          .news-item:hover{border-color:#ffc39e;box-shadow:0 5px 15px rgba(15,39,72,0.06)}
          .news-number{width:48px;height:42px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:9px;background:#fff0e7;color:#0b3367;font-size:calc(14px * var(--font-scale,1));font-weight:850}
          .news-item-content{min-width:0;flex:1}
          .news-item-meta{margin-bottom:6px;display:flex;align-items:center;gap:12px;flex-wrap:wrap}
          .news-module-badge{display:inline-flex;align-items:center;min-height:25px;padding:4px 9px;border-radius:15px;background:#ff5b0b;color:#fff;font-size:calc(9px * var(--font-scale,1));font-weight:800}
          .news-item-date{display:inline-flex;align-items:center;gap:5px;color:#758397;font-size:calc(10px * var(--font-scale,1));font-weight:650}
          .news-item-date svg{flex-shrink:0;color:#ff5b0b}
          .news-item h3{margin:0 0 6px;color:#092f63;font-size:calc(15px * var(--font-scale,1));font-weight:800;line-height:1.35}
          .news-item p{margin:0;color:#53677e;font-size:calc(12px * var(--font-scale,1));font-weight:500;line-height:1.55}
          .latest-badge{position:absolute;top:16px;right:16px;padding:5px 10px;border-radius:16px;background:#eaf3ff;color:#0b3367;font-size:calc(9px * var(--font-scale,1));font-weight:800}
          .news-empty-state{min-height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:30px;background:#fff;border:1px solid #eee1d8;border-radius:14px}
          .news-empty-state p{margin:0;color:#66788d;font-size:calc(13px * var(--font-scale,1));font-weight:650;text-align:center}
          @media(min-width:1400px){.news-container{max-width:1600px;padding:0 50px}.news-title-area h1{font-size:calc(51px * var(--font-scale,1))}}
          @media(max-width:1200px){.news-container{padding:0 24px}.news-title-area h1{font-size:calc(43px * var(--font-scale,1))}.news-filter-group,.news-date-input-wrap{min-width:185px;width:185px}}
          @media(max-width:1024px){.news-container{padding:0 20px}.news-filter-card{flex-wrap:wrap;align-items:flex-end}.news-clear-btn{margin-left:0}}
          @media(max-width:900px){.news-page-hero{padding:28px 0 22px}.news-title-area h1{font-size:calc(38px * var(--font-scale,1))}.news-intro-card{padding:17px 20px 17px 38px;gap:16px}.news-intro-icon{width:50px;height:50px;flex-basis:50px;font-size:21px}.news-filter-heading{width:100%;justify-content:flex-start}.news-filter-group{flex:1 1 220px}.news-date-input-wrap{width:100%}.news-clear-btn{flex:0 0 auto}.news-item{padding:16px 105px 16px 16px}}
          @media(max-width:600px){.news-container{padding:0 14px}.news-page-hero{padding:24px 0 19px}.news-title-area h1{font-size:calc(30px * var(--font-scale,1))}.news-intro-section{padding-bottom:14px}.news-intro-card{min-height:90px;padding:15px 14px 15px 33px;align-items:flex-start;gap:12px}.news-intro-line{left:13px;top:14px;bottom:14px;width:5px}.news-intro-icon{width:42px;height:42px;flex:0 0 42px;font-size:19px}.news-intro-icon svg{width:19px;height:19px}.news-intro-card p{padding-top:2px;font-size:calc(12px * var(--font-scale,1));line-height:1.6}.news-main-section{padding-bottom:40px}.news-filter-card{padding:13px;gap:12px}.news-filter-group{flex:1 1 100%;width:100%}.news-filter-group select,.news-date-input-wrap,.news-date-input-wrap input,.news-clear-btn{width:100%}.news-results-header h2{font-size:calc(18px * var(--font-scale,1))}.news-list{padding:10px}.news-item{align-items:flex-start;gap:11px;min-height:auto;padding:14px}.news-number{width:39px;height:36px;font-size:calc(11px * var(--font-scale,1))}.news-item h3{font-size:calc(13px * var(--font-scale,1))}.news-item p{font-size:calc(11px * var(--font-scale,1))}.latest-badge{display:none}}
          @media(max-width:400px){.news-container{padding:0 10px}.news-page-hero{padding:21px 0 17px}.news-title-area h1{font-size:calc(26px * var(--font-scale,1))}.news-eyebrow{font-size:calc(10px * var(--font-scale,1))}.news-intro-card{padding:13px 11px 13px 28px;gap:9px}.news-intro-line{left:10px;width:4px}.news-intro-icon{width:36px;height:36px;flex:0 0 36px}.news-intro-icon svg{width:17px;height:17px}.news-intro-card p{font-size:calc(10.5px * var(--font-scale,1))}.news-filter-card{padding:11px}.news-filter-heading{height:38px}.news-filter-group select,.news-date-input-wrap input,.news-clear-btn{height:39px}.news-results-header{align-items:flex-start;flex-direction:column;gap:8px}.news-item{gap:8px;padding:12px 10px}.news-number{width:34px;height:32px}.news-item-meta{gap:7px}}
        `}</style>
      </main>
      <Footer />
    </>
  );
}
