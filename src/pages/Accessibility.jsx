// src/pages/Accessibility.jsx
import React, { useEffect } from "react";
import {
  FiEye,
  FiMonitor,
  FiType,
  FiVolume2,
  FiCommand,
  FiFileText,
  FiCheckCircle,
  FiAlertTriangle,
  FiMail,
  FiPhone,
  FiMapPin,
  FiMessageSquare,
  FiShield,
  FiUserCheck,
} from "react-icons/fi";
import GovHeader from "./GovHeader.jsx";
import TopNavigation from "./HeaderTopNav.jsx";
import HeaderTopMenu from "./HeaderTopMenu.jsx";
import HeaderTopHeadline from "./HeaderTopHeadline.jsx";
import Footer from "../components/layout/Footer.jsx";
import up_logo from "../assets/upgov_logo.jpg";

// "On This Page" sidebar links
const NAV_LINKS = [
  { id: "commitment", number: "01", label: "Commitment to Accessibility" },
  { id: "standards", number: "02", label: "Technical Standards" },
  { id: "accommodation", number: "03", label: "Alternative Formats" },
  { id: "disclaimer", number: "04", label: "Liability & Third-Party Content" },
  { id: "feedback", number: "05", label: "Feedback & WIM" },
];

// section 2 — technical standards & accessibility features
const FEATURES = [
  {
    icon: <FiVolume2 />,
    title: "Screen Reader Compatibility",
    body: (
      <p>
        Web pages, form fields, navigation headers, and status messages are
        structured with semantic HTML markup, ARIA roles, and unique IDs so that
        screen reading software such as NVDA, JAWS, or TalkBack can interpret
        and read content sequentially.
      </p>
    ),
  },
  {
    icon: <FiEye />,
    title: "Text Alternatives for Non-Text Content",
    body: (
      <p>
        All meaningful images, icons, infographics, and graphical controls
        include descriptive alt text. Purely decorative graphics are implemented
        to be bypassed by screen readers.
      </p>
    ),
  },
  {
    icon: <FiCommand />,
    title: "Keyboard Operability & Visible Focus",
    body: (
      <p>
        All platform functions, menus, and form inputs are fully operable via a
        keyboard interface without requiring specific keystroke timings or mouse
        interactions. Focus indicators remain visually distinct across
        interactive components.
      </p>
    ),
  },
  {
    icon: <FiMonitor />,
    title: "Visual Display & Contrast Optimization",
    body: (
      <ul className="accessibility-sub-list">
        <li>
          Text and images of text maintain a minimum color contrast ratio of{" "}
          <strong>4.5:1</strong> against background colors and{" "}
          <strong>3:1</strong> for large text.
        </li>
        <li>
          The platform provides a dedicated <strong>High Contrast Mode</strong>{" "}
          toggle for low-vision users.
        </li>
        <li>Information is never conveyed solely through color cues.</li>
      </ul>
    ),
  },
  {
    icon: <FiType />,
    title: "Flexible Text Resizing & Responsive Reflow",
    body: (
      <p>
        Users can scale visual text up to <strong>200 percent</strong> using
        standard browser controls without loss of content, layout integrity, or
        horizontal scrolling overlap.
      </p>
    ),
  },
  {
    icon: <FiFileText />,
    title: "Bilingual Support & Language Attributes",
    body: (
      <p>
        Platform interfaces are bilingual (Hindi and English), utilizing
        standard Unicode character sets and programmatically declared language
        tags <strong>(lang="hi" / lang="en")</strong> to enable accurate speech
        synthesis.
      </p>
    ),
  },
  {
    icon: <FiShield />,
    title: "Accessible CAPTCHA & Media Controls",
    body: (
      <p>
        Where verification controls are required, accessible audio or perceptual
        alternatives to visual CAPTCHA are provided. Auto-playing audio/video
        content is restricted or equipped with manual pause/mute controls.
      </p>
    ),
  },
];

