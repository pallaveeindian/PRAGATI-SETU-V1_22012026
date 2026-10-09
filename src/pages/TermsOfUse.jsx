// src/pages/TermsOfUse.jsx
import React, { useEffect } from "react";
import {
  FiFileText,
  FiShield,
  FiUserCheck,
  FiAlertTriangle,
  FiExternalLink,
  FiEdit3,
  FiMapPin,
  FiMail,
  FiPhone,
  FiBookOpen,
} from "react-icons/fi";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";
import up_logo from "../assets/upgov_logo.jpg";

// "On This Page" sidebar links
const NAV_LINKS = [
  { id: "acceptance", number: "01", label: "Acceptance of Terms" },
  { id: "ownership", number: "02", label: "Platform Ownership" },
  { id: "account", number: "03", label: "Account Governance" },
  { id: "prohibited", number: "04", label: "Prohibited Conduct" },
  { id: "accuracy", number: "05", label: "User Responsibilities" },
  { id: "ipr", number: "06", label: "Intellectual Property" },
  { id: "links", number: "07", label: "External Links" },
  { id: "liability", number: "08", label: "Liability & Warranty" },
  { id: "modifications", number: "09", label: "Modifications" },
  { id: "jurisdiction", number: "10", label: "Governing Law" },
  { id: "support", number: "11", label: "Support & Contact" },
];

// section 2 — ownership
const OWNERSHIP_ITEMS = [
  {
    title: "Ownership",
    body: (
      <>
        Pragati Setu is an official digital governance platform owned, operated,
        and maintained by <strong>UPSRLM</strong>, Department of Rural
        Development, Government of Uttar Pradesh.
      </>
    ),
  },
  {
    title: "Official Emblem & Branding",
    body: "The State Emblem of Uttar Pradesh, official logos, seals, design layouts, and trademarks displayed on the Platform are protected under the State Emblem of India (Prohibition of Improper Use) Act, 2005 and applicable copyright laws. Unauthorized reproduction, imitation, or misuse is strictly prohibited.",
  },
  {
    title: "Technical Implementation",
    body: (
      <>
        Technical development, maintenance, and Project Management Unit (PMU)
        operations are executed in coordination with authorized state agencies
        (including U.P. Electronics Corporation Limited / UPLC) and technical
        implementation partners (including <strong>BDO India LLP</strong>).
      </>
    ),
  },
];

// section 3 — account governance
const ACCOUNT_ITEMS = [
  {
    icon: <FiUserCheck />,
    title: "Credential Security",
    body: "Users issued official login credentials (username, password, OTP, biometric credentials) are solely responsible for maintaining their strict confidentiality. You must not share, transfer, or assign your account credentials to any unauthorized person.",
  },
  {
    icon: <FiShield />,
    title: "Unauthorized Activity",
    body: "Any action, data modification, survey upload, or attendance marking performed under your user account shall be deemed to have been executed by you. UPSRLM disclaims all liability for losses or discrepancies arising from compromised user credentials resulting from user negligence.",
  },
  {
    icon: <FiAlertTriangle />,
    title: "Account Suspension & Revocation",
    body: "UPSRLM reserves the absolute right to suspend, lock, deactivate, or terminate any user account immediately and without prior notice in the event of suspected credential compromise, unauthorized role elevation, data tampering, or violation of operational Standard Operating Procedures (SOPs).",
  },
];

// section 4 — prohibited conduct
const PROHIBITED_ITEMS = [
  {
    label: "Tampering & Reverse Engineering:",
    text: "Attempting to decompile, reverse engineer, disassemble, modify, or extract source code from the web portal, database schemas, or Udhyam Sakhi Android application.",
  },
  {
    label: "Data Falsification:",
    text: "Uploading false, fictitious, manipulated, or fraudulent beneficiary profiles, survey figures, biometric attendance records, enterprise revenue metrics, or training batch details.",
  },
  {
    label: "Malicious Software & Attacks:",
    text: "Introducing viruses, trojans, worms, logic bombs, ransomware, or conducting Denial-of-Service (DoS / DDoS) attacks or unauthorized automated scraping/crawling.",
  },
  {
    label: "Bypassing Security Controls:",
    text: "Attempting unauthorized directory traversal, probing, scanning, or testing system vulnerabilities without express authorization from CERT-In / STQC or UPSRLM IT authorities.",
  },
];

