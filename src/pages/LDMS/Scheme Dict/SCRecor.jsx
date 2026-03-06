import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { LDMS_API } from "../../../api/axios";

/* ─────────────────────────────────────────
   Generic Page wrapper
───────────────────────────────────────── */
const Page = React.forwardRef(({ children, pageNumber, totalPages }, ref) => (
  <div className="shb-page" ref={ref}>
    <div className="shb-page-inner">{children}</div>
    {pageNumber != null && (
      <div className="shb-page-footer">
        <span className="shb-footer-line" />
        <span className="shb-page-num">{pageNumber}</span>
        <span className="shb-footer-line" />
      </div>
    )}
  </div>
));

/* ─────────────────────────────────────────
   Cover Page
───────────────────────────────────────── */
const CoverPage = React.forwardRef((_, ref) => (
  <div className="shb-page shb-cover" ref={ref}>
    <div className="shb-cover-texture" />
    <div className="shb-cover-border" />
    <div className="shb-cover-content">
      <div className="shb-cover-emblem">
        <i className="fa fa-book-open shb-cover-icon" />
      </div>
      <div className="shb-cover-divider" />
      <h1 className="shb-cover-title">UPSRLM</h1>
      <h2 className="shb-cover-subtitle">Scheme Handbook</h2>
      <div className="shb-cover-divider shb-cover-divider--thin" />
      <p className="shb-cover-desc">
        Explore department schemes with eligibility,
        <br />
        assistance, funding and contact details.
      </p>
      <div className="shb-cover-seal">
        <i className="fa fa-shield-alt" />
      </div>
    </div>
  </div>
));

/* ─────────────────────────────────────────
   Table of Contents Page
───────────────────────────────────────── */
const TocPage = React.forwardRef(({ schemes, onGoTo }, ref) => (
  <div className="shb-page shb-toc-page" ref={ref}>
    <div className="shb-page-inner">
      <div className="shb-section-header">
        <i className="fa fa-list-ul shb-section-icon" />
        <h2 className="shb-section-title">Table of Contents</h2>
      </div>
      <ul className="shb-toc-list">
        {schemes.map((s, i) => (
          <li key={s.id} className="shb-toc-item" onClick={() => onGoTo(i)}>
            <span className="shb-toc-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="shb-toc-dots" />
            <span className="shb-toc-name">{s.name}</span>
            <i className="fa fa-chevron-right shb-toc-arrow" />
          </li>
        ))}
      </ul>
    </div>
    <div className="shb-page-footer">
      <span className="shb-footer-line" />
      <span className="shb-page-num">i</span>
      <span className="shb-footer-line" />
    </div>
  </div>
));

