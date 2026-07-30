import React from "react";
// Assumes you have these assets. Adjust paths as necessary.
import ps_logo from "../../../assets/PS_TRANS.png";
import bdoLogo from "../../../assets/BDO_logo.png";

export default function PDUFooter() {
  // Hardcoding language object to maintain component structure without breaking
  // if the global LanguageContext isn't available inside the PDU wrapper.
  const t = {
    brandDesc:
      "Pragati Setu is a unified digital platform for monitoring, analytics, and governance, empowering Self Help Groups and rural institutions across Uttar Pradesh.",
    lastUpdated: "Last Updated: 30 Apr, 2026",
    col1: "Pragati Setu",
    col1Links: [
      "About Pragati Setu",
      "About UPSRLM",
      "Contact Us",
      "Dashboards",
      "Pragati Setu Outreach",
      "Lakhpati Didi Impact",
      "CLF Performance",
      "Community Funds",
    ],
    col2: "Our Services",
    col2Links: [
      "Beneficiary Management System",
      "Training Management System",
      "Enterprise Sakhi",
      "Lakhpati Didi",
      "Monitoring & Analytics",
    ],
    col3: "Help & Support",
    col3Links: [
      "Application Information",
      "Release Notes",
      "Frequently Asked Questions",
      "What’s New",
      "Legal Info",
      "Advisory & Guidelines",
      "Copyright Policy",
    ],
    powered: "Powered by",
    rights: "All rights reserved.",
    bottom:
      "© 2026 – Copyright UPSRLM. Powered by BDO India LLP | Government of Uttar Pradesh. All rights reserved.",
    links: ["Disclaimer", "Terms & Conditions", "Privacy Policy"],
  };

  return (
    <footer className="pdu-footer">
      <div className="pdu-footer-top">
        {/* COLUMN 1 */}
        <div className="pdu-footer-col brand">
          <div className="pdu-footer-logo">
            <img src={ps_logo} alt="PS Logo" className="pdu-ps-logo" />
            <span className="pdu-brand-name">Pragati Setu</span>
          </div>
          <p className="pdu-brand-desc">{t.brandDesc}</p>
          <p className="pdu-updated">{t.lastUpdated}</p>
        </div>

        {/* COLUMN 2 */}
        <div className="pdu-footer-col">
          <h4>{t.col1}</h4>
          <ul>
            {t.col1Links.map((item, i) => (
              <li key={i}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3 */}
        <div className="pdu-footer-col">
          <h4>{t.col2}</h4>
          <ul>
            {t.col2Links.map((item, i) => (
              <li key={i}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 4 */}
        <div className="pdu-footer-col">
          <h4>{t.col3}</h4>
          <ul>
            {t.col3Links.map((item, i) => (
              <li key={i}>
                <a href="#">{item}</a>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 5 */}
        <div className="pdu-footer-col right">
          <img
            src={bdoLogo}
            alt="BDO Logo"
            style={{ width: "80px", marginTop: "20px" }}
          />
          <div className="pdu-powered-by">
            <p>
              {t.powered}
              <br />
              <strong>BDO India LLP</strong>
              <br />
              {t.rights}
            </p>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="pdu-footer-bottom">
        <span>{t.bottom}</span>
        <div className="pdu-footer-links">
          {t.links.map((l, i) => (
            <a key={i} href="#">
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* ===== STYLES ===== */}
      <style>{`
                .pdu-footer {
                    background: #ffffff;
                    color: #4b5563; /* Slate 600 */
                    font-size: 14px;
                    border-top: 1px solid #e5e7eb;
                    margin-top: auto; /* Pushes footer to bottom of flex layout */
                }

                .pdu-footer-top {
                    max-width: 1600px;
                    margin: 0 auto;
                    padding: 60px 24px;
                    display: grid;
                    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr;
                    gap: 40px;
                    text-align: left;
                }

                .pdu-footer-col h4 {
                    font-size: 16px;
                    margin-bottom: 16px;
                    font-weight: 700;
                    color: #1f2937;
                }

                .pdu-footer-col ul {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .pdu-footer-col li {
                    margin-bottom: 12px;
                }

                .pdu-footer-col li a {
                    color: #6b7280;
                    text-decoration: none;
                    transition: color 0.2s ease;
                }

                .pdu-footer-col li a:hover {
                    color: #2563eb;
                    text-decoration: underline;
                }

                /* BRAND */
                .pdu-footer-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 16px;
                }

                .pdu-ps-logo {
                    width: 50px;
                    height: 50px;
                    object-fit: contain;
                }

                .pdu-brand-name {
                    font-size: 20px;
                    font-weight: 800;
                    color: #1f2937;
                }

                .pdu-brand-desc {
                    line-height: 1.6;
                    color: #6b7280;
                    margin-bottom: 16px;
                }

                .pdu-updated {
                    font-size: 13px;
                    color: #9ca3af;
                }

                /* RIGHT COL */
                .pdu-footer-col.right {
                    text-align: left;
                }

                .pdu-powered-by p {
                    font-size: 13px;
                    color: #6b7280;
                    line-height: 1.5;
                    margin-top: 12px;
                }

                .pdu-powered-by strong {
                    color: #1f2937;
                }

                /* BOTTOM BAR */
                .pdu-footer-bottom {
                    border-top: 1px solid #f3f4f6;
                    padding: 20px 24px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 12px;
                    text-align: center;
                    font-size: 13px;
                    background-color: #f9fafb;
                }

                .pdu-footer-links {
                    display: flex;
                    gap: 24px;
                    flex-wrap: wrap;
                    justify-content: center;
                }          

                .pdu-footer-links a {
                    color: #6b7280;
                    text-decoration: none;
                    font-weight: 500;
                }

                .pdu-footer-links a:hover {
                    color: #2563eb;
                    text-decoration: underline;
                }

                /* RESPONSIVE */
                @media (max-width: 1100px) {
                    .pdu-footer-top {
                        grid-template-columns: 1fr 1fr;
                    }
                }

                @media (max-width: 600px) {
                    .pdu-footer-top {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
    </footer>
  );
}