// section 5 — accuracy & responsibilities
const ACCURACY_ITEMS = [
  {
    title: "User Duty of Accuracy",
    body: "Field functionaries, CRPs, training partners, and administrative officers entering data into Pragati Setu must ensure that all beneficiary details, socio-economic metrics, attendance logs, and survey entries are authentic, complete, and verifiable.",
  },
  {
    title: "Verification & Audit",
    body: "UPSRLM reserves the right to conduct random physical and digital audits, field verifications, and data cross-checks. Discrepancies may result in cancellation of scheme mapping, withholding of training batch funds, or administrative action.",
  },
];

// section 6 — intellectual property
const IPR_ITEMS = [
  {
    title: "Government Property",
    body: "All platform content, user interface designs, graphics, databases, analytics dashboards, source code, user manuals, and documentation are the exclusive intellectual property of UPSRLM and the Government of Uttar Pradesh.",
  },
  {
    title: "Limited Usage Grant",
    body: "Citizens and beneficiaries are granted a limited, non-exclusive, non-transferable, revocable license to access and view public dashboards, guidelines, and manuals solely for informational and personal welfare scheme purposes.",
  },
  {
    title: "Reproduction Rights",
    body: "No material from this Platform may be copied, reproduced, republished, uploaded, posted, transmitted, or distributed for commercial purposes without prior written consent from the Web Information Manager (WIM) / UPSRLM.",
  },
];

// section 7 — external links
const LINK_ITEMS = [
  {
    icon: <FiExternalLink />,
    title: "External Hyperlinks",
    body: "Pragati Setu may contain links to external non-government or inter-departmental portals (e.g., DigiLocker, PFMS, e-Procurement/GeM) for scheme convergence.",
  },
  {
    icon: <FiShield />,
    title: "Disclaimer of Endorsement",
    body: "External links are provided solely for user convenience. UPSRLM does not guarantee the authenticity, availability, security, or privacy practices of hyperlinked external sites, nor does the inclusion of a link imply endorsement. Users accessing external sites do so entirely at their own risk.",
  },
];

// section 8 — liability
const LIABILITY_ITEMS = [
  {
    title: '"As-Is" Service Provision',
    body: 'Pragati Setu, its modules, dashboards, and associated mobile applications are provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind, whether express, implied, or statutory.',
  },
  {
    title: "No Liability for System Interruptions",
    body: "UPSRLM, the Department of Rural Development (Government of UP), UPLC, and technical implementation partners (including BDO India LLP) shall not be liable for platform downtime, scheduled maintenance, server outages, telecom network failures, or technical glitches beyond reasonable administrative control.",
  },
  {
    title: "Limitation of Damages",
    body: "Under no circumstances shall UPSRLM, its officers, consultants, field functionaries, or technical partners be liable for any direct, indirect, incidental, special, consequential, or punitive damages (including loss of data, anticipated scheme benefits, or business opportunities) arising out of the use of or inability to use the Platform.",
  },
  {
    title: "Sovereign & Good Faith Protection",
    body: "Actions taken by government officers and authorized functionaries in good faith under statutory mandates, state schemes, and mission guidelines are fully protected under applicable administrative and sovereign immunity laws.",
  },
];