// section 4 — limitation of liability items
const LIABILITY_ITEMS = [
  {
    title: "Legacy & Scanned Content",
    text: "While UPSRLM strives to digitize all legacy records into accessible HTML formats, UPSRLM disclaims immediate liability for accessibility gaps in historical scanned documents generated prior to the deployment of GIGW 3.0 standards, provided alternative assistance is rendered upon request.",
  },
  {
    title: "Third-Party Platforms & Plug-ins",
    text: "Pragati Setu may contain links to external non-government portals, third-party payment gateways, or external analytics plug-ins. UPSRLM is not responsible for the accessibility compliance or technical barriers present on external, third-party domains.",
  },
  {
    title: "Progressive Remediation Defense",
    text: "The publication of this policy and the operation of the Accessibility Feedback Mechanism demonstrate active compliance efforts under the Rights of Persons with Disabilities Act, 2016. Technical glitches or temporary accessibility non-conformities identified during ongoing platform updates shall be subject to prompt remediation rather than legal cause of action.",
  },
];

// section 5 — contact cards (line type: text | mail | tel)
const CONTACTS = [
  {
    icon: <FiMessageSquare />,
    title: "Designated Web Information Manager (WIM)",
    lines: [
      {
        type: "text",
        value: "PMU-IT, Uttar Pradesh State Rural Livelihoods Mission (UPSRLM)",
      },
    ],
  },
  {
    icon: <FiUserCheck />,
    title: "Accessibility Nodal Officer",
    lines: [
      { type: "text", value: "Mr. Sachin Mishra" },
      { type: "text", value: "Head Project Manager, PMU-IT" },
    ],
  },
  {
    icon: <FiMail />,
    title: "Email",
    lines: [
      { type: "mail", value: "SachinAKumar@bdo.in" },
      { type: "mail", value: "bdopmuit@gmail.com" },
    ],
  },
  {
    icon: <FiMail />,
    title: "Technical Support Lead",
    lines: [
      { type: "text", value: "Ms. Shilpi Raizada" },
      { type: "mail", value: "ShilpiRaizada@bdo.in" },
    ],
  },
  {
    icon: <FiMapPin />,
    title: "Postal Address",
    lines: [
      {
        type: "text",
        value:
          "UPSRLM Head Office, Department of Rural Development, Lucknow, Uttar Pradesh.",
      },
    ],
  },
  {
    icon: <FiPhone />,
    title: "Helpline",
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
    <article className="accessibility-section-card" id={id}>
      <div className="accessibility-section-header">
        <div className="accessibility-section-number">{number}</div>
        <div>
          <span className="accessibility-section-label">{label}</span>
          <h2>{title}</h2>
        </div>
      </div>
      <div className="accessibility-section-body">{children}</div>
    </article>
  );
}