/* ─────────────────────────────────────────
   Scheme Content Page
───────────────────────────────────────── */
const SchemePage = React.forwardRef(
  ({ scheme, pageNumber, totalPages }, ref) => (
    <div className="shb-page shb-scheme-page" ref={ref}>
      <div className="shb-page-inner">
        {/* Chapter marker */}
        <div className="shb-chapter-marker">
          <span className="shb-chapter-tag">
            <i className="fa fa-bookmark" /> Scheme
          </span>
        </div>

        <h2 className="shb-scheme-name">{scheme.name}</h2>

        {/* Meta grid */}
        <div className="shb-meta-grid">
          <div className="shb-meta-cell">
            <span className="shb-meta-label">
              <i className="fa fa-barcode" /> Code
            </span>
            <span className="shb-meta-value">{scheme.code || "—"}</span>
          </div>
          <div className="shb-meta-cell">
            <span className="shb-meta-label">
              <i className="fa fa-expand-alt" /> Scope
            </span>
            <span className="shb-meta-value">{scheme.scope || "—"}</span>
          </div>
          <div className="shb-meta-cell">
            <span className="shb-meta-label">
              <i className="fa fa-coins" /> Funding
            </span>
            <span className="shb-meta-value">{scheme.funding || "—"}</span>
          </div>
          <div className="shb-meta-cell">
            <span className="shb-meta-label">
              <i className="fa fa-phone-alt" /> Contact
            </span>
            <span className="shb-meta-value">
              {scheme.contact_point || "—"}
            </span>
          </div>
        </div>

        {/* Assistance */}
        <div className="shb-section">
          <div className="shb-section-header shb-section-header--sm">
            <i className="fa fa-hands-helping shb-section-icon" />
            <h3 className="shb-section-title shb-section-title--sm">
              Assistance
            </h3>
          </div>
          <p className="shb-section-body">{scheme.assistance || "—"}</p>
        </div>

        {/* Eligibility */}
        <div className="shb-section">
          <div className="shb-section-header shb-section-header--sm">
            <i className="fa fa-user-check shb-section-icon" />
            <h3 className="shb-section-title shb-section-title--sm">
              Eligibility
            </h3>
          </div>
          <p className="shb-section-body">{scheme.elligibility || "—"}</p>
        </div>
      </div>

      <div className="shb-page-footer">
        <span className="shb-footer-line" />
        <span className="shb-page-num">{pageNumber}</span>
        <span className="shb-footer-line" />
      </div>
    </div>
  ),
);