// section 11 — support contacts (line type: text | mail | tel)
const CONTACTS = [
  {
    icon: <FiExternalLink />,
    title: "Grievance Portal",
    lines: [{ type: "text", value: 'Homepage "Complaint & Support" Section' }],
  },
  {
    icon: <FiBookOpen />,
    title: "Resource Centre",
    lines: [{ type: "text", value: "Platform User Manuals & Guidelines" }],
  },
  {
    icon: <FiMail />,
    title: "Head Project Manager (PMU-IT, UPSRLM)",
    lines: [
      { type: "text", value: "Mr. Sachin Mishra" },
      { type: "mail", value: "SachinAKumar@bdo.in" },
      { type: "tel", value: "+91-9984988066" },
    ],
  },
  {
    icon: <FiMail />,
    title: "Project Manager (PMU-IT, UPSRLM)",
    lines: [
      { type: "text", value: "Mr. Ashish Saraf" },
      { type: "mail", value: "bdopmuit@gmail.com" },
      { type: "tel", value: "+91-9936753975" },
    ],
  },
  {
    icon: <FiMail />,
    title: "Technical Support Lead (PMU-IT, UPSRLM)",
    lines: [
      { type: "text", value: "Ms. Shilpi Raizada" },
      { type: "mail", value: "ShilpiRaizada@bdo.in" },
      { type: "tel", value: "+91-7073865639" },
    ],
  },
  {
    icon: <FiPhone />,
    title: "Helpline Support",
    lines: [
      { type: "tel", value: "+91-9236434631" },
      { type: "tel", value: "+91-9140346524" },
      { type: "text", value: "Mon – Fri, 10:30 AM – 6:30 PM" },
    ],
  },
];

function ContactLine({ type, value }) {
  if (type === "mail") return <a href={`mailto:${value}`}>{value}</a>;
  if (type === "tel")
    return <a href={`tel:${value.replace(/[^0-9+]/g, "")}`}>{value}</a>;
  return <span>{value}</span>;
}

// numbered section wrapper: header (number + label + title) + body
function SectionCard({ id, number, label, title, children }) {
  return (
    <article className="terms-section-card" id={id}>
      <div className="terms-section-header">
        <div className="terms-section-number">{number}</div>
        <div>
          <span className="terms-section-label">{label}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="terms-section-body">{children}</div>
    </article>
  );
}