export default function Accessibility() {
  const setFontScale = (scale) => {
    document.documentElement.style.setProperty("--font-scale", scale);
  };

  useEffect(() => {
    setFontScale(1);
  }, []);

  return (
    <div className="accessibility-page-shell">
      <GovHeader
        logo={up_logo}
        title="Government Of Uttar Pradesh"
        onFontChange={setFontScale}
      />
      <TopNavigation />
      <HeaderTopMenu />
      <HeaderTopHeadline />

      <main className="accessibility-page">
        <section className="accessibility-hero">
          <div className="accessibility-container">
            <div className="accessibility-hero-content">
              <div className="accessibility-eyebrow">
                <FiUserCheck />
                <span>ACCESSIBILITY & INCLUSIVE DIGITAL GOVERNANCE</span>
              </div>

              <h1>
                <span className="accessibility-title-blue">Pragati Setu</span>{" "}
                <span className="accessibility-title-orange">
                  Accessibility Statement
                </span>{" "}
                <span className="accessibility-title-blue">& Policy</span>
              </h1>

              <p className="accessibility-platform-name">
                Pragati Setu: Digital Livelihoods Platform for Uttar Pradesh
              </p>
              <p className="accessibility-department">
                Uttar Pradesh State Rural Livelihoods Mission (UPSRLM)
              </p>
              <p className="accessibility-government">
                Department of Rural Development, Government of Uttar Pradesh
              </p>

              <div className="accessibility-effective-date">
                <span>Effective Date</span>
                <strong>May 7, 2026</strong>
              </div>
            </div>
          </div>
        </section>

        <section className="accessibility-intro-section">
          <div className="accessibility-container">
            <div className="accessibility-intro-card">
              <div className="accessibility-intro-accent"></div>
              <div className="accessibility-intro-icon">
                <FiUserCheck />
              </div>
              <div className="accessibility-intro-text">
                <h2>Our Commitment to Universal Accessibility</h2>
                <p>
                  Pragati Setu is designed to provide inclusive, accessible, and
                  user-friendly digital services for all citizens, including
                  persons with disabilities.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="accessibility-content-section">
          <div className="accessibility-container">
            <div className="accessibility-layout">
              <aside className="accessibility-sidebar">
                <div className="accessibility-sidebar-card">
                  <div className="accessibility-sidebar-heading">
                    <FiFileText />
                    <span>On This Page</span>
                  </div>

                  <nav className="accessibility-page-nav">
                    {NAV_LINKS.map(({ id, number, label }) => (
                      <a href={`#${id}`} key={id}>
                        <span>{number}</span>
                        {label}
                      </a>
                    ))}
                  </nav>
                </div>
              </aside>

              <div className="accessibility-content">
                <SectionCard
                  id="commitment"
                  number="01"
                  label="UNIVERSAL ACCESS"
                  title="Commitment to Universal Accessibility"
                >
                  <p>
                    The{" "}
                    <strong>
                      Uttar Pradesh State Rural Livelihoods Mission (UPSRLM)
                    </strong>{" "}
                    is committed to ensuring that the{" "}
                    <strong>Pragati Setu</strong> digital ecosystem—comprising
                    web portals, field management modules (TMS, EPSMS, Lakhpati
                    Didi), and mobile applications (including Udhyam Sakhi)—is
                    fully accessible to all citizens, including persons with
                    visual, auditory, physical, speech, cognitive, or
                    neurological disabilities.
                  </p>
                  <p>
                    This platform is designed and maintained in accordance with
                    the{" "}
                    <strong>
                      Guidelines for Indian Government Websites and Apps (GIGW
                      3.0)
                    </strong>{" "}
                    and conforms to{" "}
                    <strong>
                      Level AA of the Web Content Accessibility Guidelines (WCAG
                      2.1)
                    </strong>{" "}
                    established by the World Wide Web Consortium (W3C).
                  </p>
                  <div className="accessibility-highlight-box">
                    <FiCheckCircle />
                    <p>
                      The platform embodies the core governance trilogy of being{" "}
                      <strong>
                        Usable, User-Centric, and Universally Accessible (UUU)
                      </strong>
                      .
                    </p>
                  </div>
                </SectionCard>

                <SectionCard
                  id="standards"
                  number="02"
                  label="ACCESSIBILITY FEATURES"
                  title="Technical Standards & Accessibility Features"
                >
                  <p>
                    Pragati Setu incorporates specific technical design
                    standards to ensure seamless interaction with assistive
                    technologies:
                  </p>

                  <div className="accessibility-feature-list">
                    {FEATURES.map((feature, index) => (
                      <div
                        className="accessibility-feature-card"
                        key={feature.title}
                      >
                        <div className="accessibility-feature-icon">
                          {feature.icon}
                        </div>
                        <div>
                          <div className="accessibility-feature-title-row">
                            <span className="accessibility-feature-number">
                              {index + 1}
                            </span>
                            <h3>{feature.title}</h3>
                          </div>
                          {feature.body}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  id="accommodation"
                  number="03"
                  label="REASONABLE ACCOMMODATION"
                  title="Reasonable Accommodation & Alternative Format Requests"
                >
                  <p>
                    UPSRLM recognizes that certain historical records, complex
                    spatial reports, or legacy scanned PDF documents may not
                    fully satisfy automated screen-reading standards.
                  </p>
                  <p>
                    In compliance with the principles of{" "}
                    <strong>Reasonable Accommodation</strong>:
                  </p>
                  <ul className="accessibility-check-list">
                    <li>
                      <FiCheckCircle />
                      <span>
                        Any user facing difficulty accessing specific platform
                        content, data tables, or PDF guidelines may submit a
                        formal request for an{" "}
                        <strong>Accessible Alternative Format</strong> such as
                        plain text, large print, audio format, or direct
                        assistance.
                      </span>
                    </li>
                    <li>
                      <FiCheckCircle />
                      <span>
                        Alternative format requests are processed free of charge
                        within <strong>7 working days</strong> by contacting the
                        designated Web Information Manager (WIM).
                      </span>
                    </li>
                  </ul>
                </SectionCard>

                <SectionCard
                  id="disclaimer"
                  number="04"
                  label="DISCLAIMER"
                  title="Limitation of Liability & Third-Party Content Disclaimer"
                >
                  <div className="accessibility-numbered-list">
                    {LIABILITY_ITEMS.map((item, index) => (
                      <div
                        className="accessibility-numbered-item"
                        key={item.title}
                      >
                        <div className="accessibility-list-number">
                          {index + 1}
                        </div>
                        <div>
                          <h3>{item.title}</h3>
                          <p>{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>

                <SectionCard
                  id="feedback"
                  number="05"
                  label="ACCESSIBILITY SUPPORT"
                  title="Feedback Mechanism & Web Information Manager (WIM)"
                >
                  <p>
                    We welcome feedback from users regarding the accessibility
                    of Pragati Setu. If you encounter accessibility barriers or
                    wish to report a compliance issue, please contact our
                    designated <strong>Web Information Manager (WIM)</strong>:
                  </p>

                  <div className="accessibility-contact-grid">
                    {CONTACTS.map((contact) => (
                      <div
                        className="accessibility-contact-card"
                        key={contact.title}
                      >
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

                  <div className="accessibility-feedback-note">
                    <FiAlertTriangle />
                    <p>
                      When reporting an accessibility issue, users are
                      encouraged to identify the affected page, feature,
                      document, or function so that the issue can be reviewed
                      and remediated efficiently.
                    </p>
                  </div>
                </SectionCard>
              </div>
            </div>
          </div>
        </section>

        <style>{`
          .accessibility-page-shell, .accessibility-page-shell * {
            box-sizing: border-box;
          }
          .accessibility-page {
            width: 100%;
            min-height: 100vh;
            background: #fffaf6;
            color: #183a61;
          }
          .accessibility-container {
            width: 100%;
            max-width: 1500px;
            margin: 0 auto;
            padding: 0 30px;
          }

          /* hero */
          .accessibility-hero {
            position: relative;
            width: 100%;
            padding: 48px 0 42px;
            overflow: hidden;
            background: linear-gradient(120deg, #fff7f0 0%, #ffffff 48%, #f2f8fd 100%);
            border-bottom: 1px solid #eee4dc;
          }
          .accessibility-hero::before {
            content: "";
            position: absolute;
            width: 350px;
            height: 350px;
            top: -230px;
            left: -60px;
            border: 45px solid rgba(249, 115, 22, 0.07);
            border-radius: 50%;
          }
          .accessibility-hero::after {
            content: "";
            position: absolute;
            width: 380px;
            height: 380px;
            top: -235px;
            right: -80px;
            border: 45px solid rgba(11, 51, 103, 0.055);
            border-radius: 50%;
          }
          .accessibility-hero-content {
            position: relative;
            z-index: 2;
            max-width: 1100px;
            margin: 0 auto;
            text-align: center;
          }
          .accessibility-eyebrow {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-bottom: 11px;
            color: #f15a16;
            font-size: calc(12px * var(--font-scale, 1));
            font-weight: 850;
            letter-spacing: 1px;
          }
          .accessibility-eyebrow svg { font-size: 18px; }
          .accessibility-hero h1 {
            max-width: 1100px;
            margin: 0 auto 15px;
            font-size: calc(43px * var(--font-scale, 1));
            font-weight: 900;
            line-height: 1.18;
          }
          .accessibility-title-blue { color: #072d63; }
          .accessibility-title-orange { color: #f15a16; }
          .accessibility-platform-name {
            margin: 0 0 5px;
            color: #315b87;
            font-size: calc(16px * var(--font-scale, 1));
            font-weight: 700;
          }
          .accessibility-department {
            margin: 0 0 3px;
            color: #64748b;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 650;
          }
          .accessibility-government {
            margin: 0 0 18px;
            color: #64748b;
            font-size: calc(12px * var(--font-scale, 1));
            font-weight: 500;
          }
          .accessibility-effective-date {
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
          .accessibility-effective-date strong { color: #e8550d; }

          /* intro card */
          .accessibility-intro-section { padding: 24px 0 0; }
          .accessibility-intro-card {
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
          .accessibility-intro-accent {
            position: absolute;
            top: 17px;
            bottom: 17px;
            left: 20px;
            width: 5px;
            border-radius: 8px;
            background: #f15a16;
          }
          .accessibility-intro-icon {
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
          .accessibility-intro-text { min-width: 0; }
          .accessibility-intro-text h2 {
            margin: 0 0 5px;
            color: #0b3367;
            font-size: calc(17px * var(--font-scale, 1));
            font-weight: 850;
          }
          .accessibility-intro-text p {
            margin: 0;
            color: #597087;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 500;
            line-height: 1.65;
          }

          /* main layout */
          .accessibility-content-section { padding: 25px 0 65px; }
          .accessibility-layout {
            display: grid;
            grid-template-columns: 260px minmax(0, 1fr);
            gap: 24px;
            align-items: start;
          }

          /* sidebar */
          .accessibility-sidebar { position: sticky; top: 20px; }
          .accessibility-sidebar-card {
            padding: 17px;
            background: #ffffff;
            border: 1px solid #e8e3df;
            border-radius: 12px;
            box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045);
          }
          .accessibility-sidebar-heading {
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
          .accessibility-sidebar-heading svg { color: #f15a16; }
          .accessibility-page-nav { display: flex; flex-direction: column; gap: 5px; }
          .accessibility-page-nav a {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            padding: 8px 8px;
            border-radius: 6px;
            color: #4e6580;
            text-decoration: none;
            font-size: calc(10.5px * var(--font-scale, 1));
            font-weight: 650;
            line-height: 1.45;
            transition: color 0.2s ease, background 0.2s ease;
          }
          .accessibility-page-nav a span { flex-shrink: 0; color: #f15a16; font-weight: 850; }
          .accessibility-page-nav a:hover { color: #0b3367; background: #fff3ea; }

          /* content */
          .accessibility-content {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 18px;
          }

          /* section card */
          .accessibility-section-card {
            scroll-margin-top: 20px;
            overflow: hidden;
            background: #ffffff;
            border: 1px solid #e9e3df;
            border-radius: 13px;
            box-shadow: 0 5px 18px rgba(15, 39, 72, 0.045);
          }
          .accessibility-section-header {
            padding: 20px 23px;
            display: flex;
            align-items: center;
            gap: 14px;
            background: linear-gradient(90deg, #fff7f1, #ffffff);
            border-bottom: 1px solid #eee8e3;
          }
          .accessibility-section-number {
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
          .accessibility-section-label {
            display: block;
            margin-bottom: 3px;
            color: #f15a16;
            font-size: calc(9px * var(--font-scale, 1));
            font-weight: 850;
            letter-spacing: 0.65px;
          }
          .accessibility-section-header h2 {
            margin: 0;
            color: #0b3367;
            font-size: calc(21px * var(--font-scale, 1));
            font-weight: 850;
            line-height: 1.3;
          }
          .accessibility-section-body { padding: 22px 24px 25px; }
          .accessibility-section-body > p {
            margin: 0 0 16px;
            color: #4f657d;
            font-size: calc(13px * var(--font-scale, 1));
            font-weight: 500;
            line-height: 1.75;
          }
          .accessibility-section-body strong { color: #183f6c; font-weight: 800; }

          /* highlight */
          .accessibility-highlight-box {
            margin-top: 16px;
            padding: 14px 16px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: #eef6fc;
            border-left: 4px solid #0b4d91;
            border-radius: 0 8px 8px 0;
          }
          .accessibility-highlight-box svg {
            margin-top: 3px;
            flex-shrink: 0;
            color: #f15a16;
            font-size: 17px;
          }
          .accessibility-highlight-box p {
            margin: 0;
            color: #49657f;
            font-size: calc(12px * var(--font-scale, 1));
            line-height: 1.65;
          }

          /* feature cards */
          .accessibility-feature-list { display: flex; flex-direction: column; gap: 11px; }
          .accessibility-feature-card {
            padding: 15px;
            display: flex;
            align-items: flex-start;
            gap: 13px;
            background: #f9fbfd;
            border: 1px solid #e5ebf0;
            border-radius: 9px;
          }
          .accessibility-feature-icon {
            width: 41px;
            height: 41px;
            flex: 0 0 41px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            background: #fff0e7;
            color: #f15a16;
            font-size: 18px;
          }
          .accessibility-feature-card > div:last-child { min-width: 0; flex: 1; }
          .accessibility-feature-title-row {
            display: flex;
            align-items: center;
            gap: 7px;
            margin-bottom: 5px;
          }
          .accessibility-feature-number {
            min-width: 20px;
            height: 20px;
            padding: 0 5px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 12px;
            background: #f15a16;
            color: #ffffff;
            font-size: calc(8px * var(--font-scale, 1));
            font-weight: 850;
          }
          .accessibility-feature-card h3 {
            margin: 0;
            color: #173f6c;
            font-size: calc(12.5px * var(--font-scale, 1));
            font-weight: 800;
          }
          .accessibility-feature-card p {
            margin: 0;
            color: #63758a;
            font-size: calc(11.5px * var(--font-scale, 1));
            line-height: 1.65;
          }

          /* sub list */
          .accessibility-sub-list { margin: 3px 0 0; padding-left: 18px; color: #63758a; }
          .accessibility-sub-list li {
            margin-bottom: 6px;
            font-size: calc(11.5px * var(--font-scale, 1));
            line-height: 1.65;
          }
          .accessibility-sub-list li:last-child { margin-bottom: 0; }
          .accessibility-sub-list li::marker { color: #f15a16; }

          /* check list */
          .accessibility-check-list {
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            gap: 10px;
            list-style: none;
          }
          .accessibility-check-list li {
            padding: 13px 14px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: #fafcfe;
            border: 1px solid #e6ebef;
            border-radius: 8px;
            color: #586f85;
            font-size: calc(11.8px * var(--font-scale, 1));
            line-height: 1.65;
          }
          .accessibility-check-list svg {
            margin-top: 3px;
            flex-shrink: 0;
            color: #f15a16;
            font-size: 16px;
          }

          /* numbered list */
          .accessibility-numbered-list { display: flex; flex-direction: column; gap: 11px; }
          .accessibility-numbered-item {
            padding: 14px 15px;
            display: flex;
            align-items: flex-start;
            gap: 13px;
            background: #fafcfe;
            border: 1px solid #e7ebef;
            border-radius: 8px;
          }
          .accessibility-list-number {
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
          .accessibility-numbered-item h3 {
            margin: 1px 0 4px;
            color: #173f6c;
            font-size: calc(12.5px * var(--font-scale, 1));
            font-weight: 800;
          }
          .accessibility-numbered-item p {
            margin: 0;
            color: #607489;
            font-size: calc(11.5px * var(--font-scale, 1));
            line-height: 1.65;
          }

          /* contact */
          .accessibility-contact-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }
          .accessibility-contact-card {
            min-width: 0;
            padding: 14px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: #fafcfe;
            border: 1px solid #e6ebef;
            border-radius: 8px;
          }
          .accessibility-contact-card > svg {
            margin-top: 2px;
            flex-shrink: 0;
            color: #f15a16;
            font-size: 17px;
          }
          .accessibility-contact-card > div {
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 3px;
          }
          .accessibility-contact-card strong {
            color: #143d6b;
            font-size: calc(11px * var(--font-scale, 1));
            line-height: 1.4;
          }
          .accessibility-contact-card span {
            color: #63768a;
            font-size: calc(10.5px * var(--font-scale, 1));
            line-height: 1.5;
          }
          .accessibility-contact-card a {
            color: #e95d16;
            text-decoration: none;
            overflow-wrap: anywhere;
            font-size: calc(10.5px * var(--font-scale, 1));
            font-weight: 700;
          }
          .accessibility-contact-card a:hover { text-decoration: underline; }

          /* feedback note */
          .accessibility-feedback-note {
            margin-top: 15px;
            padding: 14px 16px;
            display: flex;
            align-items: flex-start;
            gap: 10px;
            background: #fff3ea;
            border-left: 4px solid #f15a16;
            border-radius: 0 8px 8px 0;
          }
          .accessibility-feedback-note svg {
            margin-top: 3px;
            flex-shrink: 0;
            color: #e7550e;
            font-size: 17px;
          }
          .accessibility-feedback-note p {
            margin: 0;
            color: #765340;
            font-size: calc(11.5px * var(--font-scale, 1));
            line-height: 1.65;
          }

          /* 1400px+ */
          @media (min-width: 1400px) {
            .accessibility-container { max-width: 1600px; padding: 0 50px; }
            .accessibility-hero h1 { font-size: calc(47px * var(--font-scale, 1)); }
            .accessibility-layout {
              grid-template-columns: 280px minmax(0, 1fr);
              gap: 28px;
            }
          }

          /* 1200px */
          @media (max-width: 1200px) {
            .accessibility-container { padding: 0 24px; }
            .accessibility-hero h1 { font-size: calc(39px * var(--font-scale, 1)); }
            .accessibility-layout {
              grid-template-columns: 230px minmax(0, 1fr);
              gap: 19px;
            }
          }

          /* 1024px */
          @media (max-width: 1024px) {
            .accessibility-container { padding: 0 20px; }
            .accessibility-layout { grid-template-columns: 1fr; }
            .accessibility-sidebar { position: static; }
            .accessibility-page-nav {
              display: grid;
              grid-template-columns: repeat(2, minmax(0, 1fr));
            }
          }

          /* 900px */
          @media (max-width: 900px) {
            .accessibility-hero { padding: 38px 0 34px; }
            .accessibility-hero h1 { font-size: calc(34px * var(--font-scale, 1)); }
            .accessibility-contact-grid { grid-template-columns: 1fr; }
          }

          /* 600px */
          @media (max-width: 600px) {
            .accessibility-container { padding: 0 14px; }
            .accessibility-hero { padding: 30px 0 27px; }
            .accessibility-hero h1 {
              font-size: calc(27px * var(--font-scale, 1));
              line-height: 1.25;
            }
            .accessibility-platform-name {
              font-size: calc(13px * var(--font-scale, 1));
              line-height: 1.5;
            }
            .accessibility-department, .accessibility-government {
              font-size: calc(10.5px * var(--font-scale, 1));
              line-height: 1.5;
            }
            .accessibility-effective-date { flex-wrap: wrap; justify-content: center; }
            .accessibility-intro-card {
              padding: 16px 14px 16px 32px;
              align-items: flex-start;
              gap: 11px;
            }
            .accessibility-intro-accent {
              left: 12px;
              top: 14px;
              bottom: 14px;
              width: 4px;
            }
            .accessibility-intro-icon {
              width: 42px;
              height: 42px;
              flex-basis: 42px;
              font-size: 19px;
            }
            .accessibility-intro-text h2 { font-size: calc(14px * var(--font-scale, 1)); }
            .accessibility-intro-text p { font-size: calc(11px * var(--font-scale, 1)); }
            .accessibility-content-section { padding: 18px 0 42px; }
            .accessibility-page-nav { grid-template-columns: 1fr; }
            .accessibility-section-header {
              padding: 16px 14px;
              align-items: flex-start;
            }
            .accessibility-section-number {
              width: 37px;
              height: 37px;
              flex-basis: 37px;
            }
            .accessibility-section-header h2 { font-size: calc(17px * var(--font-scale, 1)); }
            .accessibility-section-body { padding: 17px 15px 20px; }
            .accessibility-section-body > p { font-size: calc(11.5px * var(--font-scale, 1)); }
            .accessibility-feature-card, .accessibility-numbered-item, .accessibility-check-list li { padding: 12px; }
            .accessibility-feature-card { gap: 10px; }
            .accessibility-feature-icon {
              width: 36px;
              height: 36px;
              flex-basis: 36px;
              font-size: 16px;
            }
          }

          /* 400px */
          @media (max-width: 400px) {
            .accessibility-container { padding: 0 10px; }
            .accessibility-hero { padding: 25px 0 22px; }
            .accessibility-hero h1 { font-size: calc(23px * var(--font-scale, 1)); }
            .accessibility-eyebrow { font-size: calc(9px * var(--font-scale, 1)); }
            .accessibility-intro-card { padding: 14px 11px 14px 27px; }
            .accessibility-intro-icon {
              width: 36px;
              height: 36px;
              flex-basis: 36px;
              font-size: 16px;
            }
            .accessibility-section-header { gap: 9px; }
            .accessibility-section-header h2 { font-size: calc(15px * var(--font-scale, 1)); }
            .accessibility-section-number {
              width: 33px;
              height: 33px;
              flex-basis: 33px;
            }
            .accessibility-feature-title-row { align-items: flex-start; }
            .accessibility-feature-card { gap: 8px; }
            .accessibility-numbered-item { gap: 9px; }
          }
        `}</style>
      </main>

      <Footer />
    </div>
  );
}