/* ─────────────────────────────────────────
   Main Component
───────────────────────────────────────── */
export default function SCRecor({ filters }) {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const bookRef = useRef();
  const stageRef = useRef();
  const [bookSize, setBookSize] = useState({ width: 460, height: 644 });
  const [isPortrait, setIsPortrait] = useState(false);

  /* ── Responsive: portrait (1-page) on ≤768px, landscape (2-page) above ── */
  useEffect(() => {
    const compute = () => {
      if (!stageRef.current) return;
      const w = stageRef.current.offsetWidth - 32; // subtract padding
      const portrait = w <= 768;
      setIsPortrait(portrait);
      // portrait: full width single page; landscape: half width per page
      const pageW = portrait
        ? Math.max(280, Math.floor(w))
        : Math.max(200, Math.floor(w / 2));
      const pageH = Math.max(380, Math.floor(pageW * 1.4));
      setBookSize({ width: pageW, height: pageH });
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (stageRef.current) ro.observe(stageRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!filters?.department_id) {
      setSchemes([]);
      return;
    }
    setLoading(true);
    LDMS_API.schemes({ department: filters.department_id })
      .then((r) => setSchemes(r.data?.results || []))
      .finally(() => setLoading(false));
  }, [filters]);

  /* ── Search: fixed to run against full schemes list ── */
  const filteredSchemes = useMemo(() => {
    if (!search.trim()) return schemes;
    const q = search.trim().toLowerCase();
    return schemes.filter(
      (s) =>
        s.name?.toLowerCase().includes(q) ||
        s.code?.toLowerCase().includes(q) ||
        s.assistance?.toLowerCase().includes(q) ||
        s.elligibility?.toLowerCase().includes(q),
    );
  }, [search, schemes]);

  const totalPages = filteredSchemes.length + 2; // cover + toc + scheme pages

  const nextPage = useCallback(
    () => bookRef.current?.pageFlip().flipNext(),
    [],
  );
  const prevPage = useCallback(
    () => bookRef.current?.pageFlip().flipPrev(),
    [],
  );
  const goToPage = useCallback((schemeIdx) => {
    // cover=0, toc=1, schemes start at 2
    bookRef.current?.pageFlip().flip(schemeIdx + 2);
  }, []);

  const handleFlip = useCallback((e) => setCurrentPage(e.data), []);

  if (loading)
    return (
      <div className="shb-state">
        <i className="fa fa-spinner fa-spin shb-state-icon" />
        <p>Loading Scheme Handbook…</p>
      </div>
    );

  if (!filters?.department_id)
    return (
      <div className="shb-state">
        <i className="fa fa-building shb-state-icon shb-state-icon--muted" />
        <p>Select a department to view schemes.</p>
      </div>
    );

  if (!loading && schemes.length === 0)
    return (
      <div className="shb-state">
        <i className="fa fa-folder-open shb-state-icon shb-state-icon--muted" />
        <p>No schemes available for this department.</p>
      </div>
    );

  return (
    <div className="shb-root">
      {/* ── Toolbar ── */}
      <div className="shb-toolbar">
        <div className="shb-toolbar-brand">
          <i className="fa fa-book shb-brand-icon" />
          <span className="shb-brand-text">Scheme Handbook</span>
        </div>

        <div className="shb-search-wrap">
          <i className="fa fa-search shb-search-icon" />
          <input
            className="shb-search-input"
            placeholder="Search schemes…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="shb-search-clear"
              onClick={() => setSearch("")}
              title="Clear"
            >
              <i className="fa fa-times" />
            </button>
          )}
        </div>

        <div className="shb-nav">
          <button
            className="shb-nav-btn"
            onClick={prevPage}
            disabled={currentPage === 0}
            title="Previous page"
          >
            <i className="fa fa-chevron-left" />
          </button>
          <span className="shb-nav-pages">
            {currentPage + 1} <span className="shb-nav-sep">/</span>{" "}
            {totalPages}
          </span>
          <button
            className="shb-nav-btn"
            onClick={nextPage}
            disabled={currentPage >= totalPages - 1}
            title="Next page"
          >
            <i className="fa fa-chevron-right" />
          </button>
        </div>
      </div>

      {/* Search result count */}
      {search.trim() && (
        <div className="shb-search-badge">
          <i className="fa fa-filter" />
          {filteredSchemes.length} result
          {filteredSchemes.length !== 1 ? "s" : ""} for &ldquo;{search}&rdquo;
        </div>
      )}

      {/* ── Book ── */}
      <div className="shb-book-stage" ref={stageRef}>
        <div className="shb-book-shadow" />
        <HTMLFlipBook
          key={`${filteredSchemes.length}-${search}-${bookSize.width}-${isPortrait}`}
          width={bookSize.width}
          height={bookSize.height}
          size="fixed"
          minWidth={280}
          maxWidth={600}
          minHeight={380}
          maxHeight={840}
          showCover
          drawShadow
          flippingTime={750}
          usePortrait={isPortrait}
          startPage={0}
          ref={bookRef}
          onFlip={handleFlip}
          className="shb-flipbook"
          mobileScrollSupport
        >
          <CoverPage />
          <TocPage schemes={filteredSchemes} onGoTo={goToPage} />
          {filteredSchemes.map((s, i) => (
            <SchemePage
              key={s.id}
              scheme={s}
              pageNumber={i + 1}
              totalPages={filteredSchemes.length}
            />
          ))}
        </HTMLFlipBook>
      </div>

      <style>{`
        /* ───── Root vars ───── */
        .shb-root {
          --red:      #c62828;
          --red-dk:   #8e0000;
          --red-lt:   #ef5350;
          --red-bg:   #fff5f5;
          --green:    #2e7d32;
          --green-lt: #4caf50;
          --white:    #ffffff;
          --off-wh:   #fdf8f5;
          --ink:      #1a0a00;
          --ink-mid:  #4a3428;
          --ink-lt:   #8d6e63;
          --border:   #e8d5c4;
          --shadow:   rgba(140, 30, 0, 0.18);
          --gold:     #b8860b;

          font-family: inherit;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0;
          width: 100%;
          background: linear-gradient(160deg, #fff8f6 0%, #fff0ed 100%);
          min-height: 100%;
          padding-bottom: 24px;
        }

        /* ───── Toolbar ───── */
        .shb-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          background: linear-gradient(135deg, var(--red-dk) 0%, var(--red) 60%, #d32f2f 100%);
          padding: 10px 20px;
          box-shadow: 0 4px 18px var(--shadow);
          position: relative;
          z-index: 10;
          flex-wrap: wrap;
        }

        .shb-toolbar-brand {
          display: flex;
          align-items: center;
          gap: 9px;
          flex: 0 0 auto;
        }

        .shb-brand-icon {
          font-size: 22px;
          color: var(--white);
          filter: drop-shadow(0 1px 3px rgba(0,0,0,.4));
        }

        .shb-brand-text {
          font-family: inherit;
          font-size: 17px;
          font-weight: 700;
          color: var(--white);
          letter-spacing: .04em;
          white-space: nowrap;
          text-shadow: 0 1px 4px rgba(0,0,0,.35);
        }

        .shb-search-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,.15);
          border: 1.5px solid rgba(255,255,255,.35);
          border-radius: 30px;
          padding: 6px 14px;
          flex: 1 1 220px;
          max-width: 380px;
          backdrop-filter: blur(8px);
          transition: background .2s, border-color .2s;
        }

        .shb-search-wrap:focus-within {
          background: rgba(255,255,255,.25);
          border-color: rgba(255,255,255,.7);
        }

        .shb-search-icon { color: rgba(255,255,255,.75); font-size: 13px; }

        .shb-search-input {
          background: transparent;
          border: none;
          outline: none;
          color: var(--white);
          font-family: inherit;
          font-size: 14.5px;
          width: 100%;
          placeholder-color: rgba(255,255,255,.6);
        }

        .shb-search-input::placeholder { color: rgba(255,255,255,.6); }

        .shb-search-clear {
          background: rgba(255,255,255,.18);
          border: none;
          color: rgba(255,255,255,.8);
          cursor: pointer;
          padding: 2px 5px;
          border-radius: 50%;
          font-size: 11px;
          line-height: 1;
          transition: background .15s;
        }

        .shb-search-clear:hover { background: rgba(255,255,255,.35); }

        /* Nav */
        .shb-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-left: auto;
        }

        .shb-nav-btn {
          background: rgba(255,255,255,.18);
          border: 1.5px solid rgba(255,255,255,.4);
          color: var(--white);
          width: 32px; height: 32px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 12px;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s, transform .15s;
        }

        .shb-nav-btn:hover:not(:disabled) {
          background: rgba(255,255,255,.32);
          transform: scale(1.1);
        }

        .shb-nav-btn:disabled { opacity: .35; cursor: default; }

        .shb-nav-pages {
          color: rgba(255,255,255,.9);
          font-size: 13px;
          font-family: inherit;
          min-width: 52px;
          text-align: center;
        }

        .shb-nav-sep { color: rgba(255,255,255,.45); margin: 0 2px; }

        /* Search badge */
        .shb-search-badge {
          display: flex;
          align-items: center;
          gap: 7px;
          background: var(--red-bg);
          border: 1px solid #f5c6c6;
          border-top: none;
          padding: 5px 18px;
          font-size: 12.5px;
          color: var(--red);
          font-family: inherit;
          width: 100%;
          letter-spacing: .02em;
        }

        /* ───── Book Stage ───── */
        .shb-book-stage {
          position: relative;
          margin-top: 28px;
          padding: 0 12px 28px;
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .shb-book-shadow {
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
          width: 70%;
          height: 28px;
          pointer-events: none;
          z-index: 0;
        }

        /* ───── Pages ───── */
        .shb-page {
          background: var(--off-wh);
          position: relative;
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          /* Aged paper feel */
          background-image:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 27px,
              rgba(180,140,100,.06) 27px,
              rgba(180,140,100,.06) 28px
            );
          border: 1px solid var(--border);
        }

        /* Left page: binding shadow */
        .shb-page:nth-child(odd) {
          border-right: 3px solid rgba(120,50,0,.14);
          box-shadow: inset -6px 0 14px rgba(120,50,0,.07);
        }

        /* Right page */
        .shb-page:nth-child(even) {
          border-left: 3px solid rgba(120,50,0,.14);
          box-shadow: inset 6px 0 14px rgba(120,50,0,.07);
        }

        .shb-page-inner {
          flex: 1;
          padding: 28px 30px 16px;
          overflow-y: auto;
          overflow-x: hidden;
          max-height: calc(100% - 38px);
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        /* ── Page Footer ── */
        .shb-page-footer {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 28px 12px;
        }

        .shb-footer-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--border), transparent);
        }

        .shb-page-num {
          font-family: inherit;
          font-size: 11px;
          color: var(--ink-lt);
          letter-spacing: .1em;
        }

        /* ───── Cover ───── */
        .shb-cover {
          background: linear-gradient(160deg, var(--red-dk) 0%, var(--red) 55%, #b71c1c 100%) !important;
          background-color: var(--red-dk) !important;
          border: none !important;
          box-shadow: none !important;
          overflow: hidden;
        }

        .shb-cover-texture {
          position: absolute;
          inset: 0;
          background-image:
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,.025) 0px,
              rgba(255,255,255,.025) 1px,
              transparent 1px,
              transparent 8px
            );
          pointer-events: none;
        }

        .shb-cover-border {
          position: absolute;
          inset: 14px;
          border: 2px solid rgba(255,255,255,.18);
          pointer-events: none;
        }

        .shb-cover-border::before {
          content: '';
          position: absolute;
          inset: 5px;
          border: 1px solid rgba(255,255,255,.1);
        }

        .shb-cover-content {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 10px;
          padding: 32px;
          text-align: center;
        }

        .shb-cover-emblem {
          width: 72px; height: 72px;
          background: rgba(255,255,255,.12);
          border: 2px solid rgba(255,255,255,.3);
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 6px rgba(255,255,255,.06);
        }

        .shb-cover-icon {
          font-size: 30px;
          color: var(--white);
          filter: drop-shadow(0 2px 6px rgba(0,0,0,.4));
        }

        .shb-cover-divider {
          width: 64px;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--white), transparent);
          border-radius: 2px;
        }

        .shb-cover-divider--thin { height: 1px; width: 44px; opacity: .6; }

        .shb-cover-title {
          font-family: inherit;
          font-size: 44px;
          font-weight: 900;
          color: var(--white);
          letter-spacing: .1em;
          text-shadow: 0 3px 12px rgba(0,0,0,.4);
          line-height: 1;
        }

        .shb-cover-subtitle {
          font-family: inherit;
          font-size: 18px;
          font-weight: 400;
          color: rgba(255,255,255,.85);
          letter-spacing: .18em;
          text-transform: uppercase;
        }

        .shb-cover-desc {
          color: rgba(255,255,255,.65);
          font-size: 13px;
          font-family: inherit;
          font-style: italic;
          line-height: 1.65;
        }

        .shb-cover-seal {
          margin-top: 8px;
          font-size: 18px;
          color: var(--white);
          opacity: .7;
        }

        /* ───── Table of Contents ───── */
        .shb-toc-page { }

        .shb-toc-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .shb-toc-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 6px;
          cursor: pointer;
          transition: background .18s, color .18s, transform .15s;
          border-bottom: 1px dashed rgba(180,140,100,.2);
        }

        .shb-toc-item:hover {
          background: var(--red-bg);
          color: var(--red);
          transform: translateX(4px);
        }

        .shb-toc-item:hover .shb-toc-arrow { opacity: 1; color: var(--red); }

        .shb-toc-num {
          font-family: inherit;
          font-size: 11px;
          color: var(--red);
          font-weight: 700;
          min-width: 22px;
        }

        .shb-toc-dots {
          flex: 1;
          height: 1px;
          border-bottom: 1.5px dotted rgba(180,140,100,.35);
          margin: 0 4px;
        }

        .shb-toc-name {
          font-size: 13px;
          color: var(--ink-mid);
          font-family: inherit;
          text-align: right;
          max-width: 55%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .shb-toc-arrow {
          font-size: 10px;
          color: var(--border);
          opacity: .5;
          transition: opacity .18s, color .18s;
        }

        /* ───── Section Headers ───── */
        .shb-section-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 8px;
          border-bottom: 2px solid var(--red);
          margin-bottom: 4px;
        }

        .shb-section-header--sm {
          border-bottom: 1px solid rgba(198,40,40,.25);
          padding-bottom: 5px;
        }

        .shb-section-icon {
          color: var(--red);
          font-size: 14px;
        }

        .shb-section-title {
          font-family: inherit;
          font-size: 20px;
          font-weight: 700;
          color: var(--ink);
          letter-spacing: .02em;
        }

        .shb-section-title--sm {
          font-size: 14px;
          color: var(--red-dk);
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        /* ───── Scheme Page ───── */
        .shb-chapter-marker {
          display: flex;
          justify-content: flex-end;
        }

        .shb-chapter-tag {
          background: var(--red);
          color: var(--white);
          font-size: 10px;
          font-family: inherit;
          letter-spacing: .08em;
          padding: 3px 10px;
          border-radius: 0 0 6px 6px;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(198,40,40,.3);
        }

        .shb-chapter-tag .fa { margin-right: 4px; font-size: 9px; }

        .shb-scheme-name {
          font-family: inherit;
          font-size: 19px;
          font-weight: 700;
          color: var(--red-dk);
          line-height: 1.3;
          border-left: 4px solid var(--red);
          padding-left: 10px;
          margin: 4px 0 8px;
        }

        /* Meta grid */
        .shb-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 8px;
        }

        .shb-meta-cell {
          background: rgba(255,255,255,.7);
          border: 1px solid var(--border);
          border-radius: 7px;
          padding: 8px 10px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          box-shadow: 0 1px 4px rgba(120,50,0,.06);
        }

        .shb-meta-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .08em;
          color: var(--green);
          font-weight: 600;
          font-family: inherit;
        }

        .shb-meta-label .fa { margin-right: 4px; }

        .shb-meta-value {
          font-size: 13px;
          color: var(--ink);
          font-family: inherit;
          line-height: 1.4;
          word-break: break-word;
        }

        /* Sections */
        .shb-section { display: flex; flex-direction: column; gap: 6px; }

        .shb-section-body {
          font-size: 13px;
          color: var(--ink-mid);
          line-height: 1.7;
          white-space: pre-line;
          font-family: inherit;
          font-style: italic;
        }

        /* ───── States ───── */
        .shb-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 60px 20px;
          font-family: inherit;
          font-size: 16px;
          color: var(--ink-lt);
          text-align: center;
        }

        .shb-state-icon {
          font-size: 36px;
          color: var(--red);
        }

        .shb-state-icon--muted { color: var(--border); }

        /* ───── Flipbook overrides ───── */
        .shb-flipbook { box-shadow: 0 20px 60px rgba(255, 64, 0, 0.28), 0 4px 16px rgba(255, 0, 0, 0.18) !important; }

        /* Scrollbar on pages */
        .shb-page-inner::-webkit-scrollbar { width: 4px; }
        .shb-page-inner::-webkit-scrollbar-track { background: transparent; }
        .shb-page-inner::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .shb-toolbar { gap: 8px; padding: 8px 12px; }
          .shb-brand-text { display: none; }
          .shb-search-wrap { max-width: 100%; }
          .shb-nav { margin-left: 0; }
          .shb-meta-grid { grid-template-columns: 1fr; }
          .shb-cover-title { font-size: 32px; }
          .shb-page-inner { padding: 18px 18px 12px; }
        }
      `}</style>
    </div>
  );
}