// numbered list of { title, body }
function NumberedList({ items }) {
  return (
    <div className="terms-numbered-list">
      {items.map((item, index) => (
        <div className="terms-numbered-item" key={item.title}>
          <div className="terms-list-number">{index + 1}</div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

// icon list of { icon, title, body }
function FeatureList({ items }) {
  return (
    <div className="terms-feature-list">
      {items.map((item) => (
        <div className="terms-feature-item" key={item.title}>
          <div className="terms-feature-icon">{item.icon}</div>
          <div>
            <h3>{item.title}</h3>
            <p>{item.body}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function TermsOfUse() {
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="terms-page-shell">
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="terms-page">
        <section className="terms-hero">
          <div className="terms-container">
            <div className="terms-hero-content">
              <div className="terms-eyebrow">
                <FiFileText />
                <span>LEGAL & PLATFORM USAGE</span>
              </div>

              <h1>
                <span className="terms-title-blue">Pragati Setu</span>{" "}
                <span className="terms-title-orange">Terms of Use</span>
              </h1>

              <p className="terms-platform-name">
                Pragati Setu: Digital Livelihoods Platform for Uttar Pradesh
              </p>
              <p className="terms-department">
                Uttar Pradesh State Rural Livelihoods Mission (UPSRLM)
              </p>
              <p className="terms-government">
                Department of Rural Development, Government of Uttar Pradesh
              </p>

              <div className="terms-effective-date">
                <span>Effective Date</span>
                <strong>May 7, 2026</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-intro-section">
          <div className="terms-container">
            <div className="terms-intro-card">
              <div className="terms-intro-accent"></div>
              <div className="terms-intro-icon">
                <FiShield />
              </div>
              <div className="terms-intro-text">
                <h2>Terms Governing Use of Pragati Setu</h2>
                <p>
                  These Terms of Use govern access to and use of the Pragati
                  Setu digital ecosystem, its web portal, mobile applications,
                  sub-domains, and integrated digital modules.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="terms-content-section">
          <div className="terms-container">
            <div className="terms-layout">
              <aside className="terms-sidebar">
                <div className="terms-sidebar-card">
                  <div className="terms-sidebar-heading">
                    <FiBookOpen />
                    <span>On This Page</span>
                  </div>

                  <nav className="terms-page-nav">
                    {NAV_LINKS.map(({ id, number, label }) => (
                      <a href={`#${id}`} key={id}>
                        <span>{number}</span>
                        {label}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              <div className="terms-content">
                <SectionCard
                  id="acceptance"
                  number="01"
                  label="LEGAL ACCEPTANCE"
                  title="Acceptance of Terms & Legal Binding"
                >
                  <p>
                    By accessing, browsing, registering for, or using the{" "}
                    <strong>Pragati Setu</strong> digital ecosystem—including
                    the official web portal, mobile applications (such as the
                    Udhyam Sakhi Android application), sub-domains, and
                    integrated modules (collectively, the "Platform")—you
                    ("User", "Registered User", "Field Functionary", or
                    "Beneficiary") unconditionally agree to be bound by these
                    Terms of Use ("Terms").
                  </p>
                  <p>
                    If you do not agree to these Terms, you must immediately
                    cease accessing or using the Platform. Continued use
                    constitutes express acceptance of these Terms and any
                    subsequent modifications published by the{" "}
                    <strong>
                      Uttar Pradesh State Rural Livelihoods Mission (UPSRLM)
                    </strong>
                    .
                  </p>
                </SectionCard>

                <SectionCard
                  id="ownership"
                  number="02"
                  label="OWNERSHIP"
                  title="Platform Ownership & Government Association"
                >
                  <NumberedList items={OWNERSHIP_ITEMS} />
                </SectionCard>

                <SectionCard
                  id="account"
                  number="03"
                  label="USER ACCESS"
                  title="User Account Governance & Role-Based Access Control (RBAC)"
                >
                  <p>
                    Access to administrative and field modules within Pragati
                    Setu is strictly regulated through Role-Based Access Control
                    (RBAC) across State (SMMU), District (DMMU), Block (BMMU),
                    Training Partner, Master Trainer, and Community Resource
                    Person (CRP) levels:
                  </p>
                  <FeatureList items={ACCOUNT_ITEMS} />
                </SectionCard>

                <SectionCard
                  id="prohibited"
                  number="04"
                  label="SYSTEM SECURITY"
                  title="Prohibited Conduct and System Integrity"
                >
                  <p>
                    Users of Pragati Setu are expressly prohibited from engaging
                    in any of the following activities:
                  </p>

                  <ul className="terms-warning-list">
                    {PROHIBITED_ITEMS.map((item) => (
                      <li key={item.label}>
                        <FiAlertTriangle />
                        <span>
                          <strong>{item.label}</strong> {item.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="terms-warning-box">
                    <FiAlertTriangle />
                    <p>
                      Engaging in any prohibited conduct may attract immediate
                      account termination, departmental disciplinary
                      proceedings, and criminal prosecution under the
                      Information Technology Act, 2000, the Bharatiya Nyaya
                      Sanhita (BNS), and applicable cybercrime laws.
                    </p>
                  </div>
                </SectionCard>

                <SectionCard
                  id="accuracy"
                  number="05"
                  label="USER RESPONSIBILITY"
                  title="Accuracy of Information & User Responsibilities"
                >
                  <NumberedList items={ACCURACY_ITEMS} />
                </SectionCard>

                <SectionCard
                  id="ipr"
                  number="06"
                  label="INTELLECTUAL PROPERTY"
                  title="Intellectual Property Rights (IPR) & Content Usage"
                >
                  <NumberedList items={IPR_ITEMS} />
                </SectionCard>

                <SectionCard
                  id="links"
                  number="07"
                  label="EXTERNAL WEBSITES"
                  title="Hyperlinking & External Links Policy"
                >
                  <FeatureList items={LINK_ITEMS} />
                </SectionCard>

                <SectionCard
                  id="liability"
                  number="08"
                  label="DISCLAIMER"
                  title="Comprehensive Disclaimer of Warranties & Limitation of Liability"
                >
                  <p>To the maximum extent permitted by applicable law:</p>
                  <NumberedList items={LIABILITY_ITEMS} />
                </SectionCard>

                <SectionCard
                  id="modifications"
                  number="09"
                  label="POLICY UPDATES"
                  title="Modifications to Terms & Platform Updates"
                >
                  <div className="terms-simple-info">
                    <FiEdit3 />
                    <p>
                      UPSRLM reserves the right, at its sole discretion, to
                      modify, update, add, or remove portions of these Terms at
                      any time without prior individual notice. Revised Terms
                      will be posted on the homepage footer with an updated
                      effective date. Continued use of the Platform following
                      published changes constitutes full acceptance of the
                      revised Terms.
                    </p>
                  </div>
                </SectionCard>

                <SectionCard
                  id="jurisdiction"
                  number="10"
                  label="GOVERNING LAW"
                  title="Governing Law and Exclusive Jurisdiction"
                >
                  <div className="terms-jurisdiction-box">
                    <FiMapPin />
                    <p>
                      These Terms of Use shall be governed by, construed, and
                      enforced strictly in accordance with the laws of India.
                      Any legal dispute, claim, or proceeding arising out of or
                      in connection with the Pragati Setu platform or these
                      Terms shall be subject to the{" "}
                      <strong>
                        exclusive jurisdiction of the competent Courts at
                        Lucknow, Uttar Pradesh, India
                      </strong>
                      .
                    </p>
                  </div>
                </SectionCard>

                <SectionCard
                  id="support"
                  number="11"
                  label="HELP & SUPPORT"
                  title="Support, Grievance Portal & Contact Information"
                >
                  <p>
                    For technical guidance, operational support, or reporting
                    portal grievances, users should refer to the{" "}
                    <strong>Complaint & Support</strong> grievance portal on the
                    homepage or contact the designated PMU-IT team:
                  </p>

                  <div className="terms-support-grid">
                    {CONTACTS.map((contact) => (
                      <div className="terms-contact-card" key={contact.title}>
                        {contact.icon}
                        <div>
                          <strong>{contact.title}</strong>
                          {contact.lines.map((line) => (
                            <ContactLine key={line.value} {...line} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        </section>

        <style>{`
          .terms-page-shell, .terms-page-shell * {
            box-sizing: border-box;
          }
          .terms-page {
            width: 100%;
            min-height: 100vh;
            background: #fffaf6;
            color: #183a61;
          }
          .terms-container {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
            padding: 0 30px;
          }

          /* hero */
          .terms-hero {
            position: relative;
            width: 100%;
            padding: 48px 0 42px;
            overflow: hidden;
            background: linear-gradient(120deg, #fff7f0 0%, #ffffff 48%, #f2f8fd 100%);
            border-bottom: 1px solid #eee4dc;
          }
          .terms-hero::before {
            content: "";
            position: absolute;
            width: 350px;
            height: 350px;
            top: -230px;
            left: -60px;
            border: 45px solid rgba(249, 115, 22, 0.07);
            border-radius: 50%;
          }
          .terms-hero::after {
            content: "";
            position: absolute;
            width: 380px;
            height: 380px;
            top: -235px;
            right: -80px;
            border: 45px solid rgba(11, 51, 103, 0.055);
            border-radius: 50%;
          }
          .terms-hero-content {
            position: relative;
            z-index: 2;
            max-width: 1000px;
            margin: 0 auto;
            text-align: center;
          }
          .terms-eyebrow {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 11px;
            color: #f15a16;
            font-size: calc(12px * var(--font-scale, 1));
            font-weight: 850;
            letter-spacing: 1px;
          }
          .terms-eyebrow svg { font-size: 17px; }
          .terms-hero h1 {
            margin: 0 auto 15px;
            max-width: 1000px;
            font-size: calc(43px * var(--font-scale, 1));
            font-weight: 900;
            line-height: 1.18;
          }
          .terms-title-blue { color: #072d63; }
          .terms-title-orange { color: #f15a16; }
          .terms-platform-name {
            margin: 0 0 5px;
            color: #315b87;
            font-size: calc(16px * var(--font-scale, 1));
            font-weight: 700;
          }
          .terms-department {
            margin: 0 0 3px;
            color: #64748b;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 650;
          }
          .terms-government {
            margin: 0 0 18px;
            color: #64748b;
            font-size: calc(12px * var(--font-scale, 1));
            font-weight: 500;
          }
          .terms-effective-date {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            padding: 8px 15px;
            border: 1px solid #ffd6bf;
            border-radius: 25px;
            background: #fff3ea;
            color: #755143;
            font-size: calc(11px * var(--font-scale, 1));
          }
          .terms-effective-date strong { color: #e8550d; }

          /* intro */
          .terms-intro-section { padding: 24px 0 0; }
          .terms-intro-card {
            position: relative;
            min-height: 105px;
            padding: 22px 26px 22px 45px;
            display: flex;
            align-items: center;
            gap: 18px;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #eee2d9;
            border-radius: 14px;
            box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045);
          }
          .terms-intro-accent {
            position: absolute;
            top: 17px;
            bottom: 17px;
            left: 20px;
            width: 5px;
            background: #f15a16;
            border-radius: 8px;
          }
          .terms-intro-icon {
            width: 55px;
            height: 55px;
            flex: 0 0 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fff0e6;
            color: #f15a16;
            font-size: 24px;
          }
          .terms-intro-text h2 {
            margin: 0 0 5px;
            color: #0b3367;
            font-size: calc(17px * var(--font-scale, 1));
            font-weight: 850;
          }
          .terms-intro-text p {
            margin: 0;
            color: #597087;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 500;
            line-height: 1.65;
          }

          /* layout */
          .terms-content-section { padding: 25px 0 65px; }
          .terms-layout {
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            gap: 24px;
            align-items: start;
          }

          /* sidebar */
          .terms-sidebar { position: sticky; top: 20px; }
          .terms-sidebar-card {
            padding: 17px;
            background: #ffffff;
            border: 1px solid #e8e3df;
            border-radius: 12px;
            box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045);
          }
          .terms-sidebar-heading {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 14px;
            padding-bottom: 12px;
            border-bottom: 1px solid #eef0f3;
            color: #0b3367;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 850;
          }
          .terms-sidebar-heading svg { color: #f15a16; }
          .terms-page-nav { display: flex; flex-direction: column; gap: 4px; }
          .terms-page-nav a {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 7px 8px;
            border-radius: 6px;
            color: #4e6580;
            text-decoration: none;
            font-size: calc(10px * var(--font-scale, 1));
            font-weight: 650;
            line-height: 1.4;
            transition: background 0.2s ease, color 0.2s ease;
          }
          .terms-page-nav a span { color: #f15a16; font-weight: 850; }
          .terms-page-nav a:hover { color: #0b3367; background: #fff3ea; }

          /* content cards */
          .terms-content {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }
          .terms-section-card {
            scroll-margin-top: 20px;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #e9e3df;
            border-radius: 13px;
            box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045);
          }
          .terms-section-header {
            padding: 20px 23px;
            display: flex;
            align-items: center;
            gap: 14px;
            background: linear-gradient(90deg, #fff7f1, #ffffff);
            border-bottom: 1px solid #eee8e3;
          }
          .terms-section-number {
            width: 43px;
            height: 43px;
            flex: 0 0 43px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            background: #f15a16;
            color: #ffffff;
            font-size: calc(12px * var(--font-scale, 1));
            font-weight: 900;
          }
          .terms-section-label {
            display: block;
            margin-bottom: 3px;
            color: #f15a16;
            font-size: calc(9px * var(--font-scale, 1));
            font-weight: 850;
            letter-spacing: 0.65px;
          }
          .terms-section-header h2 {
            margin: 0;
            color: #0b3367;
            font-size: calc(21px * var(--font-scale, 1));
            font-weight: 850;
            line-height: 1.3;
          }
          .terms-section-body { padding: 22px 24px 25px; }
          .terms-section-body > p {
            margin: 0 0 16px;
            color: #4f657d;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 500;
            line-height: 1.75;
          }
          .terms-section-body strong { color: #183f6c; font-weight: 800; }

          /* numbered items */
          .terms-numbered-list { display: flex; flex-direction: column; gap: 11px; }
          .terms-numbered-item {
            padding: 14px 15px;
            display: flex;
            align-items: flex-start;
            gap: 13px;
            background: #fafcfe;
            border: 1px solid #e7ebef;
            border-radius: 8px;
          }
          .terms-list-number {
            width: 30px;
            height: 30px;
            flex: 0 0 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: #fff0e7;
            color: #f15a16;
            font-size: calc(10px * var(--font-scale, 1));
            font-weight: 850;
          }
          .terms-numbered-item h3 {
            margin: 1px 0 4px;
            color: #173f6c;
            font-size: calc(12.5px * var(--font-scale, 1));
            font-weight: 800;
          }
          .terms-numbered-item p {
            margin: 0;
            color: #607489;
            font-size: calc(11.5px * var(--font-scale, 1));
            line-height: 1.65;
          }

          /* feature list */
          .terms-feature-list { display: flex; flex-direction: column; gap: 11px; }
          .terms-feature-item {
            padding: 15px;
            display: flex;
            align-items: flex-start;
            gap: 13px;
            background: #f9fbfd;
            border: 1px solid #e5ebf0;
            border-radius: 9px;
          }
          .terms-feature-icon {
            width: 39px;
            height: 39px;
            flex: 0 0 39px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #fff0e7;
            color: #f15a16;
            border-radius: 8px;
            font-size: 18px;
          }
          .terms-feature-item h3 {
            margin: 0 0 5px;
            color: #173f6c;
            font-size: calc(12.5px * var(--font-scale, 1));
            font-weight: 800;
          }
          .terms-feature-item p {
            margin: 0;
            color: #63758a;
            font-size: calc(11.5px * var(--font-scale, 1));
            line-height: 1.65;
          }

          /* warning list */
          .terms-warning-list {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            list-style: none;
          }
          .terms-warning-list li {
            padding: 12px 14px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: #fffaf7;
            border: 1px solid #f3e1d7;
            border-radius: 8px;
            color: #566d83;
            font-size: calc(11.8px * var(--font-scale, 1));
            line-height: 1.65;
          }
          .terms-warning-list svg {
            margin-top: 3px;
            flex-shrink: 0;
            color: #f15a16;
            font-size: 16px;
          }
          .terms-warning-box {
            margin-top: 15px;
            padding: 14px 16px;
            display: flex;
            align-items: flex-start;
            gap: 11px;
            background: #fff2e9;
            border-left: 4px solid #f15a16;
            border-radius: 0 8px 8px 0;
          }
          .terms-warning-box svg {
            margin-top: 3px;
            flex-shrink: 0;
            color: #e7550e;
            font-size: 18px;
          }
          .terms-warning-box p {
            margin: 0;
            color: #765340;
            font-size: calc(11.5px * var(--font-scale, 1));
            font-weight: 600;
            line-height: 1.65;
          }

          /* simple info */
          .terms-simple-info, .terms-jurisdiction-box {
            padding: 16px;
            display: flex;
            align-items: flex-start;
            gap: 12px;
            background: #f5f9fc;
            border: 1px solid #dfe9f1;
            border-radius: 9px;
          }
          .terms-simple-info svg, .terms-jurisdiction-box svg {
            margin-top: 3px;
            flex-shrink: 0;
            color: #f15a16;
            font-size: 20px;
          }
          .terms-simple-info p, .terms-jurisdiction-box p {
            margin: 0;
            color: #566e85;
            font-size: calc(12px * var(--font-scale, 1));
            line-height: 1.7;
          }

          /* support */
          .terms-support-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .terms-contact-card {
            min-width: 0;
            padding: 14px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: #fafcfe;
            border: 1px solid #e6ebef;
            border-radius: 8px;
          }
          .terms-contact-card > svg {
            margin-top: 2px;
            flex-shrink: 0;
            color: #f15a16;
            font-size: 17px;
          }
          .terms-contact-card > div {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }
          .terms-contact-card strong {
            color: #143d6b;
            font-size: calc(11px * var(--font-scale, 1));
          }
          .terms-contact-card span {
            color: #63768a;
            font-size: calc(10.5px * var(--font-scale, 1));
            line-height: 1.5;
          }
          .terms-contact-card a {
            color: #e95d16;
            text-decoration: none;
            overflow-wrap: anywhere;
            font-size: calc(10.5px * var(--font-scale, 1));
            font-weight: 700;
          }
          .terms-contact-card a:hover { text-decoration: underline; }

          /* 1400px+ */
          @media (min-width: 1400px) {
            .terms-container { max-width: 1600px; padding: 0 50px; }
            .terms-hero h1 { font-size: calc(47px * var(--font-scale, 1)); }
            .terms-layout {
              grid-template-columns: 280px minmax(0, 1fr);
              gap: 28px;
            }
          }

          /* 1200px */
          @media (max-width: 1200px) {
            .terms-container { padding: 0 24px; }
            .terms-hero h1 { font-size: calc(39px * var(--font-scale, 1)); }
            .terms-layout {
              grid-template-columns: 230px minmax(0, 1fr);
              gap: 19px;
            }
          }

          /* 1024px */
          @media (max-width: 1024px) {
            .terms-container { padding: 0 20px; }
            .terms-layout { grid-template-columns: 1fr; }
            .terms-sidebar { position: static; }
            .terms-page-nav {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          /* 900px */
          @media (max-width: 900px) {
            .terms-hero { padding: 38px 0 34px; }
            .terms-hero h1 { font-size: calc(34px * var(--font-scale, 1)); }
            .terms-support-grid { grid-template-columns: 1fr; }
          }

          /* 600px */
          @media (max-width: 600px) {
            .terms-container { padding: 0 14px; }
            .terms-hero { padding: 30px 0 27px; }
            .terms-hero h1 { font-size: calc(27px * var(--font-scale, 1)); }
            .terms-platform-name {
              font-size: calc(13px * var(--font-scale, 1));
              line-height: 1.5;
            }
            .terms-department, .terms-government {
              font-size: calc(10.5px * var(--font-scale, 1));
              line-height: 1.5;
            }
            .terms-effective-date { flex-wrap: wrap; justify-content: center; }
            .terms-intro-card {
              padding: 16px 14px 16px 32px;
              align-items: flex-start;
              gap: 11px;
            }
            .terms-intro-accent {
              left: 12px;
              top: 14px;
              bottom: 14px;
              width: 4px;
            }
            .terms-intro-icon {
              width: 42px;
              height: 42px;
              flex-basis: 42px;
              font-size: 19px;
            }
            .terms-intro-text h2 { font-size: calc(14px * var(--font-scale, 1)); }
            .terms-intro-text p { font-size: calc(11px * var(--font-scale, 1)); }
            .terms-content-section { padding: 18px 0 42px; }
            .terms-page-nav { grid-template-columns: 1fr; }
            .terms-section-header {
              padding: 16px 14px;
              align-items: flex-start;
            }
            .terms-section-number {
              width: 37px;
              height: 37px;
              flex-basis: 37px;
            }
            .terms-section-header h2 { font-size: calc(17px * var(--font-scale, 1)); }
            .terms-section-body { padding: 17px 15px 20px; }
            .terms-section-body > p { font-size: calc(11.5px * var(--font-scale, 1)); }
            .terms-numbered-item, .terms-feature-item, .terms-warning-list li { padding: 12px; }
          }

          /* 400px */
          @media (max-width: 400px) {
            .terms-container { padding: 0 10px; }
            .terms-hero { padding: 25px 0 22px; }
            .terms-hero h1 { font-size: calc(23px * var(--font-scale, 1)); }
            .terms-eyebrow { font-size: calc(9.5px * var(--font-scale, 1)); }
            .terms-intro-card { padding: 14px 11px 14px 27px; }
            .terms-intro-icon {
              width: 36px;
              height: 36px;
              flex-basis: 36px;
              font-size: 16px;
            }
            .terms-section-header { gap: 9px; }
            .terms-section-header h2 { font-size: calc(15px * var(--font-scale, 1)); }
            .terms-section-number {
              width: 33px;
              height: 33px;
              flex-basis: 33px;
            }
            .terms-numbered-item, .terms-feature-item { gap: 9px; }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
